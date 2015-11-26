/*global window, document, $, CQ*/
/*eslint-disable angular/ng_window_service, angular/ng_angularelement */

const langPosition = window.location.href.indexOf('content/dhl/') + 'content/dhl/'.length;
const countrySlashLang = window.location.href.substring(langPosition);

// TODO: add support of ES6 for this sub project
const countrySlashLang$split = countrySlashLang.split('/');

const currentCountryId = countrySlashLang$split[0];
const currentLangId = countrySlashLang$split[1];

const nlsValidAttributes = ['placeholder', 'tooltip', 'title', 'value', 'alt'];

const langCode = currentLangId + '_' + currentCountryId;

const basicLanguageStrings = {};
const descriptions = {};

var nlsDialog = null;

const DIALOG_SETTINGS = {
    width: 600,
    modal: true,
    title: 'Live Translation',
    renderTo: CQ.Ext.getBody(),
    xtype: 'dialog',
    items: {
        xtype: 'panel',
        hideMode: 'offsets',
        items: []
    },
    buttons: [
        {
            text: 'Save'
        },
        {
            text: 'Cancel'
        }
    ]
};

const FIELD_PROPERTY_NAME = {
    xtype: 'textfield',
    fieldLabel: 'property name',
    disabled: true
};

const FIELD_DESCRIPTION = {
    xtype: 'textfield',
    name: 'description',
    disabled: true
};

const FIELD_BASIC_LANGUAGE = {
    xtype: 'textfield',
    name: 'basicLanguage',
    disabled: true
};

const FIELD_TRANSLATION = {
    xtype: 'textfield'
};

function saveButtonHandler() {
    const nlsProps = this.nlsProperties;
    saveTranslations(nlsProps.nlsKeys, nlsProps.nlsDictionary, 0, this.form);
}

function saveTranslations(nlsKeys, nlsDictionary, index, form) {
    const nlsKey = nlsKeys[index];
    const newValue = form.findField(nlsKey.name).getValue();
    CQ.Ext.Ajax.request({
        url: '/services/dhl/author/nls/update',
        method: 'GET',
        params: {
            id: nlsKey.key,
            value: newValue,
            dictionary: nlsDictionary,
            lang: langCode
        },
        success: function (/* responseObject */) {
            if (nlsKey.name === 'nls') {
                var $node = $('[nls="' + nlsDictionary + '.' + nlsKey.key + '"]');
                $node.text(newValue);
            } else {
                var $node = $('[nls="' + nlsDictionary + '.' + nlsKey.key.substring(0, nlsKey.key.lastIndexOf('.')) + '"]');
                $node.attr(nlsKey.name, newValue);
            }
            if (index + 1 < nlsKeys.length) {
                saveTranslations(nlsKeys, nlsDictionary, ++index, form);
            } else {
                nlsDialog.destroy();
                nlsDialog = null;
            }
        },
        failure: function (err) {
            window.console.error('Failed to update resource for key "' + nlsKey.key + '": ' + err);
            nlsDialog.destroy();
            nlsDialog = null;
        }
    });
}

