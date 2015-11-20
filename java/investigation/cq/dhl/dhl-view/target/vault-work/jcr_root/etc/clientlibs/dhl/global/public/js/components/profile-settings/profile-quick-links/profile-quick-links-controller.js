define(['exports', 'module', './profile-edit-quick-link-dialog-service', './../profile-settings-service', './../../../services/ewf-crud-service', './../../../constants/system-settings-constants', './../../../services/ewf-spinner-service'], function (exports, module, _profileEditQuickLinkDialogService, _profileSettingsService, _servicesEwfCrudService, _constantsSystemSettingsConstants, _servicesEwfSpinnerService) {
    'use strict';

    module.exports = ProfileQuickLinksController;

    ProfileQuickLinksController.$inject = ['$timeout', '$sce', 'ewfCrudService', 'profileEditQuickLinkDialogService', 'profileSettingsService', 'systemSettings', 'ewfSpinnerService'];

    function ProfileQuickLinksController($timeout, $sce, ewfCrudService, profileEditQuickLinkDialogService, profileSettingsService, systemSettings, ewfSpinnerService) {
        var vm = this;
        var addUrl = '/api/myprofile/links/add';

        Object.assign(vm, {
            alertTypes: {
                added: false,
                updated: false,
                deleted: false
            },
            columnsToDisplay: [{ alias: 'name', title: 'quick-links.name_column' }, { alias: 'link', title: 'quick-links.url_column' }],
            quickLinkUrl: '',
            quickLinkName: '',
            gridData: undefined,

            init: init,
            addQuickLink: addQuickLink,
            editQuickLink: editQuickLink,
            getLinkHtml: getLinkHtml,
            rebuildGrid: rebuildGrid,
            toggleNotificationAlert: toggleNotificationAlert,
            updateQuickLink: updateQuickLink,
            updateLinkHtml: updateLinkHtml
        });

        function init() {
            vm.gridCtrl.editCallback = editQuickLink;
            rebuildGrid();
        }

        function rebuildGrid() {
            var promise = profileSettingsService.getQuickLinks().then(function (data) {
                var parsedData = data.map(function (item) {
                    item.link = getLinkHtml(item.url);
                    return item;
                });
                vm.gridCtrl.rebuildGrid(parsedData);
            });
            return ewfSpinnerService.applySpinner(promise);
        }

        function toggleNotificationAlert(action) {
            vm.alertTypes[action] = true;
            $timeout(function () {
                vm.alertTypes[action] = false;
            }, systemSettings.showInformationHintTimeout);
        }

        function addQuickLink(ngform, ewfForm) {
            var isFormValid = ngform.$valid && vm.quickLinkName !== '' && vm.quickLinkUrl !== '';
            if (isFormValid) {
                var quickLink = {
                    name: vm.quickLinkName,
                    url: vm.quickLinkUrl
                };
                ewfCrudService.addElement(addUrl, quickLink).then(function () {
                    vm.toggleNotificationAlert('added');
                    vm.rebuildGrid();
                })['catch'](function () {
                    ewfForm.ewfValidation();
                });
            }
        }

        function updateQuickLink(linkInfo) {
            vm.updateLinkHtml(linkInfo);
            vm.gridCtrl.updateElement(linkInfo).then(function () {
                vm.toggleNotificationAlert('updated');
            });
        }

        function editQuickLink(key) {
            var quickLink = vm.gridData.find(function (elem) {
                return elem.key === key;
            });
            profileEditQuickLinkDialogService.showSaveDialog(quickLink.name, quickLink.url).then(function (linkInfo) {
                linkInfo.key = key;
                vm.updateQuickLink(linkInfo);
            });
        }

        function getLinkHtml(string) {
            return $sce.trustAsHtml('<a href="' + string + '" target="_blank">' + string + '</a>');
        }

        function updateLinkHtml(linkInfo) {
            var findByKey = function findByKey(el) {
                return el.key === linkInfo.key;
            };
            var quickLink = vm.gridCtrl.attributes.gridData.find(findByKey);
            quickLink.link = getLinkHtml(linkInfo.url);
        }
    }
});
//# sourceMappingURL=profile-quick-links-controller.js.map
