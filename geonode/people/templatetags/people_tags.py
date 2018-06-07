import os.path
from django import template
from django.conf import settings

register = template.Library()

@register.filter(name='file_exists')
def file_exists(filepath):
    default_path = 'geonode'+filepath
    if os.path.exists(default_path):
        return filepath
    else:   
        no_image_path =  settings.STATIC_URL+'v2/images/nologo.png'
        return no_image_path