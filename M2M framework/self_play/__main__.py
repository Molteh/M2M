from M2M.self_play.task_schemas.task_schema import TaskSchema
from M2M.self_play.scenario_generator import ScenarioGenerator
from M2M.self_play.user_simulator.agenda_based_simulator import AgendaBasedSimulator
from M2M.self_play.system_simulator.fsm_system_simulator import FSMSystemSimulator
from M2M.self_play.user_simulator.dialogue_act import DialogueAct

from M2M.self_play.task_slots.area import AreaSlot
from M2M.self_play.task_slots.plate import LicensePlateSlot
from M2M.self_play.task_slots.pincode import PincodeSlot
from M2M.self_play.task_slots.phone import PhoneSlot
from M2M.self_play.task_slots.terms import TermsSlot

from M2M.utils.db_connector import DatabaseConnector

import random


"""CONSTANTS"""
n_dialog = 25

"""Define custom beginning of dialogue here"""
START_DIALOGUE1 = [{'sender': "User", 'da': [{'act': 'greeting', 'slot': None, 'value': None}]},
                   {'sender': "Chatbot", 'da': [{'act': 'greeting', 'slot': None, 'value': None},
                    {'act': 'propose', 'slot': 'registration to Siirtosoitto', 'value': None}]},
                   {'sender': "User", 'da': [{'act': 'affirm', 'slot': None, 'value': None}]},
                   {'sender': "Chatbot", 'da': [{'act': 'request', 'slot': 'phone number', 'value': None},
                    {'act': 'request', 'slot': 'license plates', 'value': None},
                    {'act': 'request', 'slot': 'areas', 'value': None},
                    {'act': 'request', 'slot': 'acceptance of terms and conditions', 'value': None}]}]

START_DIALOGUE2 = [{'sender': "User", 'da': [{'act': 'greeting', 'slot': None, 'value': None},
                    {'act': 'inform', 'slot': 'Intent', 'value': 'register'}]},
                   {'sender': "Chatbot", 'da': [{'act': 'affirm', 'slot': None, 'value': None},
                    {'act': 'request', 'slot': 'phone number', 'value': None},
                    {'act': 'request', 'slot': 'license plates', 'value': None},
                    {'act': 'request', 'slot': 'areas', 'value': None},
                    {'act': 'request', 'slot': 'acceptance of terms and conditions', 'value': None}]}]


def main():

    """Connect to MongoDB"""
    db_connector = DatabaseConnector()

    """Task specification - slot definition
    Define all entities that characterize the considered task"""
    phone = PhoneSlot()
    area = AreaSlot()
    pincode = PincodeSlot()
    plate = LicensePlateSlot()
    terms = TermsSlot()
    task_slots = [phone, area, pincode, plate, terms]

    """Main loop, generates N dialogues"""
    for _ in range(n_dialog):
        lines = [da for da in random.choice([START_DIALOGUE1, START_DIALOGUE2])]  # select random custom dialogue start

        """Build scenario from task schema"""
        bot_registration_task = TaskSchema(task_slots)
        scenario_generator = ScenarioGenerator(bot_registration_task)
        scenario = scenario_generator.generate_scenario()

        """Build user simulator using scenario"""
        user_simulator = AgendaBasedSimulator(scenario)

        """User simulator handlers definition
        Defines how the user simulator should handle dialogue
        acts coming from the system simulator"""

        def default_handler(self, dialogue_act):
            return

        def negate_handler(self, dialogue_act):
            self.end_dialogue = True
            return

        def request_handler(self, dialogue_act):
            value = None
            for goal in self.user_goals:
                if goal.slot == dialogue_act.slot:
                    value = goal.value
            self.agenda.add_dialogue_act(DialogueAct("inform", dialogue_act.slot, value))

        def confirm_handler(self, dialogue_act):
            for ug in self.user_goals:
                if ug.slot == dialogue_act.slot and ug.value == dialogue_act.value:
                    return self.agenda.add_dialogue_act(DialogueAct("affirm"))
            return self.agenda.add_dialogue_act(DialogueAct("negate"))

        def inform_handler(self, dialogue_act):
            da = self.agenda.get_dialogue_act(dialogue_act.slot)
            da.value = True
            self.agenda.remove_dialogue_act(da)

        user_simulator.add_handler(request_handler, "request")
        user_simulator.add_handler(default_handler, "affirm")
        user_simulator.add_handler(negate_handler, "negate")
        user_simulator.add_handler(default_handler, "notify success")
        user_simulator.add_handler(inform_handler, "inform")
        user_simulator.add_handler(confirm_handler, "confirm")

        """Build system simulator using the task schema"""
        system_simulator = FSMSystemSimulator(bot_registration_task)

        print(user_simulator.agenda.to_formatted_string())  # print initial agenda
        print("="*20)

        user_state = user_simulator.agenda

        """Build dialogue until ending conditions are met"""
        while len(user_state.dialogue_acts) > 0 and system_simulator.curr_state != "END" and not user_simulator.end_dialogue:

            na, ua = user_simulator.select_action()  # select user action

            ua = user_simulator.introduce_misspell(ua)  # potentially introduce syntactic error into user acts

            print("==> User: ", [da.to_formatted_string() for da in ua.dialogue_acts])
            lines.append({'sender': "User", 'da': [da.to_json_format() for da in ua.dialogue_acts]})

            sa = system_simulator.get_system_action(ua)  # select system action

            print("==> System: ", [da.to_formatted_string() for da in sa.dialogue_acts])
            lines.append({'sender': "Chatbot", 'da': [da.to_json_format() for da in sa.dialogue_acts]})

            user_simulator.get_next_state(sa)  # update agenda

        if not user_simulator.end_dialogue:
            na, ua = user_simulator.select_action()
            print("==> User: ", [da.to_formatted_string() for da in ua.dialogue_acts])
            lines.append({'sender': "User", 'da': [ua.dialogue_acts[-1].to_json_format()]})
        if user_simulator.end_dialogue:  # user interrupts conversation
            print("==> User: ['inform(Registration=interrupted)]")
            lines.append({'sender': "User", 'da': [DialogueAct('inform', 'registration', 'interrupted').to_json_format()]})

        print("Dialogue finished")

        """Save generated dialogue on db"""
        db_connector.create_dialog(lines)

        print("="*20)


if __name__ == "__main__":
    main()
