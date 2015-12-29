from django.db import models
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model

class matrix(models.Model):
    user = models.ForeignKey(get_user_model())
    resourceid = models.ForeignKey(ResourceBase)
    action = models.CharField(max_length=255, help_text='for example "download,view"')

    def __unicode__(self):
        return self.action
