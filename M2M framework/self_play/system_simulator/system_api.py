from M2M.self_play.user_simulator.dialogue_act import DialogueAct
from M2M.utils.area_loader import AreaLoader

import phonenumbers
import re


class BotRegistrationAPI:

    def __init__(self):
        self.validators = {
            "Phone number": self.validate_phone,
            "Area": self.validate_area,
            "License plate": self.validate_plate,
            "Pincode": self.validate_pincode
        }

    def query(self, slot, value):
        return self.validators[slot](value)

    """Dummy register function that always returns true"""
    @staticmethod
    def register(data):
        print('Registering with the following data:\n' + data)
        return True

    # validators

    """Check if phone format is correct with respect to Finnish formats"""
    @staticmethod
    def validate_phone(phone):
        z = phonenumbers.parse(phone, "FI")
        if phonenumbers.is_valid_number(z):
            return DialogueAct("request", "Pincode")
        else:
            return None

    """If area matches return areas otherwise return closes match"""
    @staticmethod
    def validate_area(area):
        area_manager = AreaLoader()
        if area_manager.verify_area(area):
            return area
        else:
            return area_manager.get_close_match(area)

    @staticmethod
    def validate_pincode(pincode):
        return pincode

    """Check if license plate is correct with respect to Finnish format"""
    @staticmethod
    def validate_plate(plate):
        p = re.compile('^([A-Z0]{2,3})-?([1-9][0-9]{0,2})$')
        if p.match(plate):
            return plate
        else:
            return None
