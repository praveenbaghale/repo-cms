# -*- coding: utf-8 -*-
# Copyright (c) 2018, Tridots and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class PageSection(Document):
    def on_update(self):
        page_sections = frappe.db.get_all(
            "CMS Page Sections", filters={"section": self.name, "parent": self.page_id}
        )
        if page_sections:
            data = frappe.get_doc("CMS Page Sections", page_sections[0])
            data.title = self.title
            data.idx = self.data_idx
            data.save(ignore_permissions=True)
        else:
            frappe.get_doc(
                {
                    "doctype": "CMS Page Sections",
                    "parent": self.page_id,
                    "parenttype": "CMS Page",
                    "parentfield": "page_section",
                    "section": self.name,
                    "title": self.title,
                    "idx": self.data_idx,
                }
            ).insert()
