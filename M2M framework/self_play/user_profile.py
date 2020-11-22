import numpy.random as random


class UserProfile:

    """A user profile is characterized by a verbosity
    between 0 and 1 used to draw samples from a
    distribution. It determines the number of user acts
    generated in a single dialogue turn"""
    def __init__(self, verbosity, distribution=random.geometric):
        self.verbosity = verbosity
        self.distribution = distribution
