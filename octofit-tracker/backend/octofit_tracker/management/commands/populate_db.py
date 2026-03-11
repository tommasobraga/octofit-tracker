import datetime
from django.core.management.base import BaseCommand
from octofit_tracker.models import OctoFitUser, Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        OctoFitUser.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users...')
        marvel_heroes = [
            ('Iron Man', 'ironman@avengers.com', 'ironman123'),
            ('Spider-Man', 'spiderman@avengers.com', 'spidey123'),
            ('Thor', 'thor@avengers.com', 'mjolnir123'),
            ('Black Widow', 'blackwidow@avengers.com', 'natasha123'),
            ('Captain America', 'cap@avengers.com', 'shield123'),
        ]
        dc_heroes = [
            ('Batman', 'batman@dcheroes.com', 'batman123'),
            ('Superman', 'superman@dcheroes.com', 'krypton123'),
            ('Wonder Woman', 'wonderwoman@dcheroes.com', 'lasso123'),
            ('The Flash', 'flash@dcheroes.com', 'speedster123'),
            ('Aquaman', 'aquaman@dcheroes.com', 'trident123'),
        ]

        marvel_users = []
        for name, email, password in marvel_heroes:
            user = OctoFitUser.objects.create(name=name, email=email, password=password)
            marvel_users.append(user)
            self.stdout.write(f'  Created user: {name}')

        dc_users = []
        for name, email, password in dc_heroes:
            user = OctoFitUser.objects.create(name=name, email=email, password=password)
            dc_users.append(user)
            self.stdout.write(f'  Created user: {name}')

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set(marvel_users)
        self.stdout.write('  Created Team Marvel')

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set(dc_users)
        self.stdout.write('  Created Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            (marvel_users[0], 'running', 30, datetime.date(2024, 1, 10)),
            (marvel_users[1], 'cycling', 45, datetime.date(2024, 1, 11)),
            (marvel_users[2], 'swimming', 60, datetime.date(2024, 1, 12)),
            (marvel_users[3], 'yoga', 40, datetime.date(2024, 1, 13)),
            (marvel_users[4], 'weightlifting', 50, datetime.date(2024, 1, 14)),
            (dc_users[0], 'running', 35, datetime.date(2024, 1, 10)),
            (dc_users[1], 'flying', 20, datetime.date(2024, 1, 11)),
            (dc_users[2], 'strength training', 55, datetime.date(2024, 1, 12)),
            (dc_users[3], 'sprinting', 15, datetime.date(2024, 1, 13)),
            (dc_users[4], 'swimming', 70, datetime.date(2024, 1, 14)),
        ]
        for user, activity_type, duration, date in activities_data:
            Activity.objects.create(user=user, activity_type=activity_type, duration=duration, date=date)
            self.stdout.write(f'  Created activity: {user.name} - {activity_type}')

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            (marvel_users[0], 850),
            (marvel_users[1], 720),
            (marvel_users[2], 930),
            (marvel_users[3], 680),
            (marvel_users[4], 900),
            (dc_users[0], 870),
            (dc_users[1], 950),
            (dc_users[2], 800),
            (dc_users[3], 1000),
            (dc_users[4], 760),
        ]
        for user, score in leaderboard_data:
            Leaderboard.objects.create(user=user, score=score)
            self.stdout.write(f'  Created leaderboard entry: {user.name} - {score}')

        self.stdout.write('Creating workout suggestions...')
        workouts_data = [
            ('Hero Endurance Run', 'A 5km run to build cardiovascular endurance like a hero.', 30.0),
            ('Super Strength Circuit', 'Full-body strength training with compound movements.', 45.0),
            ('Agility Ladder Drills', 'Speed and agility drills inspired by The Flash.', 20.0),
            ('Aqua Cardio', 'Water-based cardio workout for full body conditioning.', 40.0),
            ('Iron Man Core Blast', 'Core stability and strength workout.', 25.0),
            ('Spider-Man Mobility', 'Flexibility and mobility routine for full range of motion.', 35.0),
            ('Thor Power Training', 'Heavy compound lifts to build raw power.', 60.0),
            ('Yoga for Heroes', 'Restorative yoga to improve flexibility and mental focus.', 50.0),
        ]
        for name, description, duration in workouts_data:
            Workout.objects.create(name=name, description=description, duration=duration)
            self.stdout.write(f'  Created workout: {name}')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

