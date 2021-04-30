from __future__ import unicode_literals
from frappe.data_migration.doctype.data_migration_connector.connectors.base import (
    BaseConnection,
)


class CmsConnection(BaseConnection):
    def __init__(self, connector):
        # self.connector = connector
        # self.connection = YourModule(self.connector.username, self.get_password())
        # self.name_field = 'id'
        pass

    def get(
        self, remote_objectname, fields=None, filters=None, start=0, page_length=10
    ):
        pass

    def insert(self, doctype, doc):
        pass

    def update(self, doctype, doc, migration_id):
        pass

    def delete(self, doctype, migration_id):
        pass
