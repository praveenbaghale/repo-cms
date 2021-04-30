from __future__ import unicode_literals
import frappe
import json


@frappe.whitelist()
def get_page_details(page):
    cms_page = frappe.db.get_all("CMS Page", filters={"name": page}, fields=["name"])
    if cms_page:
        for item in cms_page:
            sections = frappe.db.sql(
                """
                select sec.name, sec.layout, sec.title, sec.layout_html, sec.custom_style, sec.custom_script, csec.idx
                from `tabPage Section` sec inner join `tabCMS Page Sections` csec on sec.name=csec.section 
                where csec.parent=%(parent)s 
                order by csec.idx
                """,
                {"parent": item.name},
                as_dict=1,
            )
            if sections:
                for sec in sections:
                    sec.component_values = frappe.db.sql(
                        """
                        select name, parent_id, class, value, attribute, component 
                        from `tabSection Components` 
                        where parent=%(parent)s
                        """,
                        {"parent": sec.name},
                        as_dict=1,
                    )
                    section_components = frappe.db.sql(
                        """
                        select name, class_name, value, parent_id, component, attribute 
                        from `tabSection Components` 
                        where parent=%(parent)s
                        """,
                        {"parent": sec.name},
                        as_dict=1,
                    )
                    sec.section_components = section_components
            item.sections = sections
    return cms_page[0]


@frappe.whitelist()
def get_all_components():
    components = frappe.db.sql(
        """select name, title, html from `tabLayout Components`""", as_dict=1
    )
    if components:
        for item in components:
            item.fields_list = frappe.db.sql(
                """
                select 
                    title, 
                    field_description, 
                    class_name, 
                    value_type,
                    attribute_name,
                    field_type,
                    dropdown_options,
                    line_item,
                    name 
                from `tabComponent Fields` 
                where parent=%(parent)s
                """,
                {"parent": item.name},
                as_dict=1,
            )
    layouts = frappe.db.sql(
        """select column_width, name, layout_html, layout_image from `tabLayout`""",
        as_dict=1,
    )
    return {"components": components, "layout": layouts}


@frappe.whitelist()
def add_sections(sections):
    ref = json.loads(sections)
    if ref:
        for item in ref:
            if not item.get("page_section_name"):
                page_section = frappe.new_doc("Page Section")
                page_section.page_id = item.get("page")
                if item.get("components"):
                    for c in item.get("components"):
                        page_section.append("components", c)
            else:
                page_section = frappe.get_doc(
                    "Page Section", item.get("page_section_name")
                )
                if item.get("components"):
                    for c in item.get("components"):
                        if not c.get("name"):
                            page_section.append("components", c)
                        else:
                            if frappe.db.get_value("Section Components", c.get("name")):
                                code = frappe.get_doc(
                                    "Section Components", c.get("name")
                                )
                                code.parent_id = c.get("parent_id")
                                code.class_name = c.get("class_name")
                                code.component = c.get("component")
                                code.value = c.get("value")
                                code.attribute = c.get("attribute")
                                code.save()
                            else:
                                page_section.append("components", c)
            page_section.title = item.get("title")
            page_section.description = item.get("html")
            page_section.data_idx = item.get("idx")
            page_section.layout_html = item.get("layout_html")
            page_section.custom_style = item.get("custom_css")
            page_section.custom_script = item.get("custom_script")
            page_section.save()


@frappe.whitelist()
def delete_components(components):
    res = json.loads(components)
    for item in res:
        data = frappe.db.get_all("Section Components", filters={"name": item})
        if data:
            frappe.db.sql(
                """delete from `tabSection Components` where name=%(name)s""",
                {"name": item},
            )


@frappe.whitelist()
def delete_section(section, component, page):
    try:
        res = json.loads(component)
        for item in res:
            frappe.db.sql(
                """delete from `tabSection Components` where name=%(name)s""",
                {"name": item},
            )
        frappe.db.sql(
            """delete from `tabCMS Page Sections` where parent=%(page)s and section=%(section)s""",
            {"page": page, "section": section},
        )
        frappe.db.sql(
            """delete from `tabPage Section` where name=%(section)s""",
            {"section": section},
        )
    except Exception as e:
        print(e)
