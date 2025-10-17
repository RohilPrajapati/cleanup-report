import os
import django
from faker import Faker
import random
from django.utils import timezone  # <--- important

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import User  # import your model

fake = Faker()

NUM_USERS = 50

for _ in range(NUM_USERS):
    email = fake.unique.email()
    last_login = fake.date_time_between(start_date='-60d', end_date='now')
    is_active = random.choice([True, False])

    user = User.objects.create(
        email=email,
        last_login=last_login,
        is_active=is_active
    )

print(f"Successfully created {NUM_USERS} users!")