function createDialog(nlsDictionary, nlsKeys) {
    var currentSettings = $.extend(true, {}, DIALOG_SETTINGS);
    currentSettings.items.title = 'Translation';
    var existingNlsKeys = [];

    for (var i = 0; i < nlsKeys.length; i++) {
        var nlsKey = nlsKeys[i];

        if (basicLanguageStrings[nlsDictionary][nlsKey.key]) {
            existingNlsKeys.push(nlsKey);

            var propertyNameField = $.extend(true, {}, FIELD_PROPERTY_NAME);
            propertyNameField.value = nlsDictionary + '.' + nlsKey.key;
            currentSettings.items.items.push(propertyNameField);

            var fieldDescriptionField = $.extend(true, {}, FIELD_DESCRIPTION);
            fieldDescriptionField.fieldLabel = 'Description' + '(' + nlsKey.label + ')';
            fieldDescriptionField.value = descriptions[nlsDictionary][nlsKey.key];
            currentSettings.items.items.push(fieldDescriptionField);

            var basicLanguageField = $.extend(true, {}, FIELD_BASIC_LANGUAGE);
            basicLanguageField.fieldLabel = currentLangId + '(' + nlsKey.label + ')';
            basicLanguageField.value = basicLanguageStrings[nlsDictionary][nlsKey.key];
            currentSettings.items.items.push(basicLanguageField);

            var translationField = $.extend(true, {}, FIELD_TRANSLATION);
            translationField.fieldLabel = langCode + '(' + nlsKey.label + ')';
            translationField.value = nlsKey.currentValue;
            translationField.name = nlsKey.name;
            currentSettings.items.items.push(translationField);
        }
    }
    currentSettings.buttons[0].handler = saveButtonHandler;
    currentSettings.buttons[1].handler = function() {
        this.destroy();
        nlsDialog = null;
    };

    var dialog = new CQ.Dialog(currentSettings);
    dialog.nlsProperties = {
         nlsDictionary: nlsDictionary,
         nlsKeys: existingNlsKeys
     };

    return dialog;
}

function openDialogAfterLoadingData(nlsDictionary, nlsKeys) {
    const lang = currentLangId + '_' + currentCountryId;
    const REQUEST_PROFILE = {
        method: 'GET',
        async: false,
        params: {}
    };

    if (!descriptions[nlsDictionary]) {
        REQUEST_PROFILE.params = {
                dictionary: nlsDictionary,
                lang: currentLangId
        };
        CQ.Ext.Ajax.request(Object.assign(REQUEST_PROFILE, {
            url: '/services/dhl/nls/resources/descriptions',
            success: function (response) {
                descriptions[nlsDictionary] = CQ.Ext.decode(response.responseText);
                openDialogAfterLoadingData(nlsDictionary, nlsKeys);
            },
            failure: function (err) {
                window.console.error('fail to load resource "' + lang + '" description: ' + err);
            }
        }));
    } else if (!basicLanguageStrings[nlsDictionary]) {
        REQUEST_PROFILE.params = {
                dictionary: nlsDictionary,
                languageCode: currentLangId,
                countryCode: currentCountryId
        };
        CQ.Ext.Ajax.request(Object.assign(REQUEST_PROFILE, {
            url: '/services/dhl/nls/resources/basic',
            success: function (response) {
                basicLanguageStrings[nlsDictionary] = CQ.Ext.decode(response.responseText);
                openDialogAfterLoadingData(nlsDictionary, nlsKeys);
            },
            failure: function (err) {
                window.console.error('fail to load resource "' + lang + '" basic: ' + err);
            }
        }));
    } else {
        nlsDialog = createDialog(nlsDictionary, nlsKeys);
        nlsDialog.show();
    }
}

function splitDictionaryKey(text) {
    return [text.substring(0, text.indexOf('.')), text.substring(text.indexOf('.') + 1)];
}

function buildNlsKey(nlsKeyProperty, name, currentValue, label) {
    return {
        key: nlsKeyProperty,
        name: name,
        currentValue: currentValue,
        label: label
    };
}

$(document).on('click', '[nls]', function () {
    if (!CQ.WCM.isEditMode()) {
        return;
    }
    if (nlsDialog != null) {
        return;
    }

    var nlsKeys = [];
    const splittedNlsProperty = splitDictionaryKey($(this).attr('nls'));
    const nlsDictionary = splittedNlsProperty[0];

    if ($(this).attr('nls')) {
        nlsKeys.push(buildNlsKey(splittedNlsProperty[1], 'nls', $(this).text(), 'text'));
    }
    const $this = $(this);
    nlsValidAttributes.forEach(function(attribute) {
        if ($this.attr(attribute)) {
            nlsKeys.push(buildNlsKey(splittedNlsProperty[1] + '.' + attribute, attribute, $this.attr(attribute), attribute));
        }
    });

    openDialogAfterLoadingData(nlsDictionary, nlsKeys);
});