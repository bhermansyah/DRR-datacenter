from django.db import models
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model
import datetime

class matrix(models.Model):
    user = models.ForeignKey(get_user_model())
    resourceid = models.ForeignKey(ResourceBase)
    action = models.CharField(max_length=255, help_text='for example "download,view"')
    created     = models.DateTimeField(editable=False)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = datetime.datetime.now()
        return super(matrix, self).save(*args, **kwargs)
    def __unicode__(self):
        return self.action


class MatrixCertificate(models.Model):
    email = models.CharField(primary_key=True, max_length=200)
    first = models.CharField(max_length=200, blank=True)
    last = models.CharField(max_length=200, blank=True)
    percentage = models.FloatField(blank=True, null=True)
    points_score = models.FloatField(blank=True, null=True)
    points_available = models.FloatField(blank=True, null=True)
    time_started = models.BigIntegerField(blank=True, null=True)
    time_finished = models.BigIntegerField(blank=True, null=True)
    cm_user_id = models.CharField(max_length=200, blank=True)
    class Meta:
        managed = False
        db_table = 'matrix_certificate'
