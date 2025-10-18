from django.contrib import admin
from user.models import CleanUpReport, User, DeadLetterTask

# Register your models here.
admin.site.register(CleanUpReport)
admin.site.register(User)
admin.site.register(DeadLetterTask)