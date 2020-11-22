import json
import numpy as np
import difflib


class AreaLoader:

    def __init__(self):
        with open("/Users/molte/Desktop/Tesi/M2M/utils/geojson_data/streets.json", "r") as read_file:
            self.data = json.load(read_file)
            self.data = [area["id"] for area in self.data]

    def sample_area(self):
        return self.data[np.random.randint(0, len(self.data))]

    def verify_area(self, area):
        return area in self.data

    def get_close_match(self, area):
        return difflib.get_close_matches(area, self.data)[np.random.choice(2, p=[0.9, 0.1])]
