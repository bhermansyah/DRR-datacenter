import os.path
from django import template
from django.conf import settings

register = template.Library()

@register.filter(name='file_exists')
def file_exists(filepath):
    # default_path = 'geonode'+filepath
    default_path = '/home/ubuntu/DRR-datacenter/geonode'+filepath #serverside
    print default_path
    if os.path.exists(default_path+'.png'):
        return filepath+'.png'
    elif os.path.exists(default_path+'.jpg'):
        return filepath+'.jpg'
    else:   
        no_image_path =  settings.STATIC_URL+'v2/images/nologo.png'
        return no_image_path