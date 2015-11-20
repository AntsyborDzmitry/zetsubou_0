define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = PackagingDefaultsController;
    PackagingDefaultsController.$inject = ['profileShipmentService'];

    function PackagingDefaultsController(profileShipmentService) {
        var vm = this;

        var PACKAGE_TYPE = {
            DOCUMENT: 'DOCUMENT',
            PACKAGE: 'PACKAGE',
            BOTH: 'BOTH'
        };

        var emptyModel = {
            addToPieces: false,
            dhlShippingDocuments: [],
            dhlShippingPackages: [],
            distributeWeight: false,
            pallet: false,
            selectedShippingDocumentKey: null,
            selectedShippingPackageKey: null,
            shippingPackagesNumber: null
        };

        var documentByKey = function documentByKey(shippingDocument) {
            return shippingDocument.key === vm.defaults.selectedShippingDocumentKey;
        };
        var packageByKey = function packageByKey(shippingPackage) {
            return shippingPackage.key === vm.defaults.selectedShippingPackageKey;
        };
        var filterDocument = function filterDocument(item) {
            return item.type === PACKAGE_TYPE.DOCUMENT || item.type === PACKAGE_TYPE.BOTH;
        };
        var filterPackage = function filterPackage(item) {
            return item.type === PACKAGE_TYPE.PACKAGE || item.type === PACKAGE_TYPE.BOTH;
        };

        var isEditModeFlag = false;
        var defaultsBackup = null;

        var cachedGridData = null;
        var cachedAvailableDocuments = [];
        var cachedAvailablePackages = [];

        Object.assign(vm, {
            init: init,

            isEditMode: isEditMode,
            setEditMode: setEditMode,

            isViewMode: isViewMode,

            applyChanges: applyChanges,
            cancelChanges: cancelChanges,

            defaults: angular.copy(emptyModel),

            getSelectedDocumentName: getSelectedDocumentName,
            getSelectedPackageName: getSelectedPackageName,

            mapOptionKey: mapOptionKey,

            getAvailableDocuments: getAvailableDocuments,
            getAvailablePackages: getAvailablePackages
        });

        function init() {
            profileShipmentService.getPackagesData().then(applyData);
        }

        function applyData(data) {
            vm.defaults = data;

            cachedGridData = null;
        }

        function isEditMode() {
            return isEditModeFlag;
        }

        function setEditMode() {
            defaultsBackup = angular.copy(vm.defaults);

            isEditModeFlag = true;
        }

        function isViewMode() {
            return !isEditModeFlag;
        }

        function setViewMode() {
            isEditModeFlag = false;
        }

        function mapOptionKey(option) {
            if (option) {
                if (angular.isObject(option) && option.key !== undefined) {
                    return option.key;
                }

                return option;
            }

            return null;
        }

        function applyChanges(packagingDefaultsForm, ewfFormCtrl) {
            ewfFormCtrl.ewfValidation();

            if (packagingDefaultsForm.$valid) {
                profileShipmentService.updatePackagesData(vm.defaults).then(applyData).then(setViewMode);
            }
        }

        function cancelChanges() {
            applyData(defaultsBackup);

            setViewMode();
        }

        function mapUserData(gridData) {
            return gridData.map(function (item) {
                return {
                    key: item.key,
                    name: item.nickName,
                    type: item.packagingType
                };
            });
        }

        function cacheData(gridData) {
            if (angular.equals(gridData, cachedGridData)) {
                return;
            }

            cachedGridData = angular.copy(gridData);

            var userData = mapUserData(cachedGridData);
            var userDocuments = userData.filter(filterDocument);
            var userPackages = userData.filter(filterPackage);

            cachedAvailableDocuments = vm.defaults.dhlShippingDocuments.concat(userDocuments);
            cachedAvailablePackages = vm.defaults.dhlShippingPackages.concat(userPackages);
        }

        function getAvailableDocuments(gridData) {
            cacheData(gridData);

            return cachedAvailableDocuments;
        }

        function getAvailablePackages(gridData) {
            cacheData(gridData);

            return cachedAvailablePackages;
        }

        function getSelectedDocumentName(gridData) {
            var selectedDocument = getAvailableDocuments(gridData).find(documentByKey);

            return selectedDocument && selectedDocument.name;
        }

        function getSelectedPackageName(gridData) {
            var selectedPackage = getAvailablePackages(gridData).find(packageByKey);

            return selectedPackage && selectedPackage.name;
        }
    }
});
//# sourceMappingURL=packaging-defaults-controller.js.map
