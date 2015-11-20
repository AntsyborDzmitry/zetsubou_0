PackagingDefaultsController.$inject = ['profileShipmentService'];

export default function PackagingDefaultsController(profileShipmentService) {
    const vm = this;

    const PACKAGE_TYPE = {
        DOCUMENT: 'DOCUMENT',
        PACKAGE: 'PACKAGE',
        BOTH: 'BOTH'
    };

    const emptyModel = {
        addToPieces: false,
        dhlShippingDocuments: [],
        dhlShippingPackages: [],
        distributeWeight: false,
        pallet: false,
        selectedShippingDocumentKey: null,
        selectedShippingPackageKey: null,
        shippingPackagesNumber: null
    };

    const documentByKey = (shippingDocument) => shippingDocument.key === vm.defaults.selectedShippingDocumentKey;
    const packageByKey = (shippingPackage) => shippingPackage.key === vm.defaults.selectedShippingPackageKey;
    const filterDocument = (item) => item.type === PACKAGE_TYPE.DOCUMENT || item.type === PACKAGE_TYPE.BOTH;
    const filterPackage = (item) => item.type === PACKAGE_TYPE.PACKAGE || item.type === PACKAGE_TYPE.BOTH;

    let isEditModeFlag = false;
    let defaultsBackup = null;

    let cachedGridData = null;
    let cachedAvailableDocuments = [];
    let cachedAvailablePackages = [];

    Object.assign(vm, {
        init,

        isEditMode,
        setEditMode,

        isViewMode,

        applyChanges,
        cancelChanges,

        defaults: angular.copy(emptyModel),

        getSelectedDocumentName,
        getSelectedPackageName,

        mapOptionKey,

        getAvailableDocuments,
        getAvailablePackages
    });

    function init() {
        profileShipmentService.getPackagesData()
            .then(applyData);
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
            profileShipmentService.updatePackagesData(vm.defaults)
                .then(applyData)
                .then(setViewMode);
        }
    }

    function cancelChanges() {
        applyData(defaultsBackup);

        setViewMode();
    }

    function mapUserData(gridData) {
        return gridData.map((item) => ({
            key: item.key,
            name: item.nickName,
            type: item.packagingType
        }));
    }

    function cacheData(gridData) {
        if (angular.equals(gridData, cachedGridData)) {
            return;
        }

        cachedGridData = angular.copy(gridData);

        const userData = mapUserData(cachedGridData);
        const userDocuments = userData.filter(filterDocument);
        const userPackages = userData.filter(filterPackage);

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
        const selectedDocument = getAvailableDocuments(gridData).find(documentByKey);

        return selectedDocument && selectedDocument.name;
    }

    function getSelectedPackageName(gridData) {
        const selectedPackage = getAvailablePackages(gridData).find(packageByKey);

        return selectedPackage && selectedPackage.name;
    }
}
