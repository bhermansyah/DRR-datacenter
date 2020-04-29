import json
from urlparse import urlparse, parse_qs, urlsplit, urlunsplit
import urllib2, urllib

class JSONEncoderCustom(json.JSONEncoder):
    def default(self, obj):
        if obj.__class__.__name__ in ["QuerySet"]:
            return list(obj)
        elif obj.__class__.__name__ == "date":
            return obj.strftime("%Y-%m-%d")
        elif obj.__class__.__name__  == "Timestamp":
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

def set_query_parameter(url, param_name, param_value):
	    """Given a URL, set or replace a query parameter and return the
	    modified URL.

	    >>> set_query_parameter('http://example.com?foo=bar&biz=baz', 'foo', 'stuff')
	    'http://example.com?foo=stuff&biz=baz'

	    """
	    scheme, netloc, path, query_string, fragment = urlsplit(url)
	    query_params = parse_qs(query_string)

	    query_params[param_name] = [param_value]
	    new_query_string = urllib.urlencode(query_params, doseq=True)

	    return urlunsplit((scheme, netloc, path, new_query_string, fragment))