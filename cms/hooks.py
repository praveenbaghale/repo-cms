# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "cms"
app_title = "CMS"
app_publisher = "Tridots"
app_description = "cms pages and cms sections"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@valiantsystems.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/cms/css/cms.css"
# app_include_js = "/assets/cms/js/cms.js"

# include js, css files in header of web template
# web_include_css = "/assets/cms/css/cms.css"
# web_include_js = "/assets/cms/js/cms.js"
web_include_css = ["assets/css/frappe-web.css"]
web_include_js = ["website_script.js"]
update_website_context = "cms.cms.api.get_website_context"
# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "cms.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "cms.install.before_install"
# after_install = "cms.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "cms.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"cms.tasks.all"
# 	],
# 	"daily": [
# 		"cms.tasks.daily"
# 	],
# 	"hourly": [
# 		"cms.tasks.hourly"
# 	],
# 	"weekly": [
# 		"cms.tasks.weekly"
# 	]
# 	"monthly": [
# 		"cms.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "cms.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "cms.event.get_events"
# }

permission_query_conditions = {
    # "Image Gallery": "cms.cms.doctype.image_gallery.image_gallery.get_permission_query_conditions",
    # "Home Slider": "cms.cms.doctype.home_slider.home_slider.get_permission_query_conditions",
}
