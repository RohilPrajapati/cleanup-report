from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from user.models import User, CleanUpReport


@shared_task
def cleanup_inactive_users():
    """Delete users inactive for more than 30 days and log the cleanup."""
    threshold_date = timezone.now() - timedelta(days=30)
    inactive_users = User.objects.filter(
        Q(is_active=False) | Q(last_login__lt=threshold_date)
    )

    users_deleted_count = inactive_users.count()
    inactive_users.delete()

    active_users_remaining = User.objects.filter(is_active=True).count()

    # Log cleanup
    CleanUpReport.objects.create(
        users_deleted=users_deleted_count,
        active_users_remaining=active_users_remaining,
        timestamp=timezone.now(),
    )

    return f"Deleted {users_deleted_count} users. {active_users_remaining} active users remaining."
