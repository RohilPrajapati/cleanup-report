from dataclasses import field
from rest_framework import serializers
from user.models import CleanUpReport
from django.contrib.auth import get_user_model

User = get_user_model()


class CleanUpReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleanUpReport
        fields = "__all__"

class UserSafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=100)