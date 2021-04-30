# -*- coding: utf-8 -*-
# Copyright (c) 2018, tridotstech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.website.render import clear_cache
from frappe.utils import getdate, datetime
from datetime import date
from frappe.website.router import get_page_context


class NavigationBarItem(WebsiteGenerator):
    def autoname(self):
        self.name = self.navigation_bar_title

    def validate(self):
        if not self.route:
            self.route = "/" + self.scrub(self.name)
        super(NavigationBarItem, self).validate()
