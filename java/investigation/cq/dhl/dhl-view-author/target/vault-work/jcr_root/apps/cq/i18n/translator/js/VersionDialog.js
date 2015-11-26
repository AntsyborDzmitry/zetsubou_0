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
 /*global CQ*/
 /*global $*/
 CQ.Translator.VersionDialog = CQ.Ext.extend(CQ.Translator.Dialog, {

    constructor: function(config) {
        CQ.Ext.applyIf(config, {
            title: 'Add version',
            height: 200,
            resizable: true,
            //modal: false,
            languages: [],
            formCfg: {
                labelWidth: 80,
                labelPad: 0,
                defaults: {
                    xtype: 'textfield',
                    anchor: '95%'
                }
            },
            items: [{
                ref: '../stringField',
                fieldLabel: 'Name'
            }]
        });


        CQ.Translator.TranslationsDialog.superclass.constructor.call(this, config);
    },

    save: function() {

        var rec = {
            name: this.stringField.getValue(),
            path: this.pathToVersion
        };
        var self = this;
        $.ajax({
            url: this.store.proxy.api.create.url,
            type: this.store.proxy.api.create.method,
            data: rec,
            success: function() {
                self.store.reload();
                self.hide();
            },
            error: function() {
                CQ.Ext.Msg.alert('Failed to save', 'Failed to save version, try again later.');
            }
        });
    },

    addVersion: function(path) {
        this.pathToVersion = path;

        this.setTitle('Add version');

        this.form.items.each(function(f) {
            f.setValue('');
        }, this);

        this.show();
    }
});
CQ.Ext.reg('versiondialog', CQ.Translator.VersionDialog);
