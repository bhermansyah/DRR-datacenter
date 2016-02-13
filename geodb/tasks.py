
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import datetime
from geodb.views import getForecastedDisaster

logger = get_task_logger(__name__)

@periodic_task(run_every=(crontab(minute='10')))
def scraper_example():
	print "kontol"
	getForecastedDisaster()

