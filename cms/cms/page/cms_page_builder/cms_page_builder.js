frappe.pages['cms-page-builder'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'CMS Page Builder',
        single_column: true
    });
    page.set_primary_action(__("Save"), function() {
        page_builder.save_page()
    })
    page.set_secondary_action(__("Refresh"), function() {
        page_builder.init()
    })
    page.add_menu_item(__("Preview"), function() {
        page_builder.show_preview()
    })
}
var page_builder;
frappe.pages['cms-page-builder'].refresh = function(wrapper) {
    page_builder = new CmsPageBuilder(wrapper)
}
var CmsPageBuilder = Class.extend({
    init: function(parent) {
        let me = this;
        let route = frappe.get_route();
        this.parent = parent;
        this.refresh();
        this.page = '';
        if (route[1]) {
            this.page = route[1]
            this.get_page_data();
            $(parent).find('.page-head .title-text').text(this.page);
        }
        this.available_components = [];
        this.layouts = [];
        this.get_available_components();
        this.sections = [];
    },
    refresh: function() {
        var sections = [];
        $('.page-content').find('.layout-main').append(frappe.render_template("cms_page_builder", { 'sections': sections }));
    },
    get_page_data: function() {
        var me = this;
        frappe.call({
            method: 'cms.cms.page.cms_page_builder.cms_page_builder.get_page_details',
            args: {
                page: me.page
            },
            callback: function(data) {
                if (data.message) {
                    $('.page-content').find('.layout-main').find('.page-sections').remove();
                    $('.page-content').find('.layout-main').append(frappe.render_template("cms_page_builder", { 'sections': data.message.sections }));
                    $(data.message.sections).each(function(k, v) {
                        $(v.section_components).each(function(i, j) {
                            $(j.parent_id).attr('data-id', j.name)
                        })
                    })
                }
            }
        })
    },
    get_available_components: function() {
        var me = this;
        frappe.call({
            method: 'cms.cms.page.cms_page_builder.cms_page_builder.get_all_components',
            args: {},
            callback: function(data) {
                if (data.message) {
                    me.available_components = data.message.components;
                    me.layouts = data.message.layout;
                }
            }
        })
    },
    save_page: function() {
        var me = this;
        let sections = [];
        $('.sections-def').each(function() {
            var sec = {};
            var sec_comp = [];
            var html = '';
            var sec_def = this;
            sec.title = $(this).find('.section-title').text();
            sec.idx = $(this).attr('id').split('section-')[1];
            sec.page_section_name = $(this).attr('data-name');
            sec.layout_html = $(this).find('.layout').html();
            sec.page = me.page;
            sec.custom_css=$(this).find('#custom_css').val();
            sec.custom_script=$(this).find('#custom_script').val();
            var parent_id = '#' + $(this).attr('id');
            let styles='';
            let bg=$(this).find('.layout').find('#background').val();
            if(bg=='Color'){
                styles+='background-color: '+$(this).find('.layout').find('#bg-color').val()+';';
            }else if(bg=='Gradient'){
                let grad_type=$(this).find('.layout').find('#grad-type').val();
                let grad1=$(this).find('.layout').find('#bg-grad-1').val();
                let grad2=$(this).find('.layout').find('#bg-grad-2').val();
                if(grad_type=='Linear'){
                    let grad_dir=$(this).find('.layout').find('#grad-direction').val();
                    if(grad_dir)
                        styles+='background-image:linear-gradient(to '+grad_dir.toLoweCase()+','+grad1+','+grad2+');'
                }else{
                    styles+='background-image:radial-gradient('+grad1+','+grad2+');'
                }
            }else{
                styles+='background: url('+$(this).find('.layout').find('#bg-image').val()+');'
                styles+='background-repeat: no-repeat;background-size: cover;'
            }
            let custom_class=$(this).find('.layout').find('#custom-class').val();
            let custom_id=$(this).find('.layout').find('#custom-id').val();
            html += '<div class="section sections-def" id="section-' + sec.idx + '" styles="'+styles+'">';
            html+='<div class="'+custom_class+'" id="'+custom_id+'">'
            $(this).find('.layout .row').each(function() {
                html += '<div class="row row-def">';
                let count = 1;
                $(this).find('.columns').each(function() {
                    var cols_def = this;
                    html += '<div class="' + $(this).attr('class') + '" id="column-' + count + '">'
                    $(cols_def).find('.component').each(function() {
                        let component_def = page_builder.available_components.find(obj => obj.name == $(this).attr('data-name'))
                        let comp_parent = parent_id + ' .columns .component[data-name="' + $(this).attr('data-name') + '"]';
                        let c_h = component_def.html;
                        $('.test-html-values').html(c_h);
                        $(this).find('input[type=hidden]').each(function() {
                            let fi = component_def.fields_list.find(o => o.name == $(this).attr('name'));
                            let s_comp = {};
                            s_comp.parent_id = comp_parent;
                            s_comp.name = $(comp_parent).attr('data-id');
                            s_comp.class_name = fi.class_name;
                            s_comp.value = $(this).attr('value');
                            s_comp.attribute = fi.attribute_name;
                            s_comp.component = component_def.name;
                            sec_comp.push(s_comp)
                            if (fi.value_type == 'Text' && fi.field_type == 'Text Area') {
                                $('.test-html-values').find(s_comp.class_name).html(s_comp.value)
                            } else if (fi.value_type == 'Text' && fi.field_type != 'Text Area') {
                                $('.test-html-values').find(s_comp.class_name).text(s_comp.value)
                            } else {
                                var attributes = $('.test-html-values').find(s_comp.class_name).attr(s_comp.attribute);
                                if(attributes!=undefined&&attributes!=''&&attributes!=null)
                                	attributes += ' ' + s_comp.value
                                else
                                	attributes=s_comp.value
                                if(s_comp.attributes=='src')
                                	attributes=s_comp.value;
                                $('.test-html-values').find(s_comp.class_name).attr(s_comp.attribute, attributes)
                            }
                        })
                        html += '<div>' + $('.test-html-values').html() + '</div>';
                    })
                    html += '</div>';
                    count = count + 1;
                })
                html += '</div>'
            })
            html += '</div></div>'
            sec.html = html;
            sec.components = sec_comp;
            sections.push(sec);
        });
        this.sections = sections;
        me.save_data()
    },
    save_data: function() {
        var me = this;
        frappe.call({
            method: 'cms.cms.page.cms_page_builder.cms_page_builder.add_sections',
            args: {
                sections: me.sections
            },
            callback: function(data) {
                frappe.msgprint('Your changes have been saved', 'Success')
                me.init();
            }
        })
    },
    show_preview: function() {
        var me = this;
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                'doctype': 'CMS Page',
                'filters': { 'name': me.page },
                'fieldname': ['route', 'published']
            },
            callback: function(data) {
                if (data.message) {
                    if (data.message.published) {
                        var url = window.location.origin + '/' + data.message.route;
                        window.open(url, '_blank')
                    }
                }
            }
        })
    }
})
var add_new_section = function() {
    var dialog_html = '<div class="row row-def">'
    $(page_builder.layouts).each(function(k, v) {
        dialog_html += '<div class="col-md-4 col-sm-4 col-xs-12 layout-def" data-name="' + v.name + '" onclick="select_layout(this)"><div>'
        if (v.layout_image) {
            dialog_html += '<img src="' + v.layout_image + '" />';
        } else {
            dialog_html += v.column_width;
        }
        dialog_html += '</div></div>'
    })
    dialog_html += '</div>'
    frappe.msgprint(dialog_html, 'Select Layout')
}
var new_item = '<div class="new-item" onclick="select_component(this)"><span class="octicon octicon-plus"></span> Add New Component</div>';
var select_layout = function(e) {
    var name = $(e).attr('data-name');
    let layout = page_builder.layouts.find(obj => obj.name == name);
    var section_len = $('.page-content .all-section .sections-def').length + 1;
    var html = '<div class="sections-def" id="section-' + section_len + '"><div class="edit-options">\
		<div class="section-title"></div><span class="octicon octicon-code" onclick="add_custom_script(this)">\
        <span class="octicon octicon-gear" onclick="custome_style(this)"></span></span><span class="octicon octicon-x" onclick="delete_section(this)"></span>\
		</div><div class="layout" data-name="' + name + '">' + layout.layout_html + '</div><div class="new-module" onclick="add_module(this)">\
		<div><span class="octicon octicon-plus"></span> Add New Row</div></div><input type="hidden" name="custom_script" \
		id="custom_script" value="" /><input type="hidden" name="custom_css" id="custom_css" value="" /></div>'
    $('.page-content .all-section').append(html)
    $('#section-' + section_len).find('.columns').append(new_item)
    $('#section-' + section_len).find('.row').first().addClass('row-def');
    $('#section-' + section_len).find('.row').first().prepend('<div class="edit-row" onclick="delete_row(this)"><span class="octicon octicon-x"></span></div>')
    $('.btn-modal-close').trigger('click')
    let hiddens='<input type="hidden" id="background" /><input type="hidden" id="bg-color" /><input type="hidden" id="bg-grad-1" />'
    hiddens+='<input type="hidden" id="bg-grad-2" /><input type="hidden" id="grad-type" /><input type="hidden" id="grad-direction" />'
    hiddens+='<input type="hidden" id="bg-image" name="bg-image" /><input type="hidden" id="custom-class" /><input type="hidden" id="custom-id" />'
    $('#section-' + section_len).find('.layout').append(hiddens)
    var dialog = new frappe.ui.Dialog({
        title: 'Section Title',
        fields: [{
            fieldtype: "Data",
            fieldname: "section_title",
            label: "Section Title",
            reqd: 1
        }]
    })
    dialog.set_primary_action(__('Add Section'), function() {
        let values = dialog.get_values();
        $('#section-' + section_len).find('.section-title').text(values.section_title)
        dialog.hide();
    });
    dialog.show();
}
var add_new_component;
var select_component = function(e) {
    add_new_component = $(e).parent();
    var html = '<div class="row">'
    $(page_builder.available_components).each(function(k, v) {
        html += '<div class="col-md-6 comp" onclick="add_component(this)" data-name="' + v.name + '"><div>' + v.title + '</div>'
        $(v.fields_list).each(function(i, j) {
            html += '<input type="hidden" class="field_options" value="" name="' + j.name + '" />'
        })
        html += '</div>'
    })
    html += '</div>';
    frappe.msgprint(html, 'Select Component')
    $('.modal .msgprint .row').css('margin-left', '0')
    $('.modal .msgprint .row').css('margin-right', '0')
}
var add_component = function(e) {
    var component = $(e).attr('data-name');
    let comp = page_builder.available_components.find(obj => obj.name == component);
    var html = '<div class="component" data-name="' + component + '"><div class="coop">' + component + '</div><div class="edit" onclick="edit_options(this)"><span class="octicon octicon-gear"></span></div></div>';
    $(add_new_component).append(html);
    $(add_new_component).find('.new-item').remove();
    $(add_new_component).append(new_item);
    let section_id = $(add_new_component).parent().parent().parent().attr('id');
    let component_html = add_new_component;
    add_new_component = null;
    let fields = [];
    let hiddens = ''
    $('.btn-modal-close').trigger('click')
    $(comp.fields_list).each(function(k, v) {
	    if(v.value_type!='Style'){
	    	let field = {};
	        field.fieldname = v.name;
	        if (v.field_type == 'Text')
	            field.fieldtype = 'Data'
	        else if (v.field_type == 'Text Area')
	            field.fieldtype = 'Text Editor'
	        else if (v.field_type == 'Image') {
	            field.fieldtype = 'Attach Image';
	        } else if (v.fieldtype == 'Dropdown') {
	            let l = (v.dropdown_options.split('\n'))
	            field.fieldtype = 'Select';
	            field.options = l.join('\n')
	        }
	        field.label = v.title;
	        if (v.field_description)
	            field.description = v.field_description;
	        fields.push(field);
	    }
        hiddens += '<input type="hidden" class="field_options" value="" name="' + v.name + '" />'
    })
    $(component_html).find('.component[data-name="' + component + '"]').append(hiddens)
    var dialog = new frappe.ui.Dialog({
        title: "Component Properties",
        fields: fields
    })
    dialog.set_primary_action(__('Save'), function() {
        let values = dialog.get_values();
        let keys = Object.keys(values)
        $(keys).each(function(k, v) {
            let fd = comp.fields_list.find(obj => obj.name == v);
            if (fd.field_type == 'Image') {
                let cls = '.component[data-name="' + component + '"]'
                upload_image(values[v], v, component_html, cls);
            } else {
                $(component_html).find('.component[data-name="' + component + '"]').find('input[name="' + v + '"]').val(values[v]);
            }
        });
        dialog.hide();
    });
    dialog.show();
}
var add_module = function(e) {
    var layout_type = $(e).parent().find('.layout').attr('data-name')
    let layout = page_builder.layouts.find(obj => obj.name == layout_type);
    $(e).parent().find('.layout').append(layout.layout_html)
    let section = $(e).parent().attr('id')
    $('#' + section).find('.row').last().find('.columns').append(new_item)
    $('#' + section).find('.row').last().addClass('row-def')
    $('#' + section).find('.row').last().prepend('<div class="edit-row" onclick="delete_row(this)"><span class="octicon octicon-x"></span></div>')
}
var add_custom_script = function(e) {
    var section_name = $(e).parent().parent().attr('id');
    let custom_css=$(e).parent().parent().find('#custom_css').val();
    let custom_script=$(e).parent().parent().find('#custom_script').val();
    var dialog = new frappe.ui.Dialog({
        title: 'Add Custom Css & Script',
        fields: [{
            fieldname: 'custom_css',
            fieldtype: 'Text',
            label: 'Custom Css',
            default:custom_css
        }, {
            fieldname: 'custom_script',
            fieldtype: 'Text',
            label: 'Custom Script',
            default:custom_script
        }]
    })
    dialog.set_primary_action(__('Save'), function() {
        let values = dialog.get_values();
        $('#' + section_name).find('#custom_script').val(values.custom_script)
        $('#' + section_name).find('#custom_css').val(values.custom_css)
        dialog.hide();
    });
    dialog.show();
}
var edit_options = function(e) {
    var component = $(e).parent().attr('data-name');
    let ids=$(e).parent().attr('data-id')
    let comp = page_builder.available_components.find(obj => obj.name == component);
    let fields = [];
    $('.btn-modal-close').trigger('click')
    $(comp.fields_list).each(function(k, v) {
		if(v.field_type!='Style'){
			let field = {};
	        field.fieldname = v.name;
	        if (v.field_type == 'Text')
	            field.fieldtype = 'Data'
	        else if (v.field_type == 'Text Area')
	            field.fieldtype = 'Text Editor'
	        else if (v.field_type == 'Image')
	            field.fieldtype = 'Attach Image'
	        else if (v.field_type == 'Dropdown') {
	            let l = (v.dropdown_options.split('\n'))
	            field.fieldtype = 'Select';
	            field.options = l.join('\n')
	        }
	        var val = $(e).parent().find('input[name="' + v.name + '"]').val();
	        field.default = val;
	        field.label = v.title;
	        if (v.field_description)
	            field.description = v.field_description;
	        fields.push(field);
		}
    })
    fields.push({
        fieldtype: 'Button',
        fieldname: 'delete_component',
        label: 'Remove Component',
        click: function(ev) {
            frappe.confirm(
                'Are you sure to delete this component?',
                function() {
                    let components=[];                    
                    if(ids){
                    	components.push(ids)
                    	$(e).parent().remove();
                    	dialog.hide();
                    	delete_component(components)                    	
                    }else{
                    	$(e).parent().remove();
                    	dialog.hide();
                    }                
                },
                function() {

                }
            )
        }
    })
    var dialog = new frappe.ui.Dialog({
        title: "Component Properties",
        fields: fields
    })
    dialog.set_primary_action(__('Save'), function() {
        let values = dialog.get_values();
        let keys = Object.keys(values)
        $(keys).each(function(k, v) {
            let fd = comp.fields_list.find(obj => obj.name == v);
            if (fd.field_type == 'Image') {
                let cls = '.component[data-name="' + component + '"]'
                upload_image(values[v], v, $(e).parent().parent(), cls);
            } else {
                $(e).parent().find('input[name="' + v + '"]').val(values[v]);
            }

        });
        dialog.hide();
    });
    dialog.show();
}
var delete_row = function(e) {
    let section_id = $(e).parent().parent().parent().attr('id');
    let delete_components = []
    frappe.confirm(
        'Are you sure to delete this row?',
        function() {
            $(e).parent().find('.columns').find('.component').each(function() {
                let name = $(this).attr('data-id');
                if (name)
                    delete_components.push(name)
            })
            $(e).parent().remove();
            delete_component(delete_components)
        },
        function() {

        }
    )

}
var delete_component = function(components) {
    frappe.call({
        method: 'cms.cms.page.cms_page_builder.cms_page_builder.delete_components',
        args: {
            components: components
        },
        callback: function(data) {
            page_builder.save_page();
        }
    })
}
var upload_image = function(image, name, comp_html, clss) {
    var file_name = image.split(',')[0];
    var dataurl = ''
    if(image.indexOf('jpg') != -1)
        dataurl=image.split('.jpg,')[1];
    else if(image.indexOf('png')!=-1)
        dataurl=image.split('.png,')[1];
    frappe.call({
        method: "uploadfile",
        args: {
            from_form: 1,
            is_private: 0,
            doctype: 'Page Section',
            filename: file_name,
            file_url: '',
            filedata: dataurl
        },
        async: false,
        freeze: true,
        callback: function(data) {
            $(comp_html).find(clss).find('input[name="' + name + '"]').val(data.message.file_url)
        }
    })
}
var delete_section = function(e) {
    var section = $(e).parent().parent().attr('data-name');
    frappe.confirm(
        'Are you sure to delete this section?',
        function() {
            let components = [];
            if (section) {
                $(e).parent().parent().find('.layout').find('.row-def').each(function() {
                    $(this).find('.columns').find('.component').each(function() {
                        let name = $(this).attr('data-id');
                        if (name)
                            components.push(name)
                    })
                })
                delete_sections(section, components)
            } else {
                $(e).parent().parent().parent().remove();
            }
        },
        function() {

        }
    )
}
var delete_sections = function(section, component) {
    frappe.call({
        method: 'cms.cms.page.cms_page_builder.cms_page_builder.delete_section',
        args: {
            section: section,
            component: component,
            page: page_builder.page
        },
        callback: function(data) {
            page_builder.save_page();
        }
    })
}
var custome_style=function(e){
    let fields=[
        {
            "fieldname":"backgroud_options",
            "fieldtype":"Select",
            "label":"Backgroud Type",
            "options":"\nColor\nGradient Color\nImage"
        },
        {
            "fieldtype":"Color",
            "fieldname":"background_color",
            "label":"Background Color",
            "depends_on":"eval:{{doc.backgroud_options=='Color'}}"
        },
        {
            "fieldtype":"Color",
            "fieldname":"gradient_1",
            "label":"Gradient Color 1",
            "depends_on":"eval:{{doc.backgroud_options=='Gradient Color'}}"
        },
        {
            "fieldtype":"Color",
            "fieldname":"gradient_2",
            "label":"Gradient Color 2",
            "depends_on":"eval:{{doc.backgroud_options=='Gradient Color'}}"
        },
        {
            "fieldtype":"Select",
            "fieldname":"gradient_type",
            "label":"Gradient Type",
            "options":"Linear\nRadial",
            "depends_on":"eval:{{doc.backgroud_options=='Gradient Color'}}"
        },
        {
            "fieldtype":"Select",
            "fieldname":"gradient_direction",
            "label":"Gradient Direction",
            "options":"Top\nBottom\nLeft\nRight\nTop Right\nTop Left\nBottom Right\nBottom Left",
            "depends_on":"eval:{{doc.gradient_type=='Linear'}}"
        },
        {
            "fieldname":"background_image",
            "fieldtype":"Attach Image",
            "label":"Background Image",
            "depends_on":"eval:{{doc.backgroud_options=='Image'}}"
        },
        {
            "fieldtype":"Section Break",
            "fieldname":"s1",
            "label":"Custom Style"
        },
        {
            "fieldtype":"Data",
            "fieldname":"custom_class",
            "label":"Custom Class"
        },
        {
            "fieldtype":"Data",
            "fieldname":"custom_id",
            "label":"Custom Id"
        }
    ]
    var dialog=new frappe.ui.Dialog({
        title:"Section Style",
        fields:fields
    })
    dialog.set_primary_action(__('Save'), function() {
        let values = dialog.get_values();
        $(e).parent().parent().find('.layout').find('#background').val(values.backgroud_options)
        if(values.backgroud_options=='Color'){
            $(e).parent().parent().find('.layout').find('#bg-color').val(values.background_color)
        }else if(values.backgroud_options=='Gradient'){
            $(e).parent().parent().find('.layout').find('#bg-grad-1').val(values.gradient_1)
            $(e.parent().parent()).find('.layout').find('#bg-grad-2').val(values.gradient_2)
            $(e).parent().parent().find('.layout').find('#grad-type').val(values.gradient_type)
            if(values.gradient_type=='Linear')
                $(e).parent().parent().find('.layout').find('#grad-direction').val(values.gradient_direction)
        }else{
            upload_image(values.background_image, 'bg-image', $(e).parent().parent(), '.layout');
        }
        $(e).parent().parent().find('.layout').find('#custom-class').val(values.custom_class)
        $(e).parent().parent().find('.layout').find('#custom-id').val(values.custom_id)
        dialog.hide()
    });
    let bg=$(e).parent().parent().find('.layout').find('#background').val();
    dialog.set_value('backgroud_options',bg)
    if(bg=='Color'){
        dialog.set_value('background_color',$(e).parent().parent().find('.layout').find('#bg-color').val())
    }else if(bg=='Gradient'){
        dialog.set_value('gradient_1',$(e).parent().parent().find('.layout').find('#bg-grad-1').val())
        dialog.set_value('gradient_2',$(e).parent().parent().find('.layout').find('#bg-grad-2').val())
        dialog.set_value('gradient_type',$(e).parent().parent().find('.layout').find('#grad-type').val())
        if($(e).parent().parent().find('.layout').find('#grad-type').val()=='Linear')
            dialog.set_value('gradient_direction',$(e).parent().parent().find('.layout').find('#grad-direction').val())
    }else{
        dialog.set_value('background_image',$(e).parent().parent().find('.layout').find('#bg-image').val())
    }
    dialog.set_value('custom_class',$(e).parent().parent().find('.layout').find('#custom-class').val())
    dialog.set_value('custom_id',$(e).parent().parent().find('.layout').find('#custom-id').val())
    dialog.show();
}