class securitydbRouter(object): 
    def db_for_read(self, model, **hints):
        "Point all operations on securitydb models to 'securitydb'"
        if model._meta.app_label == 'securitydb':
            return 'securitydb'
        return None

    def db_for_write(self, model, **hints):
        "Point all operations on securitydb models to 'securitydb'"
        if model._meta.app_label == 'securitydb':
            return 'securitydb'
        return None
    
    def allow_relation(self, obj1, obj2, **hints):
        "Allow any relation if a both models in securitydb app"
        if obj1._meta.app_label == 'securitydb' and obj2._meta.app_label == 'securitydb':
            return True
        # Allow if neither is chinook app
        elif 'securitydb' not in [obj1._meta.app_label, obj2._meta.app_label]: 
            return True
        return False
    
    def allow_syncdb(self, db, model):
        if db == 'securitydb' or model._meta.app_label == "securitydb":
            return False # we're not using syncdb on our legacy database
        else: # but all other models/databases are fine
            return True