class geodbRouter(object): 
    def db_for_read(self, model, **hints):
        "Point all operations on geodb models to 'geodb'"
        if model._meta.app_label == 'geodb':
            return 'geodb'
        return 'default'

    def db_for_write(self, model, **hints):
        "Point all operations on geodb models to 'geodb'"
        if model._meta.app_label == 'geodb':
            return 'geodb'
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        "Allow any relation if a both models in geodb app"
        if obj1._meta.app_label == 'geodb' and obj2._meta.app_label == 'geodb':
            return True
        # Allow if neither is chinook app
        elif 'geodb' not in [obj1._meta.app_label, obj2._meta.app_label]: 
            return True
        return False
    
    def allow_syncdb(self, db, model):
        if db == 'geodb' or model._meta.app_label == "geodb":
            return False # we're not using syncdb on our legacy database
        else: # but all other models/databases are fine
            return True