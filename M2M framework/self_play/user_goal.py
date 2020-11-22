class UserGoal:
    def __init__(self, slot, value, to_agenda):
        self.slot = slot
        self.value = value

        self.to_agenda = to_agenda  # whether the goal should be included in the user's agenda or not
