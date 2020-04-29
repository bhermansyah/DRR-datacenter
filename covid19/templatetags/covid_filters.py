import json
import urllib
from urlparse import urlparse, urlunparse
from django import template
from django.core.serializers import serialize
from django.db.models.query import QuerySet, ValuesListQuerySet
from django.http import QueryDict

register = template.Library()


class JSONEncoderCustom(json.JSONEncoder):
    def default(self, obj):
        if obj.__class__.__name__ in ["DataFrame","QuerySet","ndarray"]:
            return list(obj)
        elif obj.__class__.__name__ == "date":
            return obj.strftime("%Y-%m-%d")
        elif obj.__class__.__name__ == "time":
            return obj.strftime("%H-%M-%S")
        elif obj.__class__.__name__ == "datetime":
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        elif obj.__class__.__name__ == "Decimal":
            return float(obj)
        else:
            print('not converted to json:', obj.__class__.__name__)
            return 'not converted to json: %s' % (obj.__class__.__name__)

@register.simple_tag
def readable(val):
    if val>=1000 and val<1000000:
    	# c = '{:.1f}'.format(val/1000).rstrip('0').rstrip('.') the last one
    	# print c
    	c = ('%.1f' % (round((val/1000), 2))).rstrip('0').rstrip('.')
    	# print c
    	return '{} K'.format(c) 
    	# b = '%.1f K' % (round((val/1000), 2))
    	# print b
    	# return ('%.1f K' % (round((val/1000), 2)))
    elif val>=1000000 and val<1000000000:
    	# c = '{:.1f}'.format(val/1000000).rstrip('0').rstrip('.')
    	# print c
    	b = ('%.1f' % (round((val/1000000), 2))).rstrip('0').rstrip('.')
    	return '{} M'.format(b)
    	# b = '%.1f M' % (round((val/1000000), 2))
    	# print b
    	# return ('%.1f M' % (round((val/1000000), 2)))
    else:
    	return ('%.1f' % round(val or 0)).rstrip('0').rstrip('.')

@register.filter( is_safe=True )
def jsonify(object):
	return json.dumps(object,cls=JSONEncoderCustom)

@register.assignment_tag
def unjsonify(string):
	return json.loads(string)
