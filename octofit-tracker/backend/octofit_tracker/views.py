from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
from .serializers import (
    OctoFitUserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer
)


@api_view(['GET'])
def api_root(request, format=None):
    base = request.build_absolute_uri('/api/')
    return Response({
        'users': f"{base}users/",
        'teams': f"{base}teams/",
        'activities': f"{base}activities/",
        'leaderboard': f"{base}leaderboard/",
        'workouts': f"{base}workouts/",
    })


class OctoFitUserViewSet(viewsets.ModelViewSet):
    queryset = OctoFitUser.objects.all()
    serializer_class = OctoFitUserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
