from geodb import models as geodb_models
from django.contrib import admin
from django.db.models.base import ModelBase

# Very hacky!
for name, var in geodb_models.__dict__.items():
    if type(var) is ModelBase:
        admin.site.register(var)
