import os
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
import datetime


class OctoFitUserTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'name': 'Iron Man',
            'email': 'ironman@avengers.com',
            'password': 'iamironman',
        }
        self.user = OctoFitUser.objects.create(**self.user_data)

    def tearDown(self):
        OctoFitUser.objects.all().delete()

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'name': 'Spider-Man', 'email': 'spiderman@avengers.com', 'password': 'webslinger'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_user(self):
        response = self.client.get(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Iron Man')

    def test_update_user(self):
        data = {'name': 'Tony Stark', 'email': 'ironman@avengers.com', 'password': 'iamironman'}
        response = self.client.put(f'/api/users/{self.user.pk}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Tony Stark')

    def test_delete_user(self):
        response = self.client.delete(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TeamTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            name='Thor', email='thor@avengers.com', password='mjolnir'
        )
        self.team = Team.objects.create(name='Team Marvel')
        self.team.members.add(self.user)

    def tearDown(self):
        Team.objects.all().delete()
        OctoFitUser.objects.all().delete()

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'Team DC', 'member_ids': []}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team(self):
        response = self.client.get(f'/api/teams/{self.team.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Team Marvel')


class ActivityTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            name='Black Widow', email='blackwidow@avengers.com', password='natasha'
        )
        self.activity = Activity.objects.create(
            user=self.user, activity_type='running', duration=30.0, date=datetime.date.today()
        )

    def tearDown(self):
        Activity.objects.all().delete()
        OctoFitUser.objects.all().delete()

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_activity(self):
        data = {
            'user_id': self.user.pk,
            'activity_type': 'cycling',
            'duration': 45.0,
            'date': str(datetime.date.today()),
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_activity(self):
        response = self.client.get(f'/api/activities/{self.activity.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['activity_type'], 'running')


class LeaderboardTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            name='Captain America', email='cap@avengers.com', password='shield'
        )
        self.entry = Leaderboard.objects.create(user=self.user, score=500)

    def tearDown(self):
        Leaderboard.objects.all().delete()
        OctoFitUser.objects.all().delete()

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_leaderboard_entry(self):
        data = {'user_id': self.user.pk, 'score': 750}
        response = self.client.post('/api/leaderboard/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_leaderboard_entry(self):
        response = self.client.get(f'/api/leaderboard/{self.entry.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 500)


class WorkoutTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Hero Training', description='Full body workout for heroes', duration=60.0
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        data = {
            'name': 'Cardio Blast',
            'description': 'High intensity cardio',
            'duration': 30.0,
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_workout(self):
        response = self.client.get(f'/api/workouts/{self.workout.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Hero Training')

    def test_update_workout(self):
        data = {'name': 'Updated Training', 'description': 'Updated description', 'duration': 45.0}
        response = self.client.put(f'/api/workouts/{self.workout.pk}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_workout(self):
        response = self.client.delete(f'/api/workouts/{self.workout.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
