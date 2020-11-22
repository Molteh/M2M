from pymongo import MongoClient
from pprint import pprint
import ssl

from M2M.template_generator.en.grammar import Grammar
grammar = Grammar()

COLLECTION_NAME = 'batch'


class TemplateGenerator:

    def __init__(self):
        self.client = MongoClient('localhost', port=27017)
        self.db = self.client['M2M']

    def generate_templates(self):
        # retrieve documents
        docs = self.db[COLLECTION_NAME].find({})
        pprint(docs)

        # iterate through doc
        for doc in docs:
            # iterate through sentence
            for i, msg in enumerate(doc['annotatedMessages']):
                # change template value
                template = self._generate_template(msg['annotations'])
                self.db[COLLECTION_NAME].update_one({
                    '_id': doc['_id']
                }, {
                    '$set': {
                        'annotatedMessages.' + str(i) + '.template': template
                    }
                }, upsert=False)
            print("="*20)

    @staticmethod
    def _generate_template(annotations):
        result = ''
        prev_ann = None
        curr_ann = annotations[0]
        for ann in annotations[1:]:

            next_ann = ann

            result += grammar.get_template(curr_ann, prev_ann, next_ann)

            prev_ann = curr_ann
            curr_ann = next_ann

        next_ann = None
        result += grammar.get_template(curr_ann, prev_ann, next_ann)

        print(result)
        return result
