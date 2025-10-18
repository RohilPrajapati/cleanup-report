from django.core.management.base import BaseCommand
from user.tasks import task_submit_assignment
import socket
from celery import current_app

class Command(BaseCommand):
    help = 'Submit the assignment form terminal using celery task'

    def handle(self, *args, **options):
        # Check if Celery worker is running by pinging it
        i = current_app.control.inspect(timeout=1)
        active_workers = i.active()

        if not active_workers:
            self.stdout.write(self.style.ERROR('No Celery worker is running!'))
            return

        # Trigger the task
        task_submit_assignment.delay()
        self.stdout.write(self.style.SUCCESS(
            f'Submitted successfully.'
        ))
