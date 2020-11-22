from M2M.self_play.user_simulator.agenda import Agenda
from M2M.self_play.user_simulator.dialogue_act import DialogueAct
import random
import string


class AgendaBasedSimulator:

    def __init__(self, scenario):
        self.agenda = self.build_agenda(scenario)
        self.user_profile = scenario.user_profile
        self.user_goals = scenario.user_goals
        self.handlers = {}
        self.end_dialogue = False

    # does both get action and set intermediary state
    def select_action(self):
        n_actions = min(self.user_profile.distribution(self.user_profile.verbosity), 3)
        dialogue_acts = self.agenda.get_user_action(n_actions)
        return n_actions, dialogue_acts

    def get_next_state(self, system_action):

        for da in system_action.dialogue_acts:
            self.handlers[da.act](self, da)
            # cleaning step
        self.agenda.remove_duplicates()
        return self.agenda

    @staticmethod
    def build_agenda(scenario):
        agenda = Agenda()

        # add bye act at the end of the agenda
        agenda.add_dialogue_act(DialogueAct('bye'))

        # add request act
        agenda.add_dialogue_act(DialogueAct('request', 'Registration'))

        for user_goal in scenario.user_goals:
            if user_goal.to_agenda:
                agenda.add_dialogue_act(DialogueAct('inform', user_goal.slot, user_goal.value))

        return agenda

    def add_handler(self, handler, name):
        self.handlers[name] = handler

    @staticmethod
    def introduce_misspell(ua):
        for da in ua.dialogue_acts:
            if random.random() > 0.4:
                if da.slot == "Area":
                    print("Error introduced")
                    print(da.value)
                    val = ''.join([x if random.random() >= 0.1 else random.choice(string.ascii_lowercase) for x in list(da.value)])
                    print(val)
                    da.value = val
        return ua
