// Copyright (c) 2019, Tridots and contributors
// For license information, please see license.txt

frappe.ui.form.on('Layout', {
	refresh: function(frm) {

	},
	// validate:function(frm){
	// 	console.log(frm)
	// 	if(frm.doc.column_width){
	// 		console.log(frm.doc.layout_html)
	// 		if(frm.doc.layout_html==null || frm.doc.layout_html==undefined || frm.doc.layout_html!=''){
	// 			let parts=frm.doc.column_width.split('x');
	// 			let html='<div class="row">'
	// 			$(parts).each(function(){
	// 				html+='<div class="col-md-'+parts.trim()+'"></div>';
	// 			})
	// 			html+='</div>';
	// 			console.log(html)
	// 			frm.set_value('layout_html',html)
	// 		}
	// 	}
	// }
});
