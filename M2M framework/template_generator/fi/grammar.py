from M2M.template_generator.fi.custom_templates import CustomTemplates

entities = {
    "License plate": 'Rekisterikilpi',
    "Area": 'ilmoitusalue',
    "phone number": 'puhelinnumero',
    "Phone number": 'Puhelinnumero',
    "Pincode": 'Pin-koodi',
    "Terms and conditions": 'Käyttöehdot',
    "registration": 'rekisteröinti',
    "registration to Siirtosoitto": 'ilmoittautuminen Siirtosoittoon',
    "license plates": 'rekisterikilvet',
    "areas": 'alueet',
    "acceptance of terms and conditions": 'ehtojen hyväksyminen'

}

class Grammar:

    def __init__(self):

        self.templates = {
            "inform": self.inform_template,
            "request": self.request_template,
            "confirm": self.confirm_template,
            "negate": self.negate_template,
            "affirm": self.affirm_template,
            "notify success": self.notify_success_template,
            "bye": self.bye_template,
            "greeting": self.greeting_template,
            "propose": self.propose_template
        }

        return


    def get_template(self, ann, prev_ann, next_ann):
        return self.templates[ann['act']](ann, prev_ann, next_ann)

    #  @todo addition of and and spaces should be done by template generator

    @staticmethod
    #  @todo inform at least require custom handlers for various values
    def inform_template(ann, prev_ann, next_ann):
        custom_template = CustomTemplates.get_template(ann)
        if prev_ann is not None:
            if prev_ann['act'] == 'inform':
                if custom_template is not None:
                    return ' ja ' + custom_template
                return ' ja {} on {}'.format(entities[ann['slot']], ann['value'])
            if custom_template is not None:
                return ' ja ' + custom_template
            return ' {} on {}'.format(entities[ann['slot']], ann['value'])
        if custom_template is not None:
            return custom_template
        return '{} on {}'.format(entities[ann['slot']], ann['value'])

    @staticmethod
    def request_template(ann, prev_ann, next_ann):
        custom_template = CustomTemplates.get_template(ann)
        if prev_ann is not None:
            if prev_ann['act'] == 'negate':
                if custom_template is not None:
                    return ', antaa viite seuraavalle: {}'.format(custom_template)
                return ', antaa viite seuraavalle: {}'.format(entities[ann['slot']])
            if prev_ann['act'] == 'affirm':
                if custom_template is not None:
                    return ' ja antaa viite seuraavalle: {}'.format(custom_template)
                return ' ja antaa viite seuraavalle: {}'.format(entities[ann['slot']])
            if custom_template is not None:
                return ' ja {}'.format(custom_template)
            return ' ja {}'.format(entities[ann['slot']])
        if custom_template is not None:
            return 'antaa viite seuraavalle: {}'.format(custom_template)
        return 'antaa viite seuraavalle: {}'.format(entities[ann['slot']])

    @staticmethod
    def affirm_template(ann, prev_ann, next_ann):
        return 'vahvistaa'

    @staticmethod
    def negate_template(ann, prev_ann, next_ann):
        if prev_ann is not None:
            return ' ja muoto on väärä'
        if next_ann is None:
            return 'tyhjäksi'
        return 'muoto on väärä'

    @staticmethod
    def confirm_template(ann, prev_ann, next_ann):
        if prev_ann is None:
            return 'kysy vahvistus seuraavalle: {} on {}'.format(entities[ann['slot']], ann['value'])
        return ' ja kysy vahvistus seuraavalle: {} on {}'.format(entities[ann['slot']], ann['value'])

    @staticmethod
    def notify_success_template(ann, prev_ann, next_ann):
        return 'menestys!'

    @staticmethod
    def bye_template(ann, prev_ann, next_ann):
        return "Kiitos ja näkemiin"

    @staticmethod
    def greeting_template(ann, prev_ann, next_ann):
        return "terveisiä"

    @staticmethod
    def propose_template(ann, prev_ann, next_ann):
        if prev_ann is None:
            return "ehdottaa seuraavaa: {}".format(entities[ann['slot']])
        return "ehdottaa seuraavaa:: {}".format(entities[ann['slot']])
