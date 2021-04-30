from __future__ import unicode_literals
from frappe import _


def get_data():
    return [
        {
            "label": _("Website Settings"),
            "items": [
                {"type": "doctype", "name": "Home Slider"},
                {"type": "doctype", "name": "Image Gallery"},
                {"type": "doctype", "name": "Video Gallery"},
                {"type": "doctype", "name": "Home Page Settings"},
                {
                    "type": "doctype",
                    "name": "About Us Settings",
                },
                {
                    "type": "doctype",
                    "name": "Contact Us Settings",
                },
                {"type": "doctype", "name": "CMS Page", "label": "Custom Pages"},
                {"type": "doctype", "name": "Page Section"},
                {"type": "doctype", "name": "Layout"},
                {"type": "doctype", "name": "Layout Components"},
                {"type": "doctype", "name": "Events"},
                {"type": "doctype", "name": "Category Group"},
                {"type": "doctype", "name": "Category"},
                {"type": "doctype", "name": "Section Link"},
                {"type": "doctype", "name": "Navigation Bar Item"},
                {"type": "doctype", "name": "Homepage Settings"},
                {"type": "doctype", "name": "Homepage Setting"},
            ],
        },
        {
            "label": _("Contact Enquiry"),
            "items": [{"type": "doctype", "name": "Contact Enquiries"}],
        },
    ]
