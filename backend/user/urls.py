from django.contrib import admin
from django.urls import path
from user import views

urlpatterns = [
    path('reports/latest/', views.CleanUpReportAPIView.as_view(), name="report_latest"),
    path('cleanup/trigger/', views.CleanUpTrigger.as_view(), name="clean_up_trigger"),
]
