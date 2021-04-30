// Copyright (c) 2018, Tridots and contributors
// For license information, please see license.txt

frappe.ui.form.on('Events', {
	refresh: function(frm) {
		check_current_user(frm)
	}
});
var check_current_user = function(frm) {
    frappe.call({
        method: 'restaurants.restaurant_admin.doctype.menu_items.menu_items.check_user',
        args: {},
        callback: function(data) {
            if (data.message != undefined) {
            	frm.set_value('restaurant',data.message[0].restaurant)
                frm.set_df_property("restaurant", "read_only", 1);
                frm.set_df_property("restaurant", "hidden", 1);
            } else {
                frm.set_df_property("restaurant", "read_only", 0);
                frm.set_df_property("restaurant", "hidden", 0);
            }
        }
    })
}