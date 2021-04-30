# -*- coding: utf-8 -*-
# Copyright (c) 2018, tridotstech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.website.website_generator import WebsiteGenerator


class CMSPage(WebsiteGenerator):
    def autoname(self):
        self.name = self.page_title

    def validate(self):
        if not self.route:
            self.route = "/" + self.scrub(self.name)
        super(CMSPage, self).validate()

    def get_context(self, context):
        Pages = frappe.db.get_all(
            "CMS Page", fields=["*"], filters={"published": 1, "name": self.name}
        )
        context.sections = frappe.db.sql(
            """
            select 
                sec.name,
                sec.description,
                sec.layout,
                sec.title,
                sec.layout_html,
                sec.custom_style,
                sec.custom_script,
                csec.idx
            from `tabPage Section` sec 
            inner join `tabCMS Page Sections` csec on sec.name=csec.section 
            where csec.parent=%(parent)s 
            order by csec.idx
            """,
            {"parent": self.name},
            as_dict=1,
        )
        context.Pages = Pages[0]
        context.title = Pages[0].page_title
