"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
import os

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"


class APIRootView(APIView):
    """Custom API root view."""
    
    def get(self, request):
        return Response({
            'message': 'Welcome to OctoFit Tracker API',
            'version': '1.0.0',
            'endpoints': {
                'users': reverse('userprofile-list', request=request),
                'teams': reverse('team-list', request=request),
                'activities': reverse('activity-list', request=request),
                'workouts': reverse('workout-list', request=request),
                'leaderboard': reverse('leaderboard-list', request=request),
                'admin': f'{base_url}/admin/',
            }
        })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', APIRootView.as_view(), name='api-root'),
    path('api/', include('fitness.urls')),
]

