from M2M.template_generator.en.custom_templates import CustomTemplates


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
                    return ' and ' + custom_template
                return ' and {} is {}'.format(ann['slot'], ann['value'])
            if custom_template is not None:
                return ' and ' + custom_template
            return ' {} is {}'.format(ann['slot'], ann['value'])
        if custom_template is not None:
            return custom_template
        return '{} is {}'.format(ann['slot'], ann['value'])

    @staticmethod
    def request_template(ann, prev_ann, next_ann):
        custom_template = CustomTemplates.get_template(ann)
        if prev_ann is not None:
            if prev_ann['act'] == 'negate':
                if custom_template is not None:
                    return ', provide reference for: {}'.format(custom_template)
                return ', provide reference for: {}'.format(ann['slot'])
            if prev_ann['act'] == 'affirm':
                if custom_template is not None:
                    return ' and provide reference for: {}'.format(custom_template)
                return ' and provide reference for: {}'.format(ann['slot'])
            if custom_template is not None:
                return ' and {}'.format(custom_template)
            return ' and {}'.format(ann['slot'])
        if custom_template is not None:
            return 'provide reference for: {}'.format(custom_template)
        return 'provide reference for: {}'.format(ann['slot'])

    @staticmethod
    def affirm_template(ann, prev_ann, next_ann):
        return 'affirm'

    @staticmethod
    def negate_template(ann, prev_ann, next_ann):
        if prev_ann is not None:
            return ' and format is wrong'
        if next_ann is None:
            return 'negate'
        return 'format is wrong'

    @staticmethod
    def confirm_template(ann, prev_ann, next_ann):
        if prev_ann is None:
            return 'ask confirmation for the following: {} is {}'.format(ann['slot'], ann['value'])
        return ' and ask confirmation for the following: {} is {}'.format(ann['slot'], ann['value'])

    @staticmethod
    def notify_success_template(ann, prev_ann, next_ann):
        return 'success!'

    @staticmethod
    def bye_template(ann, prev_ann, next_ann):
        return "thank you, bye"

    @staticmethod
    def greeting_template(ann, prev_ann, next_ann):
        return "greetings"

    @staticmethod
    def propose_template(ann, prev_ann, next_ann):
        if prev_ann is None:
            return "propose the following: {}".format(ann['slot'])
        return " and propose the following: {}".format(ann['slot'])
