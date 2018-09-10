from datetime import datetime

from django.db import models

from django.conf import settings
from django.contrib.contenttypes.generic import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Notes(models.Model):
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, related_name="deliverynotes")
    
    copies = models.IntegerField()
    orgtarget = models.CharField(max_length=255, blank=True)
    orgcontact = models.CharField(max_length=255, blank=True)
    
    content_type = models.ForeignKey(ContentType)
    object_id = models.IntegerField()
    content_object = GenericForeignKey()
    
    note = models.TextField()
    
    submit_date = models.DateTimeField(default=datetime.now)
    ip_address = models.IPAddressField(null=True)
    public = models.BooleanField(default=True)
    
    def __unicode__(self):
        return "pk=%d" % self.pk
