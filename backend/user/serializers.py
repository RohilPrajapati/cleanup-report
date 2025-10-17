from rest_framework import serializers
from user.models import CleanUpReport


class CleanUpReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleanUpReport
        fields = '__all__'
