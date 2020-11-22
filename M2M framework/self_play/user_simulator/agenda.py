from M2M.self_play.user_simulator.user_action import UserAction


class Agenda:

    def __init__(self):
        self.dialogue_acts = []
        return

    def get_user_action(self, n_actions):
        try:
            assert (n_actions <= len(self.dialogue_acts)-2), 'number of actions must be smaller than Agenda size\n'

        except AssertionError as error:
            print(error, 'Returning all available dialogue acts')
            n_actions = len(self.dialogue_acts)
        finally:
            selected_dialogue_acts = []
            for _ in range(0, n_actions):
                if self.dialogue_acts[-1].act == "request":
                    break
                selected_dialogue_acts.append(self.dialogue_acts.pop())
            return UserAction(selected_dialogue_acts)

    def add_dialogue_act(self, dialogue_act):
        self.dialogue_acts.append(dialogue_act)

    def get_dialogue_act(self, slot):
        for da in self.dialogue_acts:
            if da.slot == slot:
                return da

    def remove_dialogue_act(self, da):
        self.dialogue_acts.remove(da)

    def remove_duplicates(self):
        seen_das = set()
        new_list = []
        for obj in reversed(self.dialogue_acts):
            if obj not in seen_das:
                new_list.append(obj)
                seen_das.add(obj)
        self.dialogue_acts = list(reversed(new_list))

    def to_formatted_string(self):
        result = ''
        for da in reversed(self.dialogue_acts):
            result += '{}\n'.format(da.to_formatted_string())
        return result
