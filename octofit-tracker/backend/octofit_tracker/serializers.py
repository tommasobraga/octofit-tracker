from rest_framework import serializers
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout


class OctoFitUserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = OctoFitUser
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def get_id(self, obj):
        return str(obj.pk)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = OctoFitUserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=OctoFitUser.objects.all(), source='members', write_only=True, required=False
    )

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'member_ids']

    def get_id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = OctoFitUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=OctoFitUser.objects.all(), source='user', write_only=True, required=False
    )

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'activity_type', 'duration', 'date']

    def get_id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = OctoFitUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=OctoFitUser.objects.all(), source='user', write_only=True, required=False
    )

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'user_id', 'score']

    def get_id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'duration']

    def get_id(self, obj):
        return str(obj.pk)
