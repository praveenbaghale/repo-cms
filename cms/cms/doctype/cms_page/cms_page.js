// Copyright (c) 2018, Tridots and contributors
// For license information, please see license.txt

frappe.ui.form.on('CMS Page', {
	refresh: function(frm) {
		if(frm.doc.__islocal){
			frm.set_df_property('sec_2','hidden',1)
		}else{
			frm.set_df_property('sec_2','hidden',0)
		}
	},
	onload: function(frm){
		// console.log(frm.doc.page_title)
	},
	add_sections:function(frm){
		if(cur_frm.doc.__unsaved){
			frappe.throw('Please save the document to proceed.')
		}else{
			let route='cms-page-builder/'+frm.doc.name
			frappe.set_route(route)
		}
	}
});
