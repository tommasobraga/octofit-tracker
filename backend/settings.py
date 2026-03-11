# Dummy settings.py for check compatibility
DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": "octofit_db",
    }
}

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "djongo",
]
