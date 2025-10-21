from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from user.models import User, CleanUpReport, DeadLetterTask
from django.core.mail import mail_admins, send_mail
from django.db import transaction
from django.conf import settings


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def cleanup_inactive_users(self, to_email=None):
    """Delete users inactive for more than 30 days and log the cleanup."""
    try:
        threshold_date = timezone.now() - timedelta(days=30)

        with transaction.atomic():
            inactive_users = User.objects.filter(
                Q(is_active=False) | Q(last_login__lt=threshold_date)
            )

            users_deleted_count = inactive_users.count()
            inactive_users.delete()

            active_users_remaining = User.objects.filter(is_active=True).count()

            # error
            # raise Exception("Some issue with task. might be any component fail api not working etc")

            # Log cleanup result
            CleanUpReport.objects.create(
                users_deleted=users_deleted_count,
                active_users_remaining=active_users_remaining,
                timestamp=timezone.now(),
            )
            subject = "Cleanup Report Generated"
            message = f"""
            The cleanup process has been completed.

            Users deleted: {users_deleted_count}
            Active users remaining: {active_users_remaining}

            Timestamp: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            if to_email:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[to_email],
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
        mail_admins(
            subject="Celery Cleanup Task Failed",
            message=str(exc),
        )
        raise


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def task_submit_assignment(self):
    """
    Simple task just to send email
    """
    try:
        subject = "TASK SCHEDULE USING CELERY"
        message = f"""
        Hello Hiring Manager,

        Here are detail about task submission

        github link: https://github.com/RohilPrajapati/cleanup-report
        
        Feature:
            - dockerize project
            - authentication with refresh token are blacklist after rotation or logout
            - email reporting when clean task is executed
            - email error reporting to admin if any thing break
            - celery with dead letter queue implement to track failed task  

        Regards
        Rohil Prajapati
        """
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SUBMISSION_EMAIL,],
        )
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
        mail_admins(
            subject="Celery Cleanup Task Failed",
            message=str(exc),
        )
        raise
