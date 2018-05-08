DESCRIPTION:
send notifications of incoming forecast when trigger condition is satisfied
run periodically using celery task, ideally after every data update
DEPENDENCIES:
- sudo pip install https://github.com/dodiws/mailinglogger/archive/master.zip
TODO:
- find solution for send limit 100 recipient per email in gmail smtp,
  a: make many account like admin001.geonode@immap.org ... admin030.geonode@immap.org
  b: use Amazon Simple Email Service
- wrap file open in try-catch
- translation
- add organization logo to email
- ability to select emaillist.json from all available version
- link to interactive maps with deep integration of page state of selected earthquake, flood, and avalanche date
- triggercheck sistem bobot 
- simpan data glofas/gfms di database
- set pdf paper size to A3 150 dpi
DONE:
- def adminapproval() only process notif that is not sent, canceled, or in process
- capitalize area_scope on html view using custom string formatter
- add view in interactive maps button to email
- attach userlogo info on create.json request if key exist
- make emaillist.json default content = {}
- combine email_simple_hybrid_inlineimg.html and email_simple_hybrid.html
- convert jquery button to react
- separate layer for email map image and map pdf to flash flood and river flood
- earthquake_shakemap.url_getmap_tpl filter by eq_code
- prepare show email on web version
- add plaintext to email message body
- put edited mailinglogger with tls support to github to standardize installation
  sudo pip install https://github.com/dodiws/mailinglogger/archive/master.zip
- add info user, ip to summarising log email
- configure logger to email WARNING level log or above 
- move createjson data to separate file
- add earthquake epicenter layer to earthquake shakemap pdf attachment
- add earthquake shakemap layer to earthquake epicenter pdf attachment
- login test function
- put notification setting url on user pop menu
- put settings page, subscriptions and notifications page into user popup menu
- solve long response time for send notification with lots of recipients
- fix incorrect earthquake event on pdf attachment
- remove username and organization from pdf attachment
- pass error message's traceback to logger
- limit notification sent only once for the same event
- make script runable from command line to avoid time out
- use json file to store province/check-areas data
- modify change setting url in email from query parameter to path
BUG:
- arabic character not appear in map pdf
- translation for print pdf dashboard and map not working (dashboard done)
- send notif not working
FIXED:
- username still appear in print pdf dashboard 
- language setting not saved/used
- add timestamp to emaillist.json request to avoid cached response
- same name conflict for attachment name for en and prs language
- table sort not working correctly on report/notifivations (temp fix: presorted)
- Avalanche map pdf in river flood notification
- Earthquake epicentre map pdf in Earthquake shakemap notification
NOTE:
- On simple cache system
  Objective: prevent repeated request of the exact same resource
  Implemented using dict
  Code pattern [deprecated; reason: bug when cacheid in cache but cache['cacheid'] is None]:
    result = cache[cacheid] = cache.get(cacheid) or long_running_function()
  Code pattern:
    result = cache[cacheid] = cache[cacheid] if (cacheid in cache) else long_running_function()
    or
    result = cache.setdefault(cacheid, (cacheid in cache) or long_running_function())
  result will be retrieved from cache dict based on unique cacheid, long_running_function() executed only when cacheid not in cache
- when replacing create_earthquake.json insert $event_code template variable
  on appropiate places
- Run pushnotif as celery task including other tasks listed in CELERY_IMPORTS in settings.py:
  ./manage.py celery worker
  or
  celery -A geonode.celery_app worker --loglevel=DEBUG
