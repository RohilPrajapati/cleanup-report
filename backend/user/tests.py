from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from user.models import User, CleanUpReport
from user.tasks import cleanup_inactive_users


class CleanupInactiveUsersTaskTest(TestCase):
    def setUp(self):
        now = timezone.now()

        # Active user (should remain)
        self.active_user = User.objects.create(
            email="active@example.com", last_login=now, is_active=True
        )

        # Inactive user older than 30 days (should be deleted)
        self.inactive_old = User.objects.create(
            email="inactive_old@example.com",
            last_login=now - timedelta(days=40),
            is_active=False,
        )

        # Inactive user recent login (should NOT be deleted)
        self.inactive_recent = User.objects.create(
            email="inactive_recent@example.com",
            last_login=now - timedelta(days=10),
            is_active=False,
        )

    def test_cleanup_task_deletes_correct_users(self):
        result = cleanup_inactive_users()

        # Check deleted users
        self.assertFalse(User.objects.filter(email="inactive_old@example.com").exists())

        # Check users that remain
        self.assertFalse(
            User.objects.filter(email="inactive_recent@example.com").exists()
        )
        print(User.objects.filter(email="active@example.com").exists())
        self.assertTrue(User.objects.filter(email="active@example.com").exists())

        # Check CleanUpReport
        report = CleanUpReport.objects.last()
        self.assertEqual(report.users_deleted, 2)
        self.assertEqual(report.active_users_remaining, 1)

    def test_cleanup_task_no_inactive_users(self):
        # Delete all inactive users first
        User.objects.filter(is_active=False).delete()

        result = cleanup_inactive_users()

        self.assertIn("Deleted 0 users", result)
        report = CleanUpReport.objects.last()
        self.assertEqual(report.users_deleted, 0)
        self.assertEqual(report.active_users_remaining, 1)
