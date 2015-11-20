import './../../services/ewf-crud-service';
import './packaging-measures-service';
import angular from 'angular';

PackagingSettingsController.$inject = ['ewfCrudService', 'packagingMeasuresService'];

export default function PackagingSettingsController(ewfCrudService, packagingMeasuresService) {
    const vm = this;
    const LIST_URL = '/api/myprofile/packaging/list';
    const PACKAGE_TYPE = {
        DOCUMENT: 'DOCUMENT',
        PACKAGE: 'PACKAGE',
        BOTH: 'BOTH'
    };
    const columnsToDisplay = [
        {
            alias: 'nickName',
            title: 'package-settings.nick_name'
        },
        {
            alias: 'pieceReference',
            title: 'package-settings.piece_references'
        },
        {
            alias: 'defaultDimensions',
            title: 'package-settings.default_dimensions'
        },
        {
            alias: 'defaultWeight',
            title: 'package-settings.default_weight'
        }
    ];
    const emptySinglePackage = {
        key: '',
        nickName: '',
        isDocuments: true,
        isPackages: false,
        packagingType: PACKAGE_TYPE.DOCUMENT,
        pieceReference: '',
        defaultWeight: {
            unit: packagingMeasuresService.getDefaultWeightUnit().key,
            value: ''
        },
        defaultDimensions: {
            unit: packagingMeasuresService.getDefaultDimensionUnit().key,
            height: '',
            width: '',
            length: ''
        },
        isPallet: false
    };

    Object.assign(vm, {
        init,
        onSort,
        showDialog,
        closeDialog,
        saveOrUpdate,
        showAddDialog,
        editAction,
        duplicatedNicknamesReset,

        isEditing: false,
        nickNameDuplicated: false,
        showEditPopup: false,
        singlePackage: deepCopyOfPackage(emptySinglePackage),

        gridData: [],
        packageList: [],
        packageListUnmodified: [],
        gridActionStatus: {},
        notificationData: '',
        columnsToDisplay,

        mapOptionKey,

        weightUnits: packagingMeasuresService.getWeightUnits,
        dimensionUnits: packagingMeasuresService.getDimensionUnits,

        onChangeWeightUnit,
        onChangeDimensionUnit
    });

    function init() {
        vm.gridCtrl.editCallback = editAction;
        ewfCrudService.getElementList(LIST_URL)
            .then((customPackages) => {
                vm.packageList = customPackages;

                vm.packageList.forEach((singlePackage) => {
                    const packageDetails = createConvertedToGridFormObject(singlePackage);

                    vm.gridData.push(packageDetails);
                });

                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
    }

    function createConvertedToGridFormObject(singlePackage) {
        let packageDetails = deepCopyOfPackage(singlePackage);

        return convertToGridForm(packageDetails);
    }

    function convertToGridForm(packageDetails) {
        const weightUnitName = packagingMeasuresService.getUnitInfo(packageDetails.defaultWeight.unit).title;
        const dimensionUnitName = packagingMeasuresService.getUnitInfo(packageDetails.defaultDimensions.unit).title;

        packageDetails.packageVolume =
            packageDetails.defaultDimensions.length *
            packageDetails.defaultDimensions.width *
            packageDetails.defaultDimensions.height;

        packageDetails.defaultWeight =
            `${packageDetails.defaultWeight.value} ${weightUnitName}`;

        packageDetails.defaultDimensions =
            `${packageDetails.defaultDimensions.length} ${dimensionUnitName} ` +
            `X ${packageDetails.defaultDimensions.width} ${dimensionUnitName} ` +
            `X ${packageDetails.defaultDimensions.height} ${dimensionUnitName}`;

        return packageDetails;
    }

    function saveOrUpdate(packageDetailsForm, ewfFormCtrl) {
        ewfFormCtrl.ewfValidation();

        if (packageDetailsForm.$valid && (vm.singlePackage.isDocuments || vm.singlePackage.isPackages)) {
            if (vm.singlePackage.isDocuments && vm.singlePackage.isPackages) {
                vm.singlePackage.packagingType = PACKAGE_TYPE.BOTH;
            } else {
                vm.singlePackage.packagingType = vm.singlePackage.isDocuments
                    ? PACKAGE_TYPE.DOCUMENT
                    : PACKAGE_TYPE.PACKAGE;
            }

            return vm.singlePackage.key
                ? updateSinglePackage(vm.singlePackage)
                : addSinglePackage(vm.singlePackage);
        }
    }

    function addSinglePackage(singlePackage) {
        return ewfCrudService.addElement('/api/myprofile/packaging/add', singlePackage)
            .then((response) => {
                vm.packageList.push(response);

                vm.gridData.push(createConvertedToGridFormObject(response));
                vm.gridCtrl.rebuildGrid(vm.gridData);
                vm.gridCtrl.broadcastActionReport('created', response);

                vm.singlePackage = deepCopyOfPackage(emptySinglePackage);

                closeDialog();
            })
            .catch((error) => {
                if (error.status === 422) {
                    vm.nickNameDuplicated = true;
                }
            });
    }

    function updateSinglePackage(singlePackage) {
        return ewfCrudService.updateElement('/api/myprofile/packaging/modify', singlePackage)
            .then((response) => {
                const packageListElement = vm.packageList
                    .find((currentPackage) => currentPackage.key === singlePackage.key);

                copyPackageProperties(packageListElement, response);

                const packageToUpdate = vm.gridData
                    .find((currentPackage) => currentPackage.key === singlePackage.key);
                const updatedGridElement = convertToGridForm(response);

                copyPackageProperties(packageToUpdate, updatedGridElement);

                vm.gridCtrl.rebuildGrid(vm.gridData);
                vm.gridCtrl.broadcastActionReport('updated', response);

                vm.singlePackage = deepCopyOfPackage(emptySinglePackage);

                closeDialog();
            });
    }

    function showDialog() {
        vm.showEditPopup = true;
    }

    function showAddDialog() {
        vm.singlePackage = deepCopyOfPackage(emptySinglePackage);

        showDialog();
    }

    function closeDialog() {
        vm.showEditPopup = false;
        vm.nickNameDuplicated = false;
    }

    function editAction(key) {
        vm.singlePackage = deepCopyOfPackage(vm.packageList.find((singlePackage) => singlePackage.key === key));

        vm.singlePackage.isDocuments = vm.singlePackage.packagingType === PACKAGE_TYPE.DOCUMENT
            || vm.singlePackage.packagingType === PACKAGE_TYPE.BOTH;

        vm.singlePackage.isPackages = vm.singlePackage.packagingType === PACKAGE_TYPE.PACKAGE
            || vm.singlePackage.packagingType === PACKAGE_TYPE.BOTH;

        showDialog();
    }

    function deepCopyOfPackage(singlePackage) {
        return angular.copy(singlePackage);
    }

    function copyPackageProperties(to, from) {
        Object.assign(to, from);
    }

    function duplicatedNicknamesReset() {
        vm.nickNameDuplicated = false;
    }

    function onSort(column, rowA, rowB) {
        if (column === 'defaultDimensions') {
            return rowA.packageVolume < rowB.packageVolume;
        }
    }

    function onChangeWeightUnit(oldUnit, skipDimensions) {
        const newUnit = vm.singlePackage.defaultWeight.unit;

        vm.singlePackage.defaultWeight.value = packagingMeasuresService
            .convertValue(oldUnit, newUnit, vm.singlePackage.defaultWeight.value);

        if (skipDimensions) {
            return;
        }

        const oldSystem = packagingMeasuresService.getUnitInfo(oldUnit).system;
        const newSystem = packagingMeasuresService.getUnitInfo(newUnit).system;

        if (oldSystem === newSystem) {
            return;
        }

        const oldDimensionUnit = vm.singlePackage.defaultDimensions.unit;
        vm.singlePackage.defaultDimensions.unit = packagingMeasuresService.getDimensionUnits()
            .find((unit) => unit.system === newSystem).key;

        onChangeDimensionUnit(oldDimensionUnit, true);
    }

    function onChangeDimensionUnit(oldUnit, skipWeight) {
        const newUnit = vm.singlePackage.defaultDimensions.unit;

        vm.singlePackage.defaultDimensions.length = packagingMeasuresService
            .convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.length);

        vm.singlePackage.defaultDimensions.width = packagingMeasuresService
            .convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.width);

        vm.singlePackage.defaultDimensions.height = packagingMeasuresService
            .convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.height);

        if (skipWeight) {
            return;
        }

        const oldSystem = packagingMeasuresService.getUnitInfo(oldUnit).system;
        const newSystem = packagingMeasuresService.getUnitInfo(newUnit).system;

        if (oldSystem === newSystem) {
            return;
        }

        const oldWeightUnit = vm.singlePackage.defaultWeight.unit;
        vm.singlePackage.defaultWeight.unit = packagingMeasuresService.getWeightUnits()
            .find((unit) => unit.system === newSystem).key;

        onChangeWeightUnit(oldWeightUnit, true);
    }

    function mapOptionKey(option) {
        if (angular.isObject(option) && option.key !== undefined) {
            return option.key;
        }

        return option;
    }
}
