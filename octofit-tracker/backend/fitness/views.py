from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from .models import UserProfile, Team, Activity, Workout, Leaderboard
from .serializers import (
    UserSerializer, UserProfileSerializer, TeamSerializer,
    ActivitySerializer, WorkoutSerializer, LeaderboardSerializer
)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for UserProfile model."""
    
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return profiles ordered by total points (leaderboard)."""
        return UserProfile.objects.all().order_by('-total_points')
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile."""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get top user profiles by total points."""
        limit = request.query_params.get('limit', 10)
        profiles = self.get_queryset()[:int(limit)]
        serializer = self.get_serializer(profiles, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet for Team model."""
    
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return teams ordered by total points."""
        return Team.objects.all().order_by('-total_points')
    
    def perform_create(self, serializer):
        """Set the current user as the team creator."""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the team."""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(id=user_id)
            team.members.add(user)
            return Response(
                {'message': f'User {user.username} added to team'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a member from the team."""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(id=user_id)
            team.members.remove(user)
            return Response(
                {'message': f'User {user.username} removed from team'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get team leaderboard."""
        limit = request.query_params.get('limit', 10)
        teams = self.get_queryset()[:int(limit)]
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)


class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for Activity model."""
    
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return activities ordered by date (most recent first)."""
        return Activity.objects.all().order_by('-activity_date')
    
    def perform_create(self, serializer):
        """Set the current user as the activity owner."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities."""
        activities = Activity.objects.filter(user=request.user).order_by('-activity_date')
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get current user's activity statistics."""
        user = request.user
        activities = Activity.objects.filter(user=user)
        
        stats = {
            'total_activities': activities.count(),
            'total_duration_minutes': activities.aggregate(Sum('duration_minutes'))['duration_minutes__sum'] or 0,
            'total_calories': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'total_points': activities.aggregate(Sum('points_earned'))['points_earned__sum'] or 0,
            'activity_breakdown': activities.values('activity_type').annotate(
                count=Count('id'),
                total_duration=Sum('duration_minutes')
            )
        }
        
        return Response(stats)


class WorkoutViewSet(viewsets.ModelViewSet):
    """ViewSet for Workout model."""
    
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    
    def get_queryset(self):
        """Return workouts ordered by difficulty and duration."""
        return Workout.objects.all().order_by('difficulty_level', 'duration_minutes')
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get workouts filtered by difficulty level."""
        difficulty = request.query_params.get('level')
        
        if difficulty:
            workouts = Workout.objects.filter(difficulty_level=difficulty)
        else:
            workouts = self.get_queryset()
        
        serializer = self.get_serializer(workouts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get workouts filtered by category."""
        category = request.query_params.get('category')
        
        if category:
            workouts = Workout.objects.filter(category=category)
        else:
            workouts = self.get_queryset()
        
        serializer = self.get_serializer(workouts, many=True)
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Leaderboard model (read-only)."""
    
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    
    def get_queryset(self):
        """Return leaderboard entries ordered by rank."""
        return Leaderboard.objects.all().order_by('rank')
    
    @action(detail=False, methods=['get'])
    def individual(self, request):
        """Get individual leaderboard."""
        period = request.query_params.get('period', 'weekly')
        leaderboard = Leaderboard.objects.filter(
            leaderboard_type='individual',
            period=period
        ).order_by('rank')
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def teams(self, request):
        """Get team leaderboard."""
        period = request.query_params.get('period', 'weekly')
        leaderboard = Leaderboard.objects.filter(
            leaderboard_type='team',
            period=period
        ).order_by('rank')
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)

