# -*- coding: utf-8 -*-
# Copyright (c) 2018, Tridots and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class Layout(Document):
    def validate(self):
        if self.column_width and not self.layout_html:
            cols = self.column_width.split("x")
            html = '<div class="row">'
            for item in cols:
                html += '<div class="columns col-md-' + item.strip() + '"></div>'
            html += "</div>"
            self.layout_html = html
