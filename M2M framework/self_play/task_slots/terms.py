from M2M.self_play.task_slots.task_slot import TaskSlot


class TermsSlot(TaskSlot):

    def __init__(self):
        self.name = "Terms and conditions"
        self.to_validate = False
        self.to_agenda = True
        super().__init__()

    def sample_value(self):
        return [True]
