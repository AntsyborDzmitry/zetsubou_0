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
CQ.Translator.ImportExcelDialog = CQ.Ext.extend(CQ.Translator.Dialog, {
    file: null,

    constructor: function(config) {
        var path = CQ.utils.WCM.getPagePath() + ".import.xlsx";

        this.file = new CQ.Ext.ux.form.FileUploadField({
            fieldLabel:"Excel",
            name: "file",
            allowBlank:false,
            width: 290,
            height: 26
        });

        CQ.Ext.applyIf(config, {
            title:"Import Excel translations",
            description:"Please choose an excel file containing translations.",
            closeAction:"close",
            formCfg: {
                labelWidth: 80,
                labelPad: 0,
                url: path,
                fileUpload: true
            },
            items:[
                this.file,
                CQ.Translator.Dialog.createDescription("<br/><br/>Target: " + path)
            ]
        });
        CQ.Translator.ImportXLIFFDialog.superclass.constructor.call(this, config);
    },

    doSubmit: function() {
        return this.ajaxFormSubmitAdditional();
    }
});
CQ.Ext.reg("importexceldialog", CQ.Translator.ImportExcelDialog);
