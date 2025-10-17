from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, IntervalSchedule

class Command(BaseCommand):
    help = 'Create periodic tasks in Celery Beat'

    def handle(self, *args, **options):
        schedule, created = IntervalSchedule.objects.get_or_create(
            every=5,
            period=IntervalSchedule.MINUTES,
        )

        task, created = PeriodicTask.objects.get_or_create(
            interval=schedule,
            name='Cleanup Inactive Users',
            task='user.tasks.cleanup_inactive_users',
        )
        
        self.stdout.write(self.style.SUCCESS('Periodic task created successfully.'))
