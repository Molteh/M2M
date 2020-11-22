class Scenario:
    """Scenario characterized by user profile
    and user goals as specified in arXiv:1801.04871v1 [cs.AI] 15 Jan 2018"""
    def __init__(self, user_profile, user_goals):
        self.user_profile = user_profile
        self.user_goals = user_goals
