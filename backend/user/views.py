from rest_framework.views import APIView
from rest_framework import status

from rest_framework.response import Response

from user.models import CleanUpReport
from user.serializers import CleanUpReportModelSerializer
from config.paginations import PagePagination
from user.tasks import cleanup_inactive_users


# Create your views here.
class CleanUpReportAPIView(APIView, PagePagination):
    def get(self, request):
        clean_up_report = CleanUpReport.objects.all().order_by("-timestamp")
        paginated_data = self.paginate_queryset(clean_up_report, request)
        serializer = CleanUpReportModelSerializer(paginated_data, many=True)
        return self.get_paginated_response(serializer.data)


class CleanUpTrigger(APIView):
    def post(self, request):
        cleanup_inactive_users.delay()
        return Response(
            {"message": "Request to CleanUp trigger"}, status=status.HTTP_200_OK
        )
