/*global CQ*/
/*global $*/
CQ.Ext.onReady(function() {
    var dictComboBox = CQ.Ext.getCmp('i18n-path-combobox');
    var store = CQ.Ext.getCmp('i18n-path-combobox').ownerCt.ownerCt.ownerCt.items.get(1).
    items.get(0).items.get(0).store;

    if (dictComboBox) {
        var toolbar = CQ.Ext.getCmp('i18n-path-combobox').ownerCt;

        var versionStore = new CQ.Ext.data.JsonStore({
            url: '/services/dhl/i18nHistory',
            root: 'paths',
            restful: true,
            idProperty: 'path',
            autoSave: false,
            baseParams: {
                path: dictComboBox.value
            },
            writer: new CQ.Ext.data.JsonWriter({
                encode: true,
                listful: true,
                writeAllFields: true
            }),
            proxy: new CQ.Ext.data.HttpProxy({
                api: {
                    read: {
                        url: '/services/dhl/i18nHistory',
                        method: 'GET'
                    },
                    update: {
                        url: '/services/dhl/i18nHistory',
                        method: 'POST'
                    },
                    create: {
                        url: '/services/dhl/i18nHistory',
                        method: 'PUT'
                    },
                    destroy: {
                        url: '/services/dhl/i18nHistory',
                        method: 'DELETE'
                    }
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }),

            fields: ['path', 'name']

        });
        versionStore.on('beforeload', function() {
            versionStore.baseParams.path = dictComboBox.value;
        });


        function loadVersions() {
            var dictCombo = CQ.Ext.getCmp('i18n-path-combobox');
            var verCombo = CQ.Ext.getCmp('i18n-version-path');
            verCombo.reset();
            verCombo.store.removeAll();
            verCombo.store.baseParams.path = dictCombo.value;
            verCombo.store.load();
        }

        function versionSelected() {
            CQ.Ext.getCmp('versions-rollback').setDisabled(CQ.Ext.getCmp('i18n-version-path').value == null ||
                CQ.Ext.getCmp('i18n-version-path').value === '');
            CQ.Ext.getCmp('versions-delete').setDisabled(CQ.Ext.getCmp('i18n-version-path').value == null ||
                            CQ.Ext.getCmp('i18n-version-path').value === '');

        }

        function rollbackToVersion(path) {
            $.ajax({
                url: '/services/dhl/i18nHistory/rollback',
                type: 'POST',
                data: {
                    path: path
                },
                success: function() {
                    store.reload();
                },
                error: function() {
                    store.reload();
                }
            });
        }

        function deleteThisVersion() {
            var verCombo = CQ.Ext.getCmp('i18n-version-path');
            var rec = {
                path: verCombo.value
            };
            $.ajax({
                url: verCombo.store.proxy.api.destroy.url,
                type: verCombo.store.proxy.api.destroy.method,
                data: rec,
                success: function() {
                    verCombo.reset();
                    verCombo.store.reload();
                },
                error: function() {
                    CQ.Ext.Msg.alert('Failed to delete', 'Failed to delete version, try again later.');
                }
            });
        }

        var addVersionDialog = new CQ.Translator.VersionDialog({
            languages: CQ.Translator.languages,
            store: versionStore
        });

        var versionComboBox = CQ.Ext.create({
            id: 'i18n-version-path',
            xtype: 'combo',
            fieldLabel: 'I18n versions',
            width: 300,
            triggerAction: 'all',
            store: versionStore,
            valueField: 'path',
            displayField: 'path',
            queryMode: 'local',
            listeners: {
                select: function() {
                    versionSelected();
                }
            }
        });

        dictComboBox.on('select', function() {
            loadVersions();
        });

        var addVersionButton = CQ.Ext.create({
            xtype: 'button',
            text: 'New Version',
            id: 'versions-new',
            iconCls: 'add-icon',
            handler: function() {
                addVersionDialog.addVersion(CQ.Ext.getCmp('i18n-path-combobox').value);
            }
        });

        var rollbackButton = CQ.Ext.create({
            text: 'Rollback to this version',
            xtype: 'button',
            id: 'versions-rollback',
            iconCls: '',
            handler: function() {
                rollbackToVersion(CQ.Ext.getCmp('i18n-version-path').value);
            }
        });

        var deleteVersion = CQ.Ext.create({
            text: 'Delete this version',
            xtype: 'button',
            id: 'versions-delete',
            iconCls: '',
            handler: function() {
                deleteThisVersion();
            }
        });
        toolbar.insert(toolbar.items.length, versionComboBox);
        toolbar.insert(toolbar.items.length, addVersionButton);
        toolbar.insert(toolbar.items.length, rollbackButton);
        toolbar.insert(toolbar.items.length, deleteVersion);

        toolbar.render();
    }
});
