import os
import json
import pickle
import pandas as pd
import numpy as np
import datetime

from collections import OrderedDict
from .utils import JSONEncoderCustom

from httplib2 import Http
from django.conf import settings

# google
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request


SPREADSHEET_ID = '1F-AMEDtqK78EA6LYME2oOsWQsgJi4CT3V_G4Uo-47Rg'
RANGE_NAME = 'afg_covid19_stats'


def get_google_sheet(spreadsheet_id, range_name):
    """ Retrieve sheet data using OAuth credentials and Google Python API. """
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    # Setup the Sheets API
    creds = None
    if os.path.exists(settings.GOOGLE_OAUTH2_TOKEN):
        with open(settings.GOOGLE_OAUTH2_TOKEN, 'rb') as token:
            creds = pickle.load(token)
            
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(settings.GOOGLE_OAUTH2_TOKEN, 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds, cache_discovery=False)

    # Call the Sheets API
    sheet = service.spreadsheets()
    gsheet = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    return gsheet


def gsheet2df(gsheet):
    header = gsheet.get('values', [])[0]   
    values = gsheet.get('values', [])[2:] 
    if not values:
        print('No data found.')
    else:
        all_data = []
        for col_id, col_name in enumerate(header):
            column_data = []
            provinceName = []
            for row in values:
                if col_name == 'Province':
                    provinceName.append(row[col_id].replace(' Province',''))    
                else:
                    column_data.append(row[col_id].replace(',', ''))
            combineData = provinceName + column_data
            ds = pd.Series(data=combineData, name=col_name.replace(" ", "_"))
            all_data.append(ds)
        df = pd.concat(all_data, axis=1)
        return df

def Common(request, code):
    gsheet = get_google_sheet(SPREADSHEET_ID, RANGE_NAME)
    df = gsheet2df(gsheet)
    Common = {}

    Common['latestData'] = getLatestData(df, request, code)
    Common['chart'] = Chart(df, request, code)
    Common['total'] = getTotalEntireAfg(df, request, code)

    return Common

