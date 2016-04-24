
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import datetime
from geodb.views import getForecastedDisaster, updateSummaryTable, getSnowCover, getLatestEarthQuake, getLatestShakemap, databasevacumm

logger = get_task_logger(__name__)

@periodic_task(run_every=(crontab(hour='*')))
def scraper_example():
	getForecastedDisaster()

@periodic_task(run_every=(crontab(hour='*')))
def updateDistrictsSummary():
	updateSummaryTable()
	getSnowCover()

@periodic_task(run_every=(crontab(hour='*')))
def updateLatestEarthQuake():
	getLatestEarthQuake()

@periodic_task(run_every=(crontab(hour='1')))
def runVacummDB():
	databasevacumm()
	

