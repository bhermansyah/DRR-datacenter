
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import datetime
from geodb.views import getForecastedDisaster, updateSummaryTable, getSnowCover, getLatestEarthQuake, getLatestShakemap, databasevacumm, runGlofasDownloader

logger = get_task_logger(__name__)

@periodic_task(run_every=(crontab(hour='*')))
def scraper_example():
	getForecastedDisaster()

@periodic_task(run_every=(crontab(hour='*')))
def updateDistrictsSummary():
	updateSummaryTable()

@periodic_task(run_every=(crontab(hour='10')))
def updateSnowCover():
	getSnowCover()	

@periodic_task(run_every=(crontab(hour='*')))
def updateLatestEarthQuake():
	getLatestEarthQuake()

@periodic_task(run_every=(crontab(hour='1')))
def runVacummDB():
	databasevacumm()

@periodic_task(run_every=(crontab(hour='*')))
def updateLatestShakemap():
	getLatestShakemap(True)
	

@periodic_task(run_every=(crontab(hour='3')))
def runGetGlofasDS():
	runGlofasDownloader()
	

