# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _


def get_data():
    return [
        {
            "module_name": "CMS",
            "color": "grey",
            "icon": "fa fa-cogs",
            "icon": "octicon octicon-tools",
            "type": "module",
            "label": _("Settings"),
        }
    ]
