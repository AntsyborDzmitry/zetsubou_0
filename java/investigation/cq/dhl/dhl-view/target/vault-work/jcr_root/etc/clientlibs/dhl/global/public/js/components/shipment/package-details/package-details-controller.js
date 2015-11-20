define(['exports', 'module', '../../../directives/ewf-input/ewf-input-directive', '../../../directives/ewf-validate/ewf-validate-pattern-directive', '../../../services/user-service', '../../../services/confirmation/confirmation-dialog-service', '../../shipment/ewf-shipment-service', './package-details-service', './../../shipment/ewf-shipment-step-base-controller', 'angular'], function (exports, module, _directivesEwfInputEwfInputDirective, _directivesEwfValidateEwfValidatePatternDirective, _servicesUserService, _servicesConfirmationConfirmationDialogService, _shipmentEwfShipmentService, _packageDetailsService, _shipmentEwfShipmentStepBaseController, _angular) {
    'use strict';

    module.exports = PackageDetailsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _EwfShipmentStepBaseController = _interopRequireDefault(_shipmentEwfShipmentStepBaseController);

    var _angular2 = _interopRequireDefault(_angular);

    PackageDetailsController.$inject = ['$timeout', '$filter', 'nlsService', 'userService', 'navigationService', 'packageDetailsService', 'shipmentService', 'confirmationDialogService'];

    PackageDetailsController.prototype = new _EwfShipmentStepBaseController['default']('package-details');

    function PackageDetailsController($timeout, $filter, nlsService, userService, navigationService, packageDetailsService, shipmentService, confirmationDialogService) {
        var vm = this;
        var uomConverter = undefined;
        var rowId = 0;
        var isSavingCustomPackaging = false;
        var confirmationSaveMessage = undefined;
        var fixedWeightMsg = '';
        var shipperCountrySom = undefined,
            weightConvertionRate = undefined;
        var MAX_TOTAL_QUANTITY = 999;
        var isShipmentLoaded = false;

        Object.assign(vm, {
            PACKAGING_TYPES: {
                DHL: 'DHL',
                CUSTOM: 'CUSTOM',
                USER_PROFILE: 'USER_PROFILE'
            },
            UNITS: {
                METRIC: 'METRIC',
                IMPERIAL: 'IMPERIAL'
            },
            PATTERNS: {
                quantity: '(^[1-9][0-9]*$)|(?:^$)',
                dimension: '^(([1-9]+\\d*)|(\\d+\\.\\d+))$|^$'
            },
            formErrors: [],
            packagingList: [],
            packagesRows: [],
            totalWeight: 0,
            totalQuantity: 0,
            maxTotalWeight: 0,
            maxTotalQuantity: MAX_TOTAL_QUANTITY,
            uomKeys: {
                dimensions: {
                    METRIC: 'shipment.package_details_cm',
                    IMPERIAL: 'shipment.package_details_in'
                },
                weight: {
                    METRIC: 'shipment.package_details_kg',
                    IMPERIAL: 'shipment.package_details_lb'
                }
            },
            generator: {
                weight: '',
                piecesAmount: ''
            },

            onInit: onInit,
            onEdit: onEdit,
            addAnotherPackage: addAnotherPackage,
            deletePackageRow: deletePackageRow,
            pickPackage: pickPackage,
            hideRowPackagingList: hideRowPackagingList,
            copyPackageRow: copyPackageRow,
            isTotalWeightValid: isTotalWeightValid,
            isTotalQuantityValid: isTotalQuantityValid,
            isConvertedValuesVisible: isConvertedValuesVisible,
            onNextClick: onNextClick,
            getPackageIconUrl: getPackageIconUrl,
            onEditClick: onEditClick,
            onKnownDimensionsChange: onKnownDimensionsChange,
            saveCustomPackaging: saveCustomPackaging,
            handleSaveAction: handleSaveAction,
            updateSaveButtonState: updateSaveButtonState,
            triggerPackagingListVisibility: triggerPackagingListVisibility,
            filteringPackagingList: filteringPackagingList,
            generateRowsWithPredefinedWeight: generateRowsWithPredefinedWeight,
            generateFixedWeightMsg: generateFixedWeightMsg,
            showReadOnlyDimensions: showReadOnlyDimensions,
            calcGeneratorMaxWeight: calcGeneratorMaxWeight,
            calcGeneratorMaxPiecesAmount: calcGeneratorMaxPiecesAmount,
            isQuantityCorrectForCopy: isQuantityCorrectForCopy,
            getCurrentIncompleteData: getCurrentIncompleteData,
            loadShipmentData: loadShipmentData
        });

        function onInit() {
            vm.initialized = true;
            vm.isAuthorized = userService.isAuthorized();

            var countrySomParameters = shipmentService.getCountrySomParameters();
            shipperCountrySom = countrySomParameters.shipperCountrySom;
            vm.userProfileCountrySom = countrySomParameters.userProfileCountrySom || countrySomParameters.shipperCountrySom;

            weightConvertionRate = countrySomParameters.weightConvertionRate;
            vm.weightConvertionReverseRate = 1 / weightConvertionRate;
            vm.dimensionConvertionRate = countrySomParameters.dimensionConvertionRate;
            vm.dimensionConvertionReverseRate = 1 / vm.dimensionConvertionRate;

            vm.shipperCountryConversionPrecision = countrySomParameters.shipperCountryConversionPrecision;
            vm.userProfileCountryConversionPrecision = countrySomParameters.userProfileCountryConversionPrecision;

            vm.somAreDifferent = shipperCountrySom !== vm.userProfileCountrySom;
            uomConverter = $filter('convertUomToOpposite');
            setUomParams();

            if (isShipmentLoaded) {
                packageDetailsService.getPackagingDetails(vm.shipmentType, vm.shipmentCountry).then(function (packagingDetails) {
                    vm.packagingList = packagingDetails.packagingList;
                    generatePackagesForLoadedShipment();
                    translateCustomPackagingName();
                    isShipmentLoaded = false;
                });
            }
        }

        function generatePackagesForLoadedShipment() {
            var customPackagingMsg = nlsService.getTranslationSync('shipment.package_details_own_packaging_label');
            vm.packagesRows.forEach(function (row) {
                var packageForRow = vm.packagingList.find(function (item) {
                    return item.id && item.id === row.packageId;
                });

                if (packageForRow) {
                    packageForRow.weight = row.weight;
                    mapPackagingAttributes(row, packageForRow);
                    row.packagingName = packageForRow.name;
                } else {
                    mapPackagingAttributes(row, row);
                    row.packagingName = customPackagingMsg;
                }
            });
        }

        function setUomParams() {
            vm.userProfileWeightUomKey = vm.uomKeys.weight[vm.userProfileCountrySom];
            vm.userProfileDimensionsUomKey = vm.uomKeys.dimensions[vm.userProfileCountrySom];

            vm.shipperCountryWeightUomKey = vm.uomKeys.weight[shipperCountrySom];
            vm.shipperCountryDimensionsUomKey = vm.uomKeys.dimensions[shipperCountrySom];
        }

        function getPackagingDetails(shipmentType, shipmentCountry) {
            packageDetailsService.getPackagingDetails(shipmentType, shipmentCountry).then(onGetPackagingDetails);
        }

        function onGetPackagingDetails(response) {
            vm.packagingList = response.packagingList;
            vm.maxTotalWeight = getMaxTotalWeight(response.maxTotalWeight, response.maxTotalWeightSom);
            vm.maxTotalQuantity = response.maxTotalQuantity || MAX_TOTAL_QUANTITY;
            vm.packageGeneratorOn = response.packageGeneratorOn;
            generatePackagingRows(response.defaultPiecesAmount || 1);
            translateCustomPackagingName();
        }

        function translateCustomPackagingName() {
            var customPackaging = vm.packagingList.find(function (packaging) {
                return packaging.packageType === vm.PACKAGING_TYPES.CUSTOM;
            });
            if (customPackaging) {
                customPackaging.name = nlsService.getTranslationSync(customPackaging.name);
            }
        }

        function getMaxTotalWeight(maxTotalWeight, maxTotalWeightSom) {
            var total = maxTotalWeight;
            if (maxTotalWeightSom !== vm.userProfileCountrySom) {
                total = uomConverter(maxTotalWeight, weightConvertionRate, vm.userProfileCountryConversionPrecision);
            }
            return total;
        }

        function calcGeneratorMaxWeight() {
            return (vm.maxTotalWeight - vm.totalWeight) / (vm.generator.piecesAmount || 1);
        }

        function calcGeneratorMaxPiecesAmount() {
            return vm.maxTotalQuantity - vm.totalQuantity;
        }

        function generatePackagingRow() {
            return {
                rowId: ++rowId,
                isPackagesListVisible: false,
                isFilteredPackagingListNotEmpty: true,
                packageId: '',
                packagingName: '',
                packagingNameOriginal: '',
                ownPackage: true,
                quantity: 1,
                weight: '',
                weightOriginal: '',
                maxWeight: '',
                unit: '',
                reference: '',
                dimensionsEditable: true,
                packageType: vm.PACKAGING_TYPES.USER_PROFILE,
                width: '',
                height: '',
                length: ''
            };
        }

        function generatePackagingRows(piecesAmount) {
            var defaultPackaging = vm.packagingList.find(function (packaging) {
                return packaging.defaultPackaging;
            });
            while (vm.packagesRows.length < piecesAmount) {
                var row = generatePackagingRow();
                if (defaultPackaging) {
                    vm.pickPackage(row, defaultPackaging);
                }
                vm.packagesRows.push(row);
            }
        }

        function addAnotherPackage() {
            vm.packagesRows.push(generatePackagingRow());
        }

        function deletePackageRow(row) {
            var position = vm.packagesRows.indexOf(row);
            vm.packagesRows.splice(position, 1);
        }

        function copyPackageRow(row) {
            var copiedRow = _angular2['default'].copy(row);
            copiedRow.rowId = ++rowId;
            copiedRow.packagingName = '';
            vm.packagesRows.splice(vm.packagesRows.indexOf(row) + 1, 0, copiedRow);
        }

        function pickPackage(row, chosenPackage) {
            row.packageId = chosenPackage.id;
            row.packagingName = chosenPackage.name;
            row.packagingNameOriginal = chosenPackage.name;
            row.packageType = chosenPackage.packageType;
            row.maxQuantity = chosenPackage.maxQuantity;
            row.fixedWeight = chosenPackage.fixedWeight;
            row.dimensionsEditable = row.packageType === vm.PACKAGING_TYPES.USER_PROFILE;
            row.isPackagesListVisible = false;

            mapPackagingAttributes(row, chosenPackage);
        }

        function mapPackagingAttributes(row, chosenPackage) {
            if (chosenPackage.units !== vm.userProfileCountrySom && row.packageType !== vm.PACKAGING_TYPES.CUSTOM) {
                invokeAfterTimeout(function () {
                    row.weight = row.weightOriginal = uomConverter(chosenPackage.weight, weightConvertionRate, vm.userProfileCountryConversionPrecision);
                });
                row.maxWeight = chosenPackage.maxWeight ? uomConverter(chosenPackage.maxWeight, weightConvertionRate, vm.userProfileCountryConversionPrecision) : '';
                row.width = row.widthOriginal = uomConverter(chosenPackage.width, vm.dimensionConvertionRate, vm.userProfileCountryConversionPrecision);
                row.height = row.heightOriginal = uomConverter(chosenPackage.height, vm.dimensionConvertionRate, vm.userProfileCountryConversionPrecision);
                row.length = row.lengthOriginal = uomConverter(chosenPackage.length, vm.dimensionConvertionRate, vm.userProfileCountryConversionPrecision);
            } else {
                invokeAfterTimeout(function () {
                    row.weight = row.weightOriginal = chosenPackage.weight;
                });
                row.maxWeight = chosenPackage.maxWeight ? chosenPackage.maxWeight : '';
                row.width = row.widthOriginal = chosenPackage.width;
                row.height = row.heightOriginal = chosenPackage.height;
                row.length = row.lengthOriginal = chosenPackage.length;
            }
        }

        function invokeAfterTimeout(setter) {
            $timeout(setter);
        }

        function hideRowPackagingList(row) {
            row.isPackagesListVisible = false;
            if (row.packageType !== vm.PACKAGING_TYPES.USER_PROFILE && isPackagingNameChanged(row)) {
                convertRowToUserProfilePackagingType(row);
            }
            updateSaveButtonState(row);
        }

        function convertRowToUserProfilePackagingType(row) {
            row.packageType = vm.PACKAGING_TYPES.USER_PROFILE;
            row.dimensionsEditable = true;
            row.widthOriginal = row.width;
            row.width = '';
            row.heightOriginal = row.height;
            row.height = '';
            row.lengthOriginal = row.length;
            row.length = '';
        }

        function updateSaveButtonState(row) {
            row.isSaveButtonAvailable = !!row.packagingName && !isSavingCustomPackaging && row.packageType === vm.PACKAGING_TYPES.USER_PROFILE && (isPackagingNameChanged(row) || isPackagingDetailsChanged(row));
            if (row.isSaveButtonAvailable) {
                row.saved = false;
            }
        }

        function isPackagingDetailsChanged(row) {
            return row.weight !== row.weightOriginal || row.width !== row.widthOriginal || row.height !== row.heightOriginal || row.length !== row.lengthOriginal;
        }

        function isPackagingNameChanged(row) {
            return row.packagingName !== row.packagingNameOriginal;
        }

        function isTotalWeightValid() {
            return vm.maxTotalWeight === 0 || vm.totalWeight <= vm.maxTotalWeight;
        }

        function isTotalQuantityValid() {
            return vm.totalQuantity <= vm.maxTotalQuantity;
        }

        function isConvertedValuesVisible(row) {
            return vm.somAreDifferent && !!(row.width || row.height || row.length || row.weight);
        }

        function onNextClick(form, ewfFormCtrl) {
            if (form.$invalid && ewfFormCtrl.ewfValidation()) {
                return;
            }

            if (vm.packagesRows.length && vm.isTotalWeightValid() && vm.isTotalQuantityValid()) {
                setRowsData();
                shipmentService.setTotalWeight(vm.totalWeight, vm.userProfileWeightUomKey);
                vm.nextCallback();
            }
        }

        function getCurrentIncompleteData() {
            setRowsData();
        }

        function setRowsData() {
            var rows = _angular2['default'].copy(vm.packagesRows);
            rows.forEach(function (row) {
                row.unit = shipperCountrySom;
                if (vm.somAreDifferent) {
                    row.weight = uomConverter(row.weight, vm.weightConvertionReverseRate, vm.shipperCountryConversionPrecision);
                    if (row.knownDimensions || row.packageType !== vm.PACKAGING_TYPES.CUSTOM) {
                        row.width = uomConverter(row.width, vm.dimensionConvertionReverseRate, vm.shipperCountryConversionPrecision);
                        row.height = uomConverter(row.height, vm.dimensionConvertionReverseRate, vm.shipperCountryConversionPrecision);
                        row.length = uomConverter(row.length, vm.dimensionConvertionReverseRate, vm.shipperCountryConversionPrecision);
                    } else {
                        Object.assign(row, {
                            width: null,
                            height: null,
                            length: null
                        });
                    }
                }
            });
            shipmentService.setPackageDetails(rows);
        }

        function onEditClick() {
            vm.editCallback();
        }

        function triggerPackagingListVisibility(row) {
            row.isPackagesListVisible = !row.isPackagesListVisible;
        }

        // TODO: add packaging images to sprite
        function getPackageIconUrl(pkg) {
            var imgUrl = '';
            if (pkg.packageType === vm.PACKAGING_TYPES.DHL) {
                var origin = navigationService.getOriginFromUrl();
                imgUrl = origin + '/etc/clientlibs/dhl/global/public/img/packaging/' + pkg.id + '.png';
            }
            return imgUrl;
        }

        function onEdit() {
            vm.editModeActive = true;

            var shipmentDetailsChanged = false;
            var shipmentCountry = shipmentService.getShipmentCountry();
            var shipmentType = shipmentService.getShipmentType();

            shipmentDetailsChanged = vm.shipmentCountry !== shipmentCountry || vm.shipmentType !== shipmentType;
            vm.shipmentType = shipmentType;
            vm.shipmentCountry = shipmentCountry;

            if ((!vm.packagingList.length || shipmentDetailsChanged) && !isShipmentLoaded) {
                updatePackagingDetails();
            }
        }

        function updatePackagingDetails() {
            vm.packagesRows = [];
            getPackagingDetails(vm.shipmentType, vm.shipmentCountry);
        }

        function onKnownDimensionsChange(row) {
            row.dimensionsEditable = row.knownDimensions;
            if (row.knownDimensions) {
                row.width = '';
                row.height = '';
                row.length = '';
            } else {
                row.width = null;
                row.height = null;
                row.length = null;
            }
        }

        function handleSaveAction(row, form, ewfFormCtrl) {
            confirmationSaveMessage = confirmationSaveMessage || nlsService.getTranslationSync('shipment.package_details_save_confirmation_message');
            if (isSavingCustomPackaging || form.$invalid && ewfFormCtrl.ewfValidation()) {
                return;
            }

            var existingPackagingIndex = getExistingPackagingIndex(row.packagingName);
            if (existingPackagingIndex >= 0) {
                confirmationDialogService.showConfirmationDialog(confirmationSaveMessage).then(function () {
                    vm.packagingList.splice(existingPackagingIndex, 1);
                    vm.saveCustomPackaging(row);
                });
            } else {
                vm.saveCustomPackaging(row);
            }
        }

        function saveCustomPackaging(row) {
            var customPackaging = {
                name: row.packagingName,
                shipmentType: vm.shipmentType,
                width: row.width,
                height: row.height,
                length: row.length,
                weight: row.weight,
                units: vm.userProfileCountrySom,
                packageType: vm.PACKAGING_TYPES.USER_PROFILE
            };

            isSavingCustomPackaging = true;
            row.saved = true;

            packageDetailsService.saveCustomPackaging(customPackaging).then(function (id) {
                customPackaging.id = id;
                vm.packagingList.splice(1, 0, customPackaging);
                vm.pickPackage(row, customPackaging);
                isSavingCustomPackaging = false;
            });
            row.isSaveButtonAvailable = false;
        }

        function getExistingPackagingIndex(packagingName) {
            return vm.packagingList.findIndex(function (packaging) {
                return packaging.name === packagingName;
            });
        }

        function filteringPackagingList(row) {
            row.isFilteredPackagingListNotEmpty = vm.packagingList.some(function (item) {
                return item.name.includes(row.packagingName);
            });
        }

        function generateRowsWithPredefinedWeight(form, ewfFormCtrl) {
            if (form.$invalid && ewfFormCtrl.ewfValidation()) {
                return;
            }

            for (var i = 0; i < vm.generator.piecesAmount; i++) {
                var row = generatePackagingRow();
                row.weight = vm.generator.weight;
                vm.packagesRows.push(row);
            }
        }

        function showReadOnlyDimensions(row) {
            return !row.dimensionsEditable && !row.fixedWeight && row.packageId !== '';
        }

        function generateFixedWeightMsg(row) {
            var userProfileWeightUom = nlsService.getTranslationSync(vm.userProfileWeightUomKey);
            var userProfileDimensionUom = nlsService.getTranslationSync(vm.userProfileDimensionsUomKey);

            fixedWeightMsg = fixedWeightMsg || nlsService.getTranslationSync('shipment.package_details_fixed_weight_message');
            return fixedWeightMsg.replace('{weight}', row.weight + userProfileWeightUom).replace('{width}', row.width + userProfileDimensionUom).replace('{height}', row.height + userProfileDimensionUom).replace('{length}', row.length + userProfileDimensionUom);
        }

        function isQuantityCorrectForCopy(row) {
            var totalQuantityBeforeCopy = $filter('calculateTotal')(vm.packagesRows, 'quantity');
            var lessTotalQuantity = (parseInt(row.quantity, 10) || 0) + totalQuantityBeforeCopy <= vm.maxTotalQuantity;

            return lessTotalQuantity;
        }

        function loadShipmentData(data) {
            isShipmentLoaded = true;
            Object.assign(vm, shipmentService.getPackageDetailsModelData(data));
        }
    }
});
//# sourceMappingURL=package-details-controller.js.map
