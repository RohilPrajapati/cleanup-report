# Cleanup Report System

A simple project that manages users and generates cleanup reports for system maintenance.

---

**Note: The tasks have been completed up to section 3.2. The repository will be updated progressively as additional sections are completed.**

## 📁 Project Structure

```
main-proj-file/
│
├─ backend/                # Django backend
│  ├─ manage.py              # Django management script
│  ├─ requirements.txt       # Python dependencies
│  ├─ pyproject.toml         # Python dependencies (if using uv)
│  ├─ uv.lock                # uv.lock (if using uv)
│  ├─ db.sqlite3             # SQLite (used for demo purpose only)
│  ├─ config/              # Django project settings and wsgi
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  └─ wsgi.py
│  ├─ user/                 # user Django apps
│  │  ├─ models.py
│  │  ├─ views.py
│  │  ├─ urls.py
│  │  ├─ tasks.py           # celery task for user application 
│  │  └─ serializers.py
│  └──── README.md          # backend documentation
└─ README.md                # Project documentation
```

---

## 🚀 Features

### User Module
- /api/cleanup/trigger/  
    REQUEST: POST
    - remove inactive user who inactiv for 30 days or is_active is False
    - store when task was executed and how many inactive user is deleted and how many are active 
- /api/reports/latest/
    REQUEST: GET  
    - paginated response with list of time cleanup task was run
- Dockerize the app using Dockerfile and compose

## ⚙️ Installation

You can install dependencies using **pip** or **uv** — both methods are supported.

### Option 1: Using pip

```bash
git clone https://github.com/yourusername/cleanup-report-system.git
cd cleanup-report-system

python -m venv venv

source venv/bin/activate      # on Linux/Mac
venv\Scripts\activate         # on Windows

pip install -r requirements.txt

python manage.py migrate # migrate table to sqlite database

python manage.py create_periodic_tasks # will create periodic task in database

celery -A config worker -l info # run celery worker
celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler # run celery beats for periodic task trigger
```



### Option 2: Using uv (ultra-fast installer)[Recommended]

sync dependecy

```
uv sync
```
This will:
- Create a virtual environment automatically
- Install all dependencies listed in pyproject.toml
- Ensure dependency versions are pinned consistently

migrate data
```bash
uv run python manage.py migrate
```
this will:
- will create periodic task record in database

Add periodic task
```bash
uv run python manage.py create_periodic_tasks
```
this will:
- will create periodic task record in database
Run celery worker

```bash
uv run celery -A config worker -l info
```
This will:
- run the celery worker (background task executor)

Run celery beat

```bash
uv run celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```
This will:
- this will trigger task based on schedule data from database use for cron jobs periodic task trigger


Run django app
```bash
uv run python manage.py runserver
``` 