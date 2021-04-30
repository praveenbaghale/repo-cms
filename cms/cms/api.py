# -*- coding: utf-8 -*-
# Copyright (c) 2018, Tridots and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe


def get_website_context(context):
    context.layout_settings = frappe.get_single("Website Settings")
    if context.footer_layout:
        footer_page = frappe.db.get_all(
            "CMS Page", filters={"name": context.footer_layout}
        )
        if footer_page:
            context.footer_sections = frappe.db.sql(
                """
                SELECT
                    sec.name,
                    sec.description,
                    sec.layout,
                    sec.title,
                    sec.layout_html,
                    sec.custom_style,
                    sec.custom_script,
                    csec.idx
                FROM `tabPage Section` sec 
                INNER JOIN `tabCMS Page Sections` csec ON sec.name=csec.section
                WHERE csec.parent=%(parent)s
                ORDER BY csec.idx
                """,
                {"parent": footer_page[0].name},
                as_dict=1,
            )
