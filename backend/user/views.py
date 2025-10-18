from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from user.utils import get_token
from user.models import CleanUpReport
from user.serializers import (
    CleanUpReportModelSerializer,
    LoginSerializer,
    UserSafeSerializer,
)
from config.paginations import PagePagination
from user.tasks import cleanup_inactive_users
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.contrib.auth import get_user_model

AuthUser = get_user_model()


# Create your views here.
class CleanUpReportAPIView(APIView, PagePagination):
    def get(self, request):
        clean_up_report = CleanUpReport.objects.all().order_by("-timestamp")
        paginated_data = self.paginate_queryset(clean_up_report, request)
        serializer = CleanUpReportModelSerializer(paginated_data, many=True)
        return self.get_paginated_response(serializer.data)


class CleanUpTrigger(APIView):
    throttle_scope = "manual_clean_up"

    def post(self, request):
        cleanup_inactive_users.delay(request.user.email)
        return Response(
            {"detail": "Request to CleanUp trigger"}, status=status.HTTP_200_OK
        )


# auth endpoints


class LoginAPIView(APIView):
    throttle_scope = "login_per_day"
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {
                "detail": "Login Successful",
                "user_detail": UserSafeSerializer(user).data,
                "token": get_token(user),
            },
            status=status.HTTP_200_OK,
        )


class LogoutUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"detail": "Refresh token required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT
            )

        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RefreshTokenAPIView(TokenRefreshView):
    """
    Refresh token and also return user data.
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user = AuthUser.objects.get(id=refresh["user_id"])
        except AuthUser.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Generate new tokens using your function to include custom claims
        tokens = get_token(user)
        user_data = UserSafeSerializer(user).data

        if getattr(settings, "SIMPLE_JWT", {}).get("BLACKLIST_AFTER_ROTATION", False):
            # expire after refresh
            try:
                refresh.blacklist()
            except AttributeError:
                # Blacklist app may not be installed/enabled
                pass
        return Response(
            {"token": tokens, "user_detail": user_data}, status=status.HTTP_200_OK
        )
