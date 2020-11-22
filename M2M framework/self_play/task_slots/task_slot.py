from abc import ABC, abstractmethod


class TaskSlot(ABC):
    def __init__(self):
        self.url = None
        super().__init__()

    @abstractmethod
    def sample_value(self):
        pass
