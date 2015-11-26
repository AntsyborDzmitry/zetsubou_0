/*
 * Copyright 1997-2011 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */
CQ.Ext.ns("CQ.Translator");

CQ.Translator.Dialog = CQ.Ext.extend(CQ.Ext.Window, {
    form: null,
    
    constructor: function(config) {
        var focusIndex = 0;
        
        if (config.description) {
            config.items.unshift(CQ.Translator.Dialog.createDescription(config.description));
            delete config.description;
            focusIndex = 1;
        }
        // apply focus index if defined by dialog
        focusIndex = config.focusIndex ? config.focusIndex : focusIndex;
        
        var formCfg = config.formCfg ? config.formCfg : {};
        formCfg.items = config.items;
        
        
        this.form = new CQ.Ext.form.FormPanel(CQ.Ext.applyIf(formCfg, CQ.Translator.Dialog.FORM_DEFAULTS));
        delete config.items;

        CQ.Ext.applyIf(config, {
            y:120,
            width:420,
            height:260,
            closable:true,
            resizable:false,
            draggable:true,
            modal:true,
            closeAction:"hide",
            layout:"fit",
            //bodyStyle:"padding:5px;", // like how this looks, but disabling for now :)
            items:this.form,

            buttons:[
                {
                    text:"OK",
                    scale:"small",
                    handler:this.save,
                    scope:this,
                    formBind:true
                },{
                    text:"Cancel",
                    scale:"small",
                    handler:function() {
                        this.cancel();
                    },
                    scope:this
                }
            ],

            listeners:{
                show:function(win) {
                    win.form.items.get(focusIndex).focus(true, 400);
                    win.onShow();
                }
            }
        });
        CQ.Translator.Dialog.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        CQ.Translator.Dialog.superclass.initComponent.call(this);
        
        this.addEvents(
            /**
             * @event success
             * Fires when the dialog was successfully submitted. What this means
             * depends on the dialog implementation. Typically this is a success
             * response from the dialog's form submission.
             * @param {CQ.Translator.Dialog} this dialog
             * @param {Object} args... further arguments depending on the implementation
             */
            "success",
            
            /**
             * @event failure
             * Fires when the dialog submission failed. What this means
             * depends on the dialog implementation. Typically this is a failure
             * response from the dialog's form submission.
             * @param {CQ.Translator.Dialog} this dialog
             * @param {Object} args... further arguments depending on the implementation
             */
            "failure"
        );
        
        var dlg = this;
        
        // add key listener to submit dialog when enter is pressed
        this.form.items.each(function(item) {
            if (item instanceof CQ.Ext.form.Field) {
                item.on("specialkey", function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            dlg.save();
                        }
                    }
                );
            }
        });
    },

    onShow: function() {
        // can be overwritten by subclasses
    },

    // private
    save: function() {
        var dlg = this;
        
        var form = this.form.getForm();
        if (form.isValid()) {
            if (this.doSubmit()) {
                dlg.hide();
            }
        }
    },
    
    doSubmit: function() {
        // override to implement your submit actions
    },

    ajaxFormSubmit: function() {
        var dlg = this;
        this.form.getForm().submit({
            //url: this.form.url,
            timeout: 60,
            waitMsg: "submitting...",
            success: function(form, action) {
                dlg.fireEvent("success", dlg);
            },
            failure: CQ.Translator.Dialog.DEFAULT_ERROR_HANDLER,
            scope: this
        });
        return true;
    },

    ajaxFormSubmitAdditional: function() {
        var dlg = this;
        this.form.getForm().submit({
            //url: this.form.url,
            timeout: 60,
            waitMsg: "submitting...",
            success: function(form, action) {
                location.reload();
            },
            failure: function() {
                location.reload();
            },
            scope: this
        });
        return true;
    },

    cancel: function() {
        // can be overwritten by subclasses
        this.hide();
    },

    reset: function() {
        this.form.getForm().reset();
    }
});
CQ.Translator.Dialog.FORM_DEFAULTS = {
    border:false,
    bodyStyle:"padding:15px",
    autoScroll:true,
    defaults: {
        // disabled, because it breaks layout of the fileuploadfield
        //anchor:"100%"
    }
};

CQ.Translator.Dialog.createDescription = function(description) {
    return {
        xtype:"box",
        autoEl:{
            tag:"div",
            cls:"dialog-text",
            html:description
        },
        style: {
            marginBottom:"12px"
        }
    };
};

CQ.Translator.Dialog.DEFAULT_ERROR_HANDLER = function(form, action) {
    switch (action.failureType) {
        case CQ.Ext.form.Action.CONNECT_FAILURE:
            CQ.Ext.Msg.show({
                title:"Could not connect to server",
                msg:action.result.msg,
                icon:CQ.Ext.MessageBox.ERROR,
                buttons:CQ.Ext.MessageBox.OK
            });
            break;
        default:
            CQ.Ext.Msg.show({
                title:"Error",
                msg:action.result.msg,
                icon:CQ.Ext.MessageBox.ERROR,
                buttons:CQ.Ext.MessageBox.OK
            });
   }
   this.fireEvent("failure", this, action.result);
};
