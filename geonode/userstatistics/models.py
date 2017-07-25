from django.db import models
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model
import datetime

class UserActivity(models.Model):
    user = models.ForeignKey(get_user_model())
    resourceid = models.ForeignKey(ResourceBase)
    action = models.CharField(max_length=255, help_text='for example "download,view"')
    created = models.DateTimeField(editable=False)
    class Meta:
        managed = False
        db_table = 'matrix_matrix'
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = datetime.datetime.now()
        return super(matrix, self).save(*args, **kwargs)
    def __unicode__(self):
        return self.action
