from django.db import models


# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=100)
    last_login = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.email}_{self.last_login.date()}"


class CleanUpReport(models.Model):
    timestamp = models.DateTimeField()
    users_deleted = models.IntegerField()
    active_users_remaining = models.IntegerField()

    def __str__(self):
        return f"{self.users_deleted}_{self.active_users_remaining}"