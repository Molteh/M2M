from M2M.self_play.task_slots.task_slot import TaskSlot
import string
import random
import numpy as np


class LicensePlateSlot(TaskSlot):

    def __init__(self):
        self.name = "License plate"
        self.to_validate = True
        self.to_agenda = True
        super().__init__()

    def sample_value(self):
        return [self.generate_plate() for _ in range(np.random.choice([1, 2, 3], p=[0.7, 0.2, 0.1]))]

    @staticmethod
    def generate_plate():
        plate = ''.join(random.choice(string.ascii_uppercase) for _ in range(3))
        plate += '-'
        plate += ''.join(random.choice(string.digits) for _ in range(3))

        non_existing_plate = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))

        if random.random() > 1:
            return non_existing_plate
        return plate
