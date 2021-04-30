// Copyright (c) 2018, Tridots and contributors
// For license information, please see license.txt

frappe.ui.form.on('Page Section', {
	refresh: function(frm) {

	}
});

frappe.ui.form.on("Page Section", "left_image", function(frm) {
        if(frm.doc.left_image==1){
          frm.set_value("right_image",0);
        
        }
        else{
            frm.set_value("right_image",1);
         
        }

    });
frappe.ui.form.on("Page Section", "right_image", function(frm) {
        if(frm.doc.right_image==1){
          frm.set_value("left_image",0);
        
        }
        else{
            frm.set_value("left_image",1);
         
        }

    });