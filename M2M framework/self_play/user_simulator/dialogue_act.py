class DialogueAct:

    def __init__(self, act, slot=None, value=None):

        self.act = act
        self.slot = slot
        self.value = value

    def to_formatted_string(self):
        if self.slot:
            if self.value:
                return '{}({}={})'.format(self.act, self.slot, self.value)
            return '{}({})'.format(self.act, self.slot)
        return '{}()'.format(self.act)

    def to_json_format(self):

        return {
            "act": self.act,
            "slot": self.slot,
            "value": self.value
        }

    def __eq__(self, other):
        try:
            return self.act == other.act\
                and self.slot == other.slot\
                   and self.value == other.value
        except:
            return False

    def __hash__(self):
        return hash(('act', self.act,
                     'slot', self.slot,
                     'value', self.value))
