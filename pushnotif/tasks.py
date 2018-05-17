from celery.task import task, periodic_task
from celery.schedules import crontab
from pushnotif.views import triggercheck
from celery import shared_task

# print 'pushnotif.tasks executed'
# hour='*/2' = every 2 hour
@periodic_task(run_every=crontab(minute=0, hour='*/2'))
def cron_triggercheck():
    """
    Run triggercheck periodically.
    """
    # triggercheck()
    return
