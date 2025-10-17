from django.urls import path
from user import views

urlpatterns = [
    path('reports/latest/', views.CleanUpReportAPIView.as_view(), name="report_latest"),
    path('cleanup/trigger/', views.CleanUpTrigger.as_view(), name="clean_up_trigger"),
    path('login/', views.LoginAPIView.as_view(), name="login"),
    path('logout/', views.LogoutUserView.as_view(), name="logout"),
    path('refresh/', views.RefreshTokenAPIView.as_view(), name="refresh"),
]
