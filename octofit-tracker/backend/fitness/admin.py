from django.contrib import admin
from .models import UserProfile, Team, Activity, Workout, Leaderboard


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'fitness_level', 'age', 'total_points')
    list_filter = ('fitness_level', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'total_points', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'created_by__username')
    filter_horizontal = ('members',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'duration_minutes', 'intensity_level', 'points_earned', 'activity_date')
    list_filter = ('activity_type', 'intensity_level', 'activity_date')
    search_fields = ('user__username', 'description')
    readonly_fields = ('points_earned', 'created_at')
    date_hierarchy = 'activity_date'


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'difficulty_level', 'duration_minutes')
    list_filter = ('category', 'difficulty_level')
    search_fields = ('name', 'description')
    filter_horizontal = ('recommended_for',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'get_name', 'leaderboard_type', 'period', 'points')
    list_filter = ('leaderboard_type', 'period')
    search_fields = ('user__username', 'team__name')
    readonly_fields = ('updated_at',)
    
    def get_name(self, obj):
        if obj.user:
            return obj.user.username
        return obj.team.name
    get_name.short_description = 'Name'
