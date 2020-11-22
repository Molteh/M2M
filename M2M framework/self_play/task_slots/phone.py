from M2M.self_play.task_slots.task_slot import TaskSlot
import string
import random


class PhoneSlot(TaskSlot):

    def __init__(self):
        self.name = "Phone number"
        self.to_validate = True
        self.to_agenda = True
        super().__init__()

    def sample_value(self):
        phone = '04' + ''.join(random.choice(string.digits) for _ in range(7))

        non_existing_phone = '39' + ''.join(random.choice(string.digits) for _ in range(6))

        if random.random() > 1:
            return [non_existing_phone]
        return [phone]
