from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Team, Activity, Workout, Leaderboard


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserProfile
        fields = (
            'id', 'user', 'user_id', 'age', 'fitness_level', 'goal',
            'height_cm', 'weight_kg', 'total_points', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'total_points', 'created_at', 'updated_at')


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model."""
    
    created_by = UserSerializer(read_only=True)
    created_by_id = serializers.IntegerField(write_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True,
        source='members'
    )
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = (
            'id', 'name', 'description', 'created_by', 'created_by_id',
            'members', 'member_ids', 'member_count', 'total_points',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'total_points', 'created_at', 'updated_at')
    
    def get_member_count(self, obj):
        return obj.members.count()


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model."""
    
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    team = TeamSerializer(read_only=True)
    team_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Activity
        fields = (
            'id', 'user', 'user_id', 'activity_type', 'description',
            'duration_minutes', 'calories_burned', 'intensity_level',
            'distance_km', 'points_earned', 'activity_date', 'team',
            'team_id', 'created_at'
        )
        read_only_fields = ('id', 'points_earned', 'created_at')


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for Workout model."""
    
    recommended_for = UserProfileSerializer(many=True, read_only=True)
    recommended_for_ids = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(),
        many=True,
        write_only=True,
        source='recommended_for',
        required=False
    )
    
    class Meta:
        model = Workout
        fields = (
            'id', 'name', 'description', 'category', 'difficulty_level',
            'duration_minutes', 'instructions', 'recommended_for',
            'recommended_for_ids', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for Leaderboard model."""
    
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = (
            'id', 'leaderboard_type', 'period', 'user', 'team',
            'rank', 'points', 'updated_at'
        )
        read_only_fields = ('id', 'updated_at')
