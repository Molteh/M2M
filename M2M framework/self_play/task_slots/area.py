from M2M.self_play.task_slots.task_slot import TaskSlot
from M2M.utils.area_loader import AreaLoader

import numpy as np


class AreaSlot(TaskSlot):

    def __init__(self):
        self.name = "Area"
        self.to_validate = True
        self.to_agenda = True
        super().__init__()

    def sample_value(self):
        area_loader = AreaLoader()
        return [area_loader.sample_area() for _ in range(np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2]))]
