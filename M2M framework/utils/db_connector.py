from pymongo import MongoClient
from pprint import pprint
import datetime
import ssl

COLLECTION_NAME = 'batch'


class DatabaseConnector:

    def __init__(self):
        self.client = MongoClient('localhost', port=27017)
        self.db = self.client['WNUT']

    def create_dialog(self, lines):

        dialog = {
            "length": len(lines),
            "createdAt": datetime.datetime.utcnow(),
            "annotatedMessages": [{"sender": line['sender'], "annotations": line['da'], "template": "", "rewrite": ""} for line in lines],
            "processed": False,
            "assigned": False
        }

        self.db[COLLECTION_NAME].insert_one(dialog)
