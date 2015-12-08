import os


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "geonode.settings")
from geodb.views import exportdata

exportdata()

