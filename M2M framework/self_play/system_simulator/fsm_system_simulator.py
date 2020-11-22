from M2M.self_play.system_simulator.system_action import SystemAction
from M2M.self_play.user_simulator.dialogue_act import DialogueAct
from M2M.self_play.system_simulator.system_task_schema import SystemTaskSchema
from M2M.self_play.system_simulator.system_api import BotRegistrationAPI


class FSMSystemSimulator:

    def __init__(self, task_schema):

        self.data_to_confirm = False
        self.handlers = {}
        self.curr_state = "ASK PREFERENCE"
        self.startState = None
        self.endStates = []
        self.task_schema = SystemTaskSchema(task_schema)
        self.add_state("ASK PREFERENCE", self.ask_preference_transitions)
        self.add_state("QUERY API", self.query_api_transitions)
        self.add_state("EXECUTE REGISTRATION", self.execute_registration_transitions)
        self.add_state("NOTIFY SUCCESS", self.notify_success_transitions)
        self.add_state("NOTIFY FAILURE", self.notify_failure_transitions)
        self.add_state("END", None, 1)
        self.api = BotRegistrationAPI()

    def add_state(self, name, handler, end_state=0):
        name = name.upper()
        self.handlers[name] = handler
        if end_state:
            self.endStates.append(name)

    def set_start(self, name):
        self.startState = name.upper()

    def get_system_action(self, user_action):
        return self.handlers[self.curr_state](user_action)

    def ask_preference_transitions(self, user_action):

        if self.data_to_confirm is True:
            self.task_schema.data["Area"]["value"] = "Some value"
            self.task_schema.data["Area"]["to_confirm"] = False
        result = []
        for da in user_action.dialogue_acts:  # scan all dialogue acts
            if da.act == "inform":
                if self.task_schema.data[da.slot]["to_confirm"]:  # if value needs to be validated
                    self.curr_state = "QUERY API"
                    res = self.handlers[self.curr_state](self.task_schema.data[da.slot]["url"], da.slot, da.value)
                    if res:
                        result.append(res)
                else:
                    self.task_schema.data[da.slot]["value"] = da.value
        # HAS SLOT UNFULFILLED
        """ id result is empty and there are slots unfulfilled"""
        if not result and self.task_schema.has_slots_unfulfilled():  # stay in same state return system action
            result.append([DialogueAct("request", self.task_schema.get_missing_slot())])
        # ALL SLOT FILLED
        elif self.task_schema.is_completed():
            self.curr_state = "EXECUTE REGISTRATION"
            result.append(self.handlers[self.curr_state]())
        return SystemAction([item for sublist in result for item in sublist])

    def query_api_transitions(self, url, slot, value):
        result = self.api.query(slot, value)
        if result == value:
            self.task_schema.data[slot]["value"] = value
            self.task_schema.data[slot]["to_confirm"] = False
            self.curr_state = "ASK PREFERENCE"

        elif isinstance(result, DialogueAct):
            self.task_schema.data[result.slot] = {"value": None, "to_confirm": True, "to_agenda": False, "url": ""}
            self.task_schema.data[slot]["value"] = value
            self.task_schema.data[slot]["to_confirm"] = False
            self.curr_state = "ASK PREFERENCE"
            return [result]

        elif result is not None:
            self.curr_state = "ASK PREFERENCE"
            self.data_to_confirm = True
            return [DialogueAct("confirm", slot, result)]

        else:
            self.curr_state = "ASK PREFERENCE"
            return [DialogueAct("negate"), DialogueAct("request", slot)]

    def execute_registration_transitions(self):
        result = self.api.register(self.task_schema.get_data())
        if result:
            self.curr_state = "NOTIFY SUCCESS"
            return self.handlers[self.curr_state]()
        else:
            self.curr_state = "NOTIFY FAILURE"
            return self.handlers[self.curr_state]()

    def notify_success_transitions(self):
        self.curr_state = "END"
        return [DialogueAct("notify success"), DialogueAct("inform", "Registration", "True")]

    def notify_failure_transitions(self):
        self.curr_state = "END"
        return [DialogueAct("notify failure"), DialogueAct("inform", "Registration", "False")]
