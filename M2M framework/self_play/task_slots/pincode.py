from M2M.self_play.task_slots.task_slot import TaskSlot
import random


class PincodeSlot(TaskSlot):

    def __init__(self):
        self.name = "Pincode"
        self.to_validate = False
        self.to_agenda = False
        super().__init__()

    def sample_value(self):
        pincode = 1000 + random.randint(0, 8999)
        return [pincode]
