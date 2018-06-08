import os.path
from django import template
from django.conf import settings

register = template.Library()

@register.filter(name='file_exists')
def file_exists(filepath):
    replaceChar = filepath.replace(u'\xa0', u' ')
    # default_path = 'geonode'+replaceChar
    default_path = '/home/ubuntu/DRR-datacenter/geonode'+replaceChar #serverside
    if os.path.exists(default_path+'.png'):
        return replaceChar+'.png'
    elif os.path.exists(default_path+'.jpg'):
        return replaceChar+'.jpg'
    else:   
        no_image_path =  settings.STATIC_URL+'v2/images/nologo.png'
        return no_image_path