import time

class Timer(object):
    '''
    record time duration between timer.stamp() in seconds
    usage: timer.stamp('message')
        will show time elapsed between timer.stamp('message') and 
        previous timer.stamp() call
    '''
    messages = []

    def __init__(self):
        self.messages += [['Start', time.time()]]

    def stamp(self, message='Timer', show_duration=True):
        self.messages += [[message, time.time()]]
        if show_duration:
            print '%s: %s seconds' % (self.messages[-2][0], self.messages[-1][1] - self.messages[-2][1])
