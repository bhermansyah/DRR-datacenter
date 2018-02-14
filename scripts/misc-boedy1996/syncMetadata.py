import os,sys
import csv, json
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from geonode.layers.models import Layer

test = Layer.objects.all()
# test = Layer.objects.filter(pk=5831)
for i in test:
	i.save()

