class CustomTemplates:

    @staticmethod
    def get_template(ann):
        try:
            template = custom_templates[ann['act']][ann['slot']]
            return template(ann)
        except KeyError:
            return None


def terms_and_conditions_template(ann):
    value = {
        True: "hyväksytään",
        False: "hylätään"
    }
    return "ehdot {}".format(value[ann['value']])


def registration_template(ann):
    value = {
        "True": "rekisteröinti on valmis",
        "False": "rekisteröinti epäonnistui"
    }
    return "{}".format(value[ann['value']])


def intent_template(ann):
    value = {
        "register": "rekisteröidy Siirtosoittoon"
    }
    return "{}".format(value[ann['value']])


def area_template(ann):
    return "ilmoitusalue on {}".format(ann['value'])


def request_area_template(ann):
    return "ilmoitusalue"


def request_terms_and_conditions(ann):
    return "ehtojen hyväksyminen"


custom_templates = {
    "inform": {
        "Registration": registration_template,
        "Terms and conditions": terms_and_conditions_template,
        "Intent": intent_template,
        "Area": area_template
    },
    "request": {
        "Area": request_area_template,
        "Terms and conditions": request_terms_and_conditions,
    }
}