def Chart(df, request, code):
    ChartJson = {}
    # LineChart
    if code:
        Cases = pd.to_numeric(df.Cases).where(df.Province==code).groupby([df.Date]).sum()
        Deaths = pd.to_numeric(df.Deaths).where(df.Province==code).groupby([df.Date]).sum()
        Recoveries = pd.to_numeric(df.Recoveries).where(df.Province==code).groupby([df.Date]).sum()
    else:    
        Cases = pd.to_numeric(df.Cases).groupby([df.Date]).sum()
        Deaths = pd.to_numeric(df.Deaths).groupby([df.Date]).sum()
        Recoveries = pd.to_numeric(df.Recoveries).groupby([df.Date]).sum()

    sortedCases = Cases.to_dict(OrderedDict)
    sortedDeaths = Deaths.to_dict(OrderedDict)
    sortedRecoveries = Recoveries.to_dict(OrderedDict)

    diffCases = Cases.diff().fillna(0).reset_index(drop=True).to_dict(OrderedDict)
    diffDeath = Deaths.diff().fillna(0).reset_index(drop=True).to_dict(OrderedDict)
    diffRecovery = Recoveries.diff().fillna(0).reset_index(drop=True).to_dict(OrderedDict)
    
    # percentGrowthCase = Cases.pct_change().fillna(0).reset_index(drop=True)
    # percentGrowthDeath = Deaths.pct_change().fillna(0).reset_index(drop=True).to_dict(OrderedDict)
    # percentGrowthRecovery = Recoveries.pct_change().fillna(0).reset_index(drop=True).to_dict(OrderedDict)
    # print(percentGrowthCase)
    
    datelist = []
    series = {}
    series['date'] = []
    series['cases'] = {}
    series['cases']['name'] = 'Confirmed'
    series['cases']['data'] = []
    for i in sortedCases:
        series['date'].append(i)
        series['cases']['data'].append(sortedCases[i])

    series['deaths'] = {}
    series['deaths']['name'] = 'Deaths'
    series['deaths']['data'] = []
    for i in sortedDeaths:
        series['deaths']['data'].append(sortedDeaths[i])
        
    series['recoveries'] = {}
    series['recoveries']['name'] = 'Recovered'
    series['recoveries']['data'] = []
    for i in sortedRecoveries:
        series['recoveries']['data'].append(sortedRecoveries[i])


    series['GrowthCase'] = {}
    series['GrowthCase']['name'] = 'New Cases'
    series['GrowthCase']['data'] = []
    for i in diffCases:
        series['GrowthCase']['data'].append(diffCases[i])

    series['GrowthDeath'] = {}
    series['GrowthDeath']['name'] = 'Death Growth'
    series['GrowthDeath']['data'] = []
    for i in diffDeath:
        series['GrowthDeath']['data'].append(diffDeath[i])

    series['GrowthRecovery'] = {}
    series['GrowthRecovery']['name'] = 'Recovery Growth'
    series['GrowthRecovery']['data'] = []
    for i in diffRecovery:
        series['GrowthRecovery']['data'].append(diffRecovery[i])

    # latest['Active_Cases'] = latest['Cases'] - (latest['Recoveries'] - latest['Deaths'])
    ActiveCases = Cases - ( Recoveries - Deaths)
    sortedActiveCases = ActiveCases.to_dict(OrderedDict)
    
    series['activecase'] = {}
    series['activecase']['name'] = 'Active Cases'
    series['activecase']['data'] = []
    for i in sortedActiveCases:
        series['activecase']['data'].append(sortedActiveCases[i])
    


    ChartJson['LineChart'] = series

    # BarChart
    barData = {}

    latest = df.groupby('Province').nth(0).reset_index()
    if code:
        latest = latest.where(latest['Province']==code)
        latest = latest[latest['Province'].notna()]
    
    latest['Cases'] = latest['Cases'].astype(int)
    latest['Deaths'] = latest['Deaths'].astype(int)
    latest['Recoveries'] = latest['Recoveries'].astype(int)
    latest['Active_Cases'] = latest['Cases'] - (latest['Recoveries'] - latest['Deaths'])
    latest['Active_Cases'] = latest['Active_Cases'].astype(int)

    barData['NewCasesData'] = {}
    barData['NewCasesData']['id'] = 'bar_new_cases_data'
    barData['NewCasesData']['name'] = series['date']
    barData['NewCasesData']['data'] = series['GrowthCase']['data']
    
    barData['CasesData'] = {}
    barData['CasesData']['id'] = 'bar_cases_data'
    barData['CasesData']['name'] = [v for k,v in latest['Province'].items()]
    barData['CasesData']['data'] = [v for k,v in latest['Cases'].items()]
    
    barData['ActiveCasesData'] = {}
    barData['ActiveCasesData']['id'] = 'bar_active_cases_data'
    barData['ActiveCasesData']['name'] = [v for k,v in latest['Province'].items()]
    barData['ActiveCasesData']['data'] = [v for k,v in latest['Active_Cases'].items()]

    ChartJson['BarChart'] = barData

    pieData = {}

    pieData['PercentageCasesData'] = {}
    pieData['PercentageCasesData']['id'] = 'pie_pos_case_percent'
    pieData['PercentageCasesData']['title'] = 'Positive Case Percentage'
    pieData['PercentageCasesData']['data'] = [["Active Cases", sum(latest['Active_Cases'])], ["Recovered", sum(latest['Recoveries'])], ["Dead", sum(latest['Deaths'])]]

    ChartJson['PieChart'] = pieData

    barStackData = {}

    barStackData['ProvPositiveCasesData'] = {}
    barStackData['ProvPositiveCasesData']['id'] = 'bar_prov_pos_cases_data'
    barStackData['ProvPositiveCasesData']['labels'] = [v for k,v in latest['Province'].items()]
    barStackData['ProvPositiveCasesData']['data_val'] = {}
    barStackData['ProvPositiveCasesData']['data_val']['active'] = {}
    barStackData['ProvPositiveCasesData']['data_val']['active']['name'] = 'Active Cases'
    barStackData['ProvPositiveCasesData']['data_val']['active']['data'] = [v for k,v in latest['Active_Cases'].items()]
    barStackData['ProvPositiveCasesData']['data_val']['recovered'] = {}
    barStackData['ProvPositiveCasesData']['data_val']['recovered']['name'] = 'Recovered'
    barStackData['ProvPositiveCasesData']['data_val']['recovered']['data'] = [v for k,v in latest['Recoveries'].items()]
    barStackData['ProvPositiveCasesData']['data_val']['death'] = {}
    barStackData['ProvPositiveCasesData']['data_val']['death']['name'] = 'Dead'
    barStackData['ProvPositiveCasesData']['data_val']['death']['data'] = [v for k,v in latest['Deaths'].items()]

    ChartJson['BarStackChart'] = barStackData

    return ChartJson


