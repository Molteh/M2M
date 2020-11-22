# modules imports
from M2M.self_play.user_profile import UserProfile
from M2M.self_play.user_goal import UserGoal
from M2M.self_play.scenario import Scenario

# library imports
import numpy as np
import random


class ScenarioGenerator:
    """Given a task schema it sample a scenario based on it"""
    def __init__(self, task_schema):
        self.task_schema = task_schema

    def generate_scenario(self):
        user_profile = self.generate_user_profile()
        user_goals = self.generate_user_goals()
        return Scenario(user_profile, user_goals)

    @staticmethod
    def generate_user_profile():
        verbosity = np.random.rand()
        return UserProfile(verbosity)

    def generate_user_goals(self):
        user_goals = []
        for slot in self.task_schema.task_slots:
            for value in slot.sample_value():
                user_goals.append(UserGoal(slot.name, value, slot.to_agenda))

        random.shuffle(user_goals)  # shuffle user goals
        return user_goals
