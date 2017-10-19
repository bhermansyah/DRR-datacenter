import urllib
from django import template

register = template.Library()

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
