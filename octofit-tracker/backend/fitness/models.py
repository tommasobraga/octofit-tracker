from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class UserProfile(models.Model):
	"""Extended user profile for fitness tracking."""
    
	FITNESS_LEVELS = [
		('beginner', 'Beginner'),
		('intermediate', 'Intermediate'),
		('advanced', 'Advanced'),
		('expert', 'Expert'),
	]
    
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fitness_profile')
	age = models.IntegerField(
		validators=[MinValueValidator(13), MaxValueValidator(120)],
		null=True,
		blank=True
	)
	fitness_level = models.CharField(
		max_length=20,
		choices=FITNESS_LEVELS,
		default='beginner'
	)
	goal = models.CharField(
		max_length=500,
		blank=True,
		help_text="User's fitness goal"
	)
	height_cm = models.FloatField(
		null=True,
		blank=True,
		validators=[MinValueValidator(100), MaxValueValidator(250)]
	)
	weight_kg = models.FloatField(
		null=True,
		blank=True,
		validators=[MinValueValidator(30), MaxValueValidator(300)]
	)
	total_points = models.IntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
    
	class Meta:
		ordering = ['-total_points']
    
	def __str__(self):
		return f"{self.user.username} - {self.fitness_level}"


class Team(models.Model):
	"""Team model for group fitness activities."""
    
	name = models.CharField(max_length=200, unique=True)
	description = models.TextField(blank=True)
	members = models.ManyToManyField(User, related_name='teams')
	created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_teams')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	total_points = models.IntegerField(default=0)
    
	class Meta:
		ordering = ['-total_points']
    
	def __str__(self):
		return self.name


class Activity(models.Model):
	"""Activity logging model for tracking user workouts."""
    
	ACTIVITY_TYPES = [
		('running', 'Running'),
		('cycling', 'Cycling'),
		('swimming', 'Swimming'),
		('gym', 'Gym'),
		('yoga', 'Yoga'),
		('hiking', 'Hiking'),
		('sports', 'Sports'),
		('other', 'Other'),
	]
    
	INTENSITY_LEVELS = [
		('low', 'Low'),
		('moderate', 'Moderate'),
		('high', 'High'),
		('very_high', 'Very High'),
	]
    
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
	activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
	description = models.TextField(blank=True)
	duration_minutes = models.IntegerField(
		validators=[MinValueValidator(1)],
		help_text="Duration in minutes"
	)
	calories_burned = models.IntegerField(
		validators=[MinValueValidator(0)],
		default=0
	)
	intensity_level = models.CharField(
		max_length=20,
		choices=INTENSITY_LEVELS,
		default='moderate'
	)
	distance_km = models.FloatField(
		null=True,
		blank=True,
		validators=[MinValueValidator(0)]
	)
	points_earned = models.IntegerField(default=0)
	activity_date = models.DateTimeField(default=timezone.now)
	created_at = models.DateTimeField(auto_now_add=True)
	team = models.ForeignKey(
		Team,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='activities'
	)
    
	class Meta:
		ordering = ['-activity_date']
		verbose_name_plural = "activities"
    
	def __str__(self):
		return f"{self.user.username} - {self.activity_type} ({self.activity_date})"
    
	def save(self, *args, **kwargs):
		"""Calculate points based on duration, intensity, and activity type."""
		if not self.pk:  # Only calculate on creation
			multiplier = {
				'low': 1,
				'moderate': 1.5,
				'high': 2,
				'very_high': 2.5,
			}
			intensity_mult = multiplier.get(self.intensity_level, 1)
			self.points_earned = int(self.duration_minutes * intensity_mult)
		super().save(*args, **kwargs)


class Workout(models.Model):
	"""Personalized workout suggestions model."""
    
	WORKOUT_CATEGORIES = [
		('cardio', 'Cardio'),
		('strength', 'Strength'),
		('flexibility', 'Flexibility'),
		('endurance', 'Endurance'),
		('mixed', 'Mixed'),
	]
    
	DIFFICULTY_LEVELS = [
		('beginner', 'Beginner'),
		('intermediate', 'Intermediate'),
		('advanced', 'Advanced'),
	]
    
	name = models.CharField(max_length=200)
	description = models.TextField()
	category = models.CharField(max_length=20, choices=WORKOUT_CATEGORIES)
	difficulty_level = models.CharField(
		max_length=20,
		choices=DIFFICULTY_LEVELS,
		default='beginner'
	)
	duration_minutes = models.IntegerField(
		validators=[MinValueValidator(5), MaxValueValidator(180)]
	)
	instructions = models.TextField(help_text="Step-by-step workout instructions")
	recommended_for = models.ManyToManyField(
		UserProfile,
		related_name='recommended_workouts',
		blank=True
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
    
	class Meta:
		ordering = ['difficulty_level', 'duration_minutes']
    
	def __str__(self):
		return f"{self.name} ({self.difficulty_level})"


class Leaderboard(models.Model):
	"""Leaderboard model for tracking rankings."""
    
	LEADERBOARD_TYPES = [
		('individual', 'Individual'),
		('team', 'Team'),
	]
    
	leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPES)
	period = models.CharField(
		max_length=20,
		choices=[
			('weekly', 'Weekly'),
			('monthly', 'Monthly'),
			('all_time', 'All Time'),
		],
		default='weekly'
	)
	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		null=True,
		blank=True,
		related_name='leaderboard_entries'
	)
	team = models.ForeignKey(
		Team,
		on_delete=models.CASCADE,
		null=True,
		blank=True,
		related_name='leaderboard_entries'
	)
	rank = models.IntegerField()
	points = models.IntegerField()
	updated_at = models.DateTimeField(auto_now=True)
    
	class Meta:
		unique_together = ('leaderboard_type', 'period', 'user', 'team', 'rank')
		ordering = ['rank']
    
	def __str__(self):
		if self.user:
			return f"{self.rank}. {self.user.username} - {self.points} pts ({self.period})"
		else:
			return f"{self.rank}. {self.team.name} - {self.points} pts ({self.period})"
from django.db import models

# Create your models here.
