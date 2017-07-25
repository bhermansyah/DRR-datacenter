from django import forms
from django.contrib.auth import authenticate, login, get_user_model
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from django.db.models import Q
from django.template.response import TemplateResponse

from geonode.groups.models import GroupProfile
from django.shortcuts import render

from matrix.models import matrix
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model
from django.core import serializers
import time

from django.contrib.auth.decorators import user_passes_test

@user_passes_test(lambda u: u.is_superuser, login_url='/')
def userstatistics(request):
    # has_access = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())
    # if not has_access:
    #     return TemplateResponse(request, '401.html', {}, status=401).render()

    data = {}
    data['jsondata'] = {}
    data['jsondata']['useractivities'] = {}
    data['jsondata']['user'] = {}
    start = time.time()
    print 'query start', start
    data['jsondata']['useractivities']['data'] = [[r[0].strftime('%Y-%m-%d %H:%M:%S'), str(r[1]), str(r[2]), str(r[3]), str(r[4])] for r in matrix.objects.values_list('created', 'user__username', 'user__organization', 'action', 'resourceid__title')]
    data['jsondata']['user']['data'] = [[str(r[0]), str(r[1]), r[2].strftime('%Y-%m-%d %H:%M:%S')] for r in get_user_model().objects.values_list('username', 'organization', 'date_joined')]
    # data['user']['data'] = get_user_model().objects.all()
    end = time.time()
    print 'query end', end
    print 'query time', end - start, 'seconds'
    data['jsondata']['useractivities']['columns'] = [str('created'), str('user'), str('organization'), str('action'), str('resource')]
    data['jsondata']['user']['columns'] = [str('username'), str('organization'), str('date_joined')]
    return render(request, 'userstatistics.html', data)
