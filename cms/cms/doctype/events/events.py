# -*- coding: utf-8 -*-
# Copyright (c) 2018, Tridots and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.website.website_generator import WebsiteGenerator


class Events(WebsiteGenerator):
    def validate(self):
        if not self.restaurant:
            if frappe.session.user != "Guest":
                user = frappe.db.sql(
                    """
                    select u.* 
                    from `tabUser` u,`tabHas Role` r 
                    where u.name=r.parent 
                    and r.role="Restaurant Admin" 
                    and u.name=%s
                    """,
                    (frappe.session.user),
                    as_dict=1,
                )
                if user:
                    for data in user:
                        self.restaurant = data.restaurant

    def on_update(self):
        if not self.route:
            self.route = self.event_title.replace(" ", "-").lower()


@frappe.whitelist(allow_guest=True)
def add_views(Name, Views):
    result = frappe.db.set_value("Events", Name, "views", Views)
    return result
