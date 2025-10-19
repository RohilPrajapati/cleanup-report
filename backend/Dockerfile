# Use official Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

# Copy requirements files
COPY pyproject.toml uv.lock /app/

# Copy project
COPY . /app

RUN uv sync --locked
RUN uv run python manage.py migrate
RUN uv run python manage.py create_periodic_tasks 
RUN uv run python manage.py collectstatic --noinput

# Expose port (uv default)
EXPOSE 8000

# Run Django with uv
CMD ["uv", "run","gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
