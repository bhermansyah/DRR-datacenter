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

@user_passes_test(lambda u: u.is_staff, login_url='/')
def userstatistics(request):
    # has_access = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())
    # if not has_access:
    #     return TemplateResponse(request, '401.html', {}, status=401).render()

    data = {}
    data['jsondata'] = {}
    data['jsondata']['useractivities'] = {}
    data['jsondata']['user'] = {}
    user_exclude = ['admin', 'dodiws', 'dodiwsreg', 'rafinkanisa', 'boedy1996', 'razinal']
    start = time.time()
    print 'query start', start
    qs_matrix = matrix.objects.exclude(user__username__in=user_exclude).\
    extra(select={'certificate_percentage': 'SELECT percentage FROM matrix_certificate WHERE lower(matrix_certificate.email) = lower(people_profile.email)',
    'certified': 'SELECT (case when CAST (percentage AS FLOAT) >= 75 then \'Yes\' else \'No\' end) AS certified FROM matrix_certificate WHERE lower(matrix_certificate.email) = lower(people_profile.email)'}).\
    values_list(
        'user__username',
        'user__first_name',
        'user__last_name',
        'user__email',
        'user__organization',
        'user__org_acronym',
        'user__org_type',
        'user__org_name_status',
        'action',
        'resourceid__title',
        'resourceid__csw_type',
        'user__last_login',
        'user__date_joined',
        'created',
        'certificate_percentage',
        'certified'
    )
    print qs_matrix.query
    data['jsondata']['useractivities']['data'] = [
        [
            unicode(r[0]).encode('utf-8').strip(),
            unicode(r[1]).encode('utf-8').strip(),
            unicode(r[2]).encode('utf-8').strip(),
            unicode(r[3]).encode('utf-8').strip(),
            unicode(r[4]).encode('utf-8').strip(),
            unicode(r[5]).encode('utf-8').strip(),
            unicode(r[6]).encode('utf-8').strip(),
            unicode(r[7]).encode('utf-8').strip(),
            unicode(r[8]).encode('utf-8').strip(),
            unicode(r[9]).encode('utf-8').strip(),
            unicode(r[10]).encode('utf-8').strip(),
            r[11].strftime('%Y-%m-%d %H:%M:%S'),
            r[12].strftime('%Y-%m-%d %H:%M:%S'),
            r[13].strftime('%Y-%m-%d %H:%M:%S'),
            r[13].year,
            r[13].month,
            r[13].day,
            unicode(r[14] or '').encode('utf-8').strip(),
            unicode(r[15] or 'No').encode('utf-8').strip(),
        ]
        for r in qs_matrix
    ]

    queryset = get_user_model().objects.exclude(username__in=user_exclude).\
    extra(select={'certificate_percentage': 'SELECT percentage FROM matrix_certificate WHERE lower(matrix_certificate.email) = lower(people_profile.email)',
    'certified': 'SELECT (case when CAST (percentage AS FLOAT) >= 75 then \'Yes\' else \'No\' end) AS certified FROM matrix_certificate WHERE lower(matrix_certificate.email) = lower(people_profile.email)'}).\
    values_list(
        'username',
        'organization',
        'org_acronym',
        'org_type',
        'org_name_status',
        'date_joined',
        'certificate_percentage',
        'certified'
        )
    print queryset.query
    data['jsondata']['user']['data'] = [
        [
            unicode(r[0]).encode('utf-8').strip(),
            unicode(r[1]).encode('utf-8').strip(),
            unicode(r[2]).encode('utf-8').strip(),
            unicode(r[3]).encode('utf-8').strip(),
            unicode(r[4]).encode('utf-8').strip(),
            r[5].strftime('%Y-%m-%d %H:%M:%S'),
            unicode(r[6] or '').encode('utf-8').strip(),
            unicode(r[7] or 'No').encode('utf-8').strip(),
        ]
        for r in queryset
    ]
    # data['user']['data'] = get_user_model().objects.all()
    end = time.time()
    print 'query end', end
    print 'query time', end - start, 'seconds'
    data['jsondata']['useractivities']['columns'] = [
        str('user'),
        str('first_name'),
        str('last_name'),
        str('email'),
        str('organization'),
        str('org_acronym'),
        str('org_type'),
        str('org_name_status'),
        str('action'),
        str('resource'),
        str('type_of_object'),
        str('last_login'),
        str('date_join'),
        str('actiontime'),
        str('action_year'),
        str('action_month'),
        str('action_day'),
        str('certificate_percentage'),
        str('certified')
    ]
    data['jsondata']['user']['columns'] = [
    str('username'),
    str('organization'),
    str('org_acronym'),
    str('org_type'),
    str('org_name_status'),
    str('date_join'),
    str('certificate_percentage'),
    str('certified')]
    return render(request, 'userstatistics.html', data)
