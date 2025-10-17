from django.contrib import admin
from user.models import CleanUpReport, User

# Register your models here.
admin.site.register(CleanUpReport)
admin.site.register(User)