def getTotalEntireAfg(df, request, code):
    GetTotal = {}

    latest = df.groupby('Province').nth(0).reset_index()
    previous = df.groupby('Province').nth(1).reset_index()

    if code:
        latest = latest[latest['Province'].isin([code])]
        previous = previous[previous['Province'].isin([code])]

    latest['Cases'] = latest['Cases'].astype(int)
    latest['Deaths'] = latest['Deaths'].astype(int)
    latest['Recoveries'] = latest['Recoveries'].astype(int)

    latest['Active_Cases'] = latest['Cases'] - (latest['Recoveries'] - latest['Deaths'])
    TotalCases = sum(latest['Cases'])
    TotalDeaths = sum(latest['Deaths'])
    TotalRecoveries = sum(latest['Recoveries'])

    GetTotal['Confirmed Cases'] = [sum(latest['Cases'])]
    GetTotal['Recovered'] = [sum(latest['Recoveries'])]
    GetTotal['Deaths'] = [sum(latest['Deaths'])]
    GetTotal['Active Cases'] = [sum(latest['Active_Cases'])]


    GrowthCases = sum(latest['Cases']) - sum(previous['Cases'].astype(int))
    GrowthDeaths = sum(latest['Deaths']) - sum(previous['Deaths'].astype(int))
    GrowthRecoveries = sum(latest['Recoveries']) - sum(previous['Recoveries'].astype(int))
    GrowthActiveCase = GrowthCases - (GrowthRecoveries - GrowthDeaths)

    GetTotal['Confirmed Cases'].append({'GrowthCases': GrowthCases})
    GetTotal['Deaths'].append({'GrowthDeaths': GrowthDeaths})
    GetTotal['Recovered'].append({'GrowthRecoveries': GrowthRecoveries})
    GetTotal['Active Cases'].append({'GrowthActiveCase': GrowthActiveCase})

    return GetTotal


def getLatestData(df, request, code):
    latest = df.groupby('Province').nth(0).reset_index()
    previous = df.groupby('Province').nth(1).reset_index()

    growthData = pd.merge(latest, previous, left_on='Province', right_on='Province', how='left').fillna(0)

    latest['GrowthCases'] = growthData['Cases_x'].astype(int) - growthData['Cases_y'].astype(int)
    latest['GrowthDeaths'] = growthData['Deaths_x'].astype(int) - growthData['Deaths_y'].astype(int)
    latest['GrowthRecoveries'] = growthData['Recoveries_x'].astype(int) - growthData['Recoveries_y'].astype(int)
    latest['GrowthActive_Cases'] = latest['GrowthCases']  - (latest['GrowthRecoveries'] - latest['GrowthDeaths'])

    latest['Cases'] = latest['Cases'].astype(int)
    latest['Deaths'] = latest['Deaths'].astype(int)
    latest['Recoveries'] = latest['Recoveries'].astype(int)
    latest['Active_Cases'] = latest['Cases'] - (latest['Recoveries'] - latest['Deaths'])
    latest['Recovery_Rate'] = (latest['Recoveries'] / latest['Cases']) * 100
    latest['Death_Rate'] = (latest['Deaths'] / latest['Cases']) * 100
    GetLatestData = latest.to_dict(orient='records')
    return GetLatestData


def JsonResponse(request):
    response = {}
    code = None

    if 'code' in request.GET:
        code = request.GET['code']

    if request.GET['page'] == 'covid19':
        response = Common(request, code)
    
    response['googledata'] = json.dumps(response, cls=JSONEncoderCustom)

    return response
