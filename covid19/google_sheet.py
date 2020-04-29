import os
import json
import pickle
import pandas as pd
import numpy as np

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

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    gsheet = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    return gsheet


def gsheet2df(gsheet):
    header = gsheet.get('values', [])[0]   
    values = gsheet.get('values', [])[1:] 
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
                    column_data.append(row[col_id])
            combineData = provinceName + column_data
            ds = pd.Series(data=combineData, name=col_name.replace(" ", "_"))
            all_data.append(ds)
        df = pd.concat(all_data, axis=1)
        return df

def groupByDate(request, code):
    groupByDateJson = {}
    gsheet = get_google_sheet(SPREADSHEET_ID, RANGE_NAME)
    df = gsheet2df(gsheet)

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
    series['cases']['name'] = 'Cases'
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
    series['recoveries']['name'] = 'Recoveries'
    series['recoveries']['data'] = []
    for i in sortedRecoveries:
        series['recoveries']['data'].append(sortedRecoveries[i])


    series['GrowthCase'] = {}
    series['GrowthCase']['name'] = 'Case Growth'
    series['GrowthCase']['data'] = []
    for i in diffCases:
        series['GrowthCase']['data'].append(diffCases[i])

    series['GrowthDeath'] = {}
    series['GrowthDeath']['name'] = 'Death Growth'
    series['GrowthDeath']['data'] = []
    for i in diffDeath:
        series['GrowthDeath']['data'].append(diffDeath[i])

    series['GrowthRecovery'] = {}
    series['GrowthRecovery']['name'] = 'Growth Recovery'
    series['GrowthRecovery']['data'] = []
    for i in diffRecovery:
        series['GrowthRecovery']['data'].append(diffRecovery[i])


    groupByDateJson['DataSeries'] = series
    return groupByDateJson


def getTotalEntireAfg(request, code):
    GetTotal = {}

    gsheet = get_google_sheet(SPREADSHEET_ID, RANGE_NAME)
    df = gsheet2df(gsheet)

    if code:
        latest = df[df['Province'].isin([code])].head(1)
    else:
        latest = df.groupby('Province').nth(0).reset_index()
    
    latest['Cases'] = latest['Cases'].astype(int)
    latest['Deaths'] = latest['Deaths'].astype(int)
    latest['Recoveries'] = latest['Recoveries'].astype(int)

    latest['Active_Cases'] = latest['Cases'] - (latest['Recoveries'] - latest['Deaths'])
    TotalCases = sum(latest['Cases'])
    TotalDeaths = sum(latest['Deaths'])
    TotalRecoveries = sum(latest['Recoveries'])

    GetTotal['Cases'] = sum(latest['Cases'])
    GetTotal['Recoveries'] = sum(latest['Recoveries'])
    GetTotal['Deaths'] = sum(latest['Deaths'])
    GetTotal['Active Cases'] = sum(latest['Active_Cases'])

    return GetTotal


def getLatestData(request, code):
    gsheet = get_google_sheet(SPREADSHEET_ID, RANGE_NAME)
    df = gsheet2df(gsheet)

    latest = df.groupby('Province').nth(0).reset_index()
            
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
        response['latestData'] = getLatestData(request, code)
        response['groupbyDate'] = groupByDate(request, code)
        response['total'] = getTotalEntireAfg(request, code)
    
    response['googledata'] = json.dumps(response, cls=JSONEncoderCustom)

    return response
