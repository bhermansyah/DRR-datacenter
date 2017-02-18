import os,sys
import csv, json
import datetime

os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from gfms_backdate import GFMSProcessor

start_date = datetime.datetime(2016, 1, 8, 10)
end_date = datetime.datetime(2016, 2, 16, 10)
d=start_date
delta = datetime.timedelta(days=1)
while d <= end_date:
	processor = GFMSProcessor()
	processor.run(d)
	print d.strftime("%Y-%m-%d")
	d += delta