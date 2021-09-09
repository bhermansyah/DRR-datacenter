import time

from .utils import Timer
from contextlib import closing
from django import forms
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import user_passes_test
from django.core import serializers
from django.core.urlresolvers import reverse
from django.db import connection, connections
from django.db.models import Q, F
from django.http import HttpResponse, HttpResponseRedirect
# from django.middleware.gzip import GZipMiddleware
from django.shortcuts import render
from django.template.response import TemplateResponse
from django.utils import simplejson as json
from django.views.decorators.gzip import gzip_page
from geonode.base.models import ResourceBase
from geonode.groups.models import GroupProfile
from matrix.models import matrix

@user_passes_test(lambda u: u.is_staff, login_url='/')
@gzip_page
def userstatistics(request):

    timer = Timer()
    usertbl = get_user_model().objects.model._meta.db_table
    user_exclude = ['admin', 'dodiws', 'dodiwsreg', 'rafinkanisa', 'boedy1996', 'razinal']
    data = {'jsondata': {}}
    
    # query to get distinct matrix certificate by earliest time_started
    certificate_percentages_sql = '''
        WITH distinct_certificate AS (
            SELECT 
                email, 
                percentage, 
                ROW_NUMBER() OVER(PARTITION BY lower(email) ORDER BY time_started) AS rank 
            FROM matrix_certificate 
        ) 
        SELECT 
            "%(usertbl)s"."username", 
            (COALESCE(
                (CASE 
                    WHEN Cast (distinct_certificate.percentage AS FLOAT) >= 75 THEN 'Yes' ELSE 'No' 
                END), 'No')) AS "certified", 
            (COALESCE((distinct_certificate.percentage):: varchar, '')) AS "certificate_percentage" 
        FROM 
            "%(usertbl)s" 
            left join distinct_certificate on Lower(distinct_certificate.email) = Lower(%(usertbl)s.email) 
        WHERE rank = 1 OR rank IS NULL
        ORDER BY "%(usertbl)s"."email"
        ''' % {'usertbl':usertbl}

    timer.stamp('Query certificate_percentages', show_duration=False)
    certificate_percentages = {}
    with closing(connection.cursor()) as cursor:
        cursor.execute(certificate_percentages_sql)
        certificate_percentages = {r[0]: {'certified': str(r[1]), 'certificate_percentage': str(r[2])} for r in cursor.fetchall()}

    timer.stamp('Query useractivities_data')
    qs_matrix = matrix.objects.exclude(user__username__in=user_exclude).\
        extra(
            select={
                'user__last_login__formatted': "to_char(people_profile.last_login, 'YYYY-MM-DD HH:MM:SS')",
                'user__date_joined__formatted': "to_char(people_profile.date_joined, 'YYYY-MM-DD HH:MM:SS')",
                'created__formatted': "to_char(matrix_matrix.created, 'YYYY-MM-DD HH:MM:SS')",
            }
        ).\
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
            'user__last_login__formatted',
            'user__date_joined__formatted',
            'created__formatted',
            'created',
        )

    # print qs_matrix.query
    len(qs_matrix) # force evaluate query for next timer.stamp() to show query duration
    timer.stamp('Format useractivities_data')
    data['jsondata']['useractivities'] = {
        'columns': [
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
        ],
        'data': [
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
                str(r[11]),
                str(r[12]),
                str(r[13]),
                r[14].year,
                r[14].month,
                r[14].day,
                certificate_percentages[r[0]]['certificate_percentage'],
                certificate_percentages[r[0]]['certified'],
            ]
            for r in qs_matrix
        ],
    }

    timer.stamp('Query user_data')
    queryset = get_user_model().objects.exclude(username__in=user_exclude).\
        extra(
            select={
                'date_joined__formatted': "to_char(%(usertbl)s.last_login, 'YYYY-MM-DD HH:MM:SS')" % {'usertbl':usertbl},
            }
        ).\
        values_list(
            'username',
            'organization',
            'org_acronym',
            'org_type',
            'org_name_status',
            'date_joined__formatted',
        )
    # print queryset.query
    data['jsondata']['user'] = {
        'columns': [
            str('username'),
            str('organization'),
            str('org_acronym'),
            str('org_type'),
            str('org_name_status'),
            str('date_join'),
            str('certificate_percentage'),
            str('certified')
        ],
        'data': [
            [
                unicode(r[0]).encode('utf-8').strip(),
                unicode(r[1]).encode('utf-8').strip(),
                unicode(r[2]).encode('utf-8').strip(),
                unicode(r[3]).encode('utf-8').strip(),
                unicode(r[4]).encode('utf-8').strip(),
                str(r[5]),
                certificate_percentages[r[0]]['certificate_percentage'],
                certificate_percentages[r[0]]['certified'],
            ]
            for r in queryset
        ],
    }

    timer.stamp('Render template')
    r = render(request, 'userstatistics.html', data)
    timer.stamp('End')
    return r
