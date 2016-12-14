from django.db import models

# Create your models here.
class classmarker(models.Model):
    cm_ts = models.FloatField(blank=True, null=True)
    cm_tsa= models.FloatField(blank=True, null=True)
    cm_tp = models.FloatField(blank=True, null=True)
    cm_td = models.CharField(max_length=50, blank=True)
    cm_fn = models.CharField(max_length=200, blank=True)
    cm_ln = models.CharField(max_length=200, blank=True)
    cm_e = models.CharField(max_length=100, blank=True)
    cm_user_id = models.CharField(max_length=50, blank=True)
    cm_access_list_item = models.CharField(max_length=255, blank=True)

