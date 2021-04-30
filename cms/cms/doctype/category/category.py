# -*- coding: utf-8 -*-
# Copyright (c) 2018, Tridots and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.website.website_generator import WebsiteGenerator


class Category(WebsiteGenerator):
    def autoname(self):
        self.name = self.category_name

    def validate(self):
        if not self.route:
            self.route = "/" + self.scrub(self.name)
        super(Category, self).validate()

    def get_context(self, context):
        Category = frappe.db.get_all(
            "Category", fields=["*"], filters={"published": 1, "route": self.route}
        )
        if Category:
            for page in Category:
                page.Pages = frappe.db.get_all(
                    "CMS Page", fields=["*"], filters={"category": page.name}
                )
        context.Category = Category
