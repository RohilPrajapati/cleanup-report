#!/bin/bash
set -e

# Only run migrations if we're starting the web service
if [ "$1" = "web" ]; then
    echo "Running database migrations..."
    uv run python manage.py migrate --noinput


    echo "⚙️  Creating periodic tasks..."
    uv run python manage.py create_periodic_tasks || true

    echo "Collecting static files..."
    uv run python manage.py collectstatic --noinput

    echo "Starting Django web server..."
    exec uv run gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
elif [ "$1" = "worker" ]; then
    echo "Starting Celery worker..."
    exec uv run celery -A config worker -l info
elif [ "$1" = "beat" ]; then
    echo "Starting Celery beat..."
    exec uv run celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
else
    # Default: just run whatever command is passed
    exec "$@"
fi
