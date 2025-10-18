from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from user.models import User, CleanUpReport, DeadLetterTask
from django.core.mail import mail_admins


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def cleanup_inactive_users(self):
    """Delete users inactive for more than 30 days and log the cleanup."""
    try:
        threshold_date = timezone.now() - timedelta(days=30)

        inactive_users = User.objects.filter(
            Q(is_active=False) | Q(last_login__lt=threshold_date)
        )

        users_deleted_count = inactive_users.count()
        inactive_users.delete()

        active_users_remaining = User.objects.filter(is_active=True).count()

        # use this to raise the error
        # raise Exception("Error occur")

        # Log cleanup result
        CleanUpReport.objects.create(
            users_deleted=users_deleted_count,
            active_users_remaining=active_users_remaining,
            timestamp=timezone.now(),
        )

        return f"Deleted {users_deleted_count} users. {active_users_remaining} active users remaining."

    except Exception as exc:
        # Retry once if transient DB error
        if self.request.retries < self.max_retries:
            raise self.retry(exc=exc)

        DeadLetterTask.objects.create(
            task_name=self.name,
            args=self.request.args,
            kwargs=self.request.kwargs,
            error=str(exc),
            retries=self.request.retries,
        )

        # Notify admin after final failure
        print(len(str(exc)))
        mail_admins(
            subject="Celery Cleanup Task Failed",
            message=str(exc),
        )
        raise
