import random
import json


class SystemTaskSchema:

    def __init__(self, task_schema):
        self.data = {}
        for ts in task_schema.task_slots:
            self.data[ts.name] = {"value": None, "to_confirm": ts.to_validate, "to_agenda": ts.to_agenda, "url": ts.url}

    def has_slots_unfulfilled(self):
        for el in self.data.values():
            if el["value"] is None and el["to_agenda"]:
                return True
        return False

    def is_completed(self):
        for el in self.data.values():
            if el["value"] is None:
                return False
        return True

    def get_missing_slot(self):
        res = list(filter(lambda k: self.data[k]["value"] is None and self.data[k]["to_agenda"], self.data.keys()))
        if res:
            return random.choice(res)
        else:
            return None

    def get_data(self):
        return json.JSONEncoder().encode(self.data)
