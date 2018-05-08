from celery.task import task, periodic_task
from celery.schedules import crontab
from pushnotif.views import triggercheck
from celery import shared_task

# print 'pushnotif.tasks executed'
@periodic_task(run_every=crontab(minute=0, hour='*/2'))
def cron_triggercheck():
    """
    Run triggercheck periodically.
    """
    print 'Run triggercheck periodically'
    # triggercheck()
    return

# @periodic_task(run_every=crontab(minute=5))
# def cron_test():
#     """
#     Run cron_test periodically.
#     """
#     print 'Run cron_test'
#     log_test()
#     return

# @shared_task
# def add(x, y):
#     return x + y
