define(['exports', 'module', './../../services/ewf-crud-service', './packaging-measures-service', 'angular'], function (exports, module, _servicesEwfCrudService, _packagingMeasuresService, _angular) {
    'use strict';

    module.exports = PackagingSettingsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    PackagingSettingsController.$inject = ['ewfCrudService', 'packagingMeasuresService'];

    function PackagingSettingsController(ewfCrudService, packagingMeasuresService) {
        var vm = this;
        var LIST_URL = '/api/myprofile/packaging/list';
        var PACKAGE_TYPE = {
            DOCUMENT: 'DOCUMENT',
            PACKAGE: 'PACKAGE',
            BOTH: 'BOTH'
        };
        var columnsToDisplay = [{
            alias: 'nickName',
            title: 'package-settings.nick_name'
        }, {
            alias: 'pieceReference',
            title: 'package-settings.piece_references'
        }, {
            alias: 'defaultDimensions',
            title: 'package-settings.default_dimensions'
        }, {
            alias: 'defaultWeight',
            title: 'package-settings.default_weight'
        }];
        var emptySinglePackage = {
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
            init: init,
            onSort: onSort,
            showDialog: showDialog,
            closeDialog: closeDialog,
            saveOrUpdate: saveOrUpdate,
            showAddDialog: showAddDialog,
            editAction: editAction,
            duplicatedNicknamesReset: duplicatedNicknamesReset,

            isEditing: false,
            nickNameDuplicated: false,
            showEditPopup: false,
            singlePackage: deepCopyOfPackage(emptySinglePackage),

            gridData: [],
            packageList: [],
            packageListUnmodified: [],
            gridActionStatus: {},
            notificationData: '',
            columnsToDisplay: columnsToDisplay,

            mapOptionKey: mapOptionKey,

            weightUnits: packagingMeasuresService.getWeightUnits,
            dimensionUnits: packagingMeasuresService.getDimensionUnits,

            onChangeWeightUnit: onChangeWeightUnit,
            onChangeDimensionUnit: onChangeDimensionUnit
        });

        function init() {
            vm.gridCtrl.editCallback = editAction;
            ewfCrudService.getElementList(LIST_URL).then(function (customPackages) {
                vm.packageList = customPackages;

                vm.packageList.forEach(function (singlePackage) {
                    var packageDetails = createConvertedToGridFormObject(singlePackage);

                    vm.gridData.push(packageDetails);
                });

                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
        }

        function createConvertedToGridFormObject(singlePackage) {
            var packageDetails = deepCopyOfPackage(singlePackage);

            return convertToGridForm(packageDetails);
        }

        function convertToGridForm(packageDetails) {
            var weightUnitName = packagingMeasuresService.getUnitInfo(packageDetails.defaultWeight.unit).title;
            var dimensionUnitName = packagingMeasuresService.getUnitInfo(packageDetails.defaultDimensions.unit).title;

            packageDetails.packageVolume = packageDetails.defaultDimensions.length * packageDetails.defaultDimensions.width * packageDetails.defaultDimensions.height;

            packageDetails.defaultWeight = packageDetails.defaultWeight.value + ' ' + weightUnitName;

            packageDetails.defaultDimensions = packageDetails.defaultDimensions.length + ' ' + dimensionUnitName + ' ' + ('X ' + packageDetails.defaultDimensions.width + ' ' + dimensionUnitName + ' ') + ('X ' + packageDetails.defaultDimensions.height + ' ' + dimensionUnitName);

            return packageDetails;
        }

        function saveOrUpdate(packageDetailsForm, ewfFormCtrl) {
            ewfFormCtrl.ewfValidation();

            if (packageDetailsForm.$valid && (vm.singlePackage.isDocuments || vm.singlePackage.isPackages)) {
                if (vm.singlePackage.isDocuments && vm.singlePackage.isPackages) {
                    vm.singlePackage.packagingType = PACKAGE_TYPE.BOTH;
                } else {
                    vm.singlePackage.packagingType = vm.singlePackage.isDocuments ? PACKAGE_TYPE.DOCUMENT : PACKAGE_TYPE.PACKAGE;
                }

                return vm.singlePackage.key ? updateSinglePackage(vm.singlePackage) : addSinglePackage(vm.singlePackage);
            }
        }

        function addSinglePackage(singlePackage) {
            return ewfCrudService.addElement('/api/myprofile/packaging/add', singlePackage).then(function (response) {
                vm.packageList.push(response);

                vm.gridData.push(createConvertedToGridFormObject(response));
                vm.gridCtrl.rebuildGrid(vm.gridData);
                vm.gridCtrl.broadcastActionReport('created', response);

                vm.singlePackage = deepCopyOfPackage(emptySinglePackage);

                closeDialog();
            })['catch'](function (error) {
                if (error.status === 422) {
                    vm.nickNameDuplicated = true;
                }
            });
        }

        function updateSinglePackage(singlePackage) {
            return ewfCrudService.updateElement('/api/myprofile/packaging/modify', singlePackage).then(function (response) {
                var packageListElement = vm.packageList.find(function (currentPackage) {
                    return currentPackage.key === singlePackage.key;
                });

                copyPackageProperties(packageListElement, response);

                var packageToUpdate = vm.gridData.find(function (currentPackage) {
                    return currentPackage.key === singlePackage.key;
                });
                var updatedGridElement = convertToGridForm(response);

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
            vm.singlePackage = deepCopyOfPackage(vm.packageList.find(function (singlePackage) {
                return singlePackage.key === key;
            }));

            vm.singlePackage.isDocuments = vm.singlePackage.packagingType === PACKAGE_TYPE.DOCUMENT || vm.singlePackage.packagingType === PACKAGE_TYPE.BOTH;

            vm.singlePackage.isPackages = vm.singlePackage.packagingType === PACKAGE_TYPE.PACKAGE || vm.singlePackage.packagingType === PACKAGE_TYPE.BOTH;

            showDialog();
        }

        function deepCopyOfPackage(singlePackage) {
            return _angular2['default'].copy(singlePackage);
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
            var newUnit = vm.singlePackage.defaultWeight.unit;

            vm.singlePackage.defaultWeight.value = packagingMeasuresService.convertValue(oldUnit, newUnit, vm.singlePackage.defaultWeight.value);

            if (skipDimensions) {
                return;
            }

            var oldSystem = packagingMeasuresService.getUnitInfo(oldUnit).system;
            var newSystem = packagingMeasuresService.getUnitInfo(newUnit).system;

            if (oldSystem === newSystem) {
                return;
            }

            var oldDimensionUnit = vm.singlePackage.defaultDimensions.unit;
            vm.singlePackage.defaultDimensions.unit = packagingMeasuresService.getDimensionUnits().find(function (unit) {
                return unit.system === newSystem;
            }).key;

            onChangeDimensionUnit(oldDimensionUnit, true);
        }

        function onChangeDimensionUnit(oldUnit, skipWeight) {
            var newUnit = vm.singlePackage.defaultDimensions.unit;

            vm.singlePackage.defaultDimensions.length = packagingMeasuresService.convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.length);

            vm.singlePackage.defaultDimensions.width = packagingMeasuresService.convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.width);

            vm.singlePackage.defaultDimensions.height = packagingMeasuresService.convertValue(oldUnit, newUnit, vm.singlePackage.defaultDimensions.height);

            if (skipWeight) {
                return;
            }

            var oldSystem = packagingMeasuresService.getUnitInfo(oldUnit).system;
            var newSystem = packagingMeasuresService.getUnitInfo(newUnit).system;

            if (oldSystem === newSystem) {
                return;
            }

            var oldWeightUnit = vm.singlePackage.defaultWeight.unit;
            vm.singlePackage.defaultWeight.unit = packagingMeasuresService.getWeightUnits().find(function (unit) {
                return unit.system === newSystem;
            }).key;

            onChangeWeightUnit(oldWeightUnit, true);
        }

        function mapOptionKey(option) {
            if (_angular2['default'].isObject(option) && option.key !== undefined) {
                return option.key;
            }

            return option;
        }
    }
});
//# sourceMappingURL=packaging-settings-controller.js.map
