define(['exports', 'module', './ewf-itar-service', './../../ewf-shipment-service', './../../../../services/nls-service', './../../../../services/modal/modal-service', './../../../../services/config-service'], function (exports, module, _ewfItarService, _ewfShipmentService, _servicesNlsService, _servicesModalModalService, _servicesConfigService) {
    'use strict';

    module.exports = ItarController;

    ItarController.$inject = ['$scope', '$filter', 'nlsService', 'configService', 'modalService', 'shipmentService', 'itarService'];

    function ItarController($scope, $filter, nlsService, configService, modalService, shipmentService, itarService) {
        var vm = this;

        var shipmentExportTypes = {
            FTR: 'FTR',
            ITN: 'ITN',
            EEI: 'EEI',
            EIN: 'EIN'
        };
        var country = undefined;
        var displayItar = false;

        Object.assign(vm, {
            init: init,
            getItar: getItar,
            showItar: showItar,
            isNotFederalRegulations: isNotFederalRegulations,
            openFtrCodesPopup: openFtrCodesPopup,

            itnNumber: '',
            einNumber: '',
            PATTERNS: {
                ITN: '^([x,X]\\d{14})?$',
                exportLicenseNumber: '^([a-zA-Z0-9]{1,23})?$',
                ultimateConsignee: '^([a-zA-Z0-9]{1,35})?$',
                EIN: '^(\\d{9}([a-zA-Z]{2}|\\d{2}))?$'
            },
            stateDepartmentFields: {
                exportLicenseNumber: '',
                ultimateConsignee: ''
            },
            departmentOfStateChosen: {
                YES: 'yes',
                NO: 'no'
            },
            shipmentExportType: '',
            shipmentExportTypes: shipmentExportTypes,
            shipmentExportTypesList: [{
                value: '',
                nlsKey: 'shipment.shipment_type_itar_select_one'
            }, {
                value: shipmentExportTypes.FTR,
                nlsKey: 'shipment.shipment_type_itar_ftr_option'
            }, {
                value: shipmentExportTypes.ITN,
                nlsKey: 'shipment.shipment_type_itar_itn_option'
            }, {
                value: shipmentExportTypes.EEI,
                nlsKey: 'shipment.shipment_type_itar_eei_option'
            }]
        });

        function init() {
            country = shipmentService.getShipmentCountry();
            itarService.getEnableItarValue(country).then(function (enableItar) {
                displayItar = enableItar;
            });
            itarService.getItarDetails(shipmentService.getDestinationCountry()).then(onGetItarDetails)['catch'](onError);
        }

        function onGetItarDetails(itarDetails) {
            showDescriptionWithCriticalValue();
            setItnLink();

            vm.ftrExemptionList = itarDetails.ftrExemptionList;
            vm.employeeIdAvailable = itarDetails.employeeIdentificationNumberAvailable;
        }

        function showDescriptionWithCriticalValue() {
            itarService.getCriticalShipmentItem(country).then(function (criticalPrice) {
                vm.notDepartmentOfStateDescription = nlsService.getTranslationSync('shipment.shipment_type_itar_not_department_of_state_description').replace('{number}', $filter('number')(criticalPrice));
            });
        }

        function setItnLink() {
            var key = 'Shipment Details.EEI.aes.url';
            configService.getValue(key, country).then(function (info) {
                vm.itnLink = info.data.value;
            });
        }

        function showItar() {
            return displayItar;
        }

        function onError(error) {
            vm.error = nlsService.getTranslationSync(error);
        }

        function getItar() {
            var itar = null;
            if (vm.isDepartmentOfState) {
                itar = {
                    departmentOfState: true,
                    itn: 'X' + vm.itnNumber.slice(1),
                    exportLicenseNumber: vm.stateDepartmentFields.exportLicenseNumber,
                    ultimateConsignee: vm.stateDepartmentFields.ultimateConsignee
                };
            } else if (vm.federalTradeRegulations) {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: true
                };
            } else if (vm.shipmentExportType === vm.shipmentExportTypes.FTR) {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: false,
                    exportFilingOption: vm.shipmentExportTypes.FTR,
                    ftrExemptions: vm.ftrExemptions.code
                };
            } else if (vm.shipmentExportType === vm.shipmentExportTypes.ITN) {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: false,
                    exportFilingOption: vm.shipmentExportTypes.ITN,
                    itn: 'X' + vm.itnNumber.slice(1)
                };
            } else if (vm.shipmentExportType === vm.shipmentExportTypes.EIN) {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: false,
                    exportFilingOption: vm.shipmentExportTypes.EIN,
                    employerIdentificationNumber: vm.einNumber,
                    aespostTermsAccepted: vm.aespostTermsAccepted
                };
            } else if (vm.shipmentExportType === vm.shipmentExportTypes.EEI) {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: false,
                    exportFilingOption: vm.shipmentExportTypes.EEI,
                    employerIdentificationNumber: vm.itarEeiCtrl.ein,
                    electronicExportInformation: {
                        items: getComodityItems(),
                        senderAndReceiverRelated: vm.itarEeiCtrl.isRelated
                    }
                };
            }
            return itar;
        }

        function isNotFederalRegulations() {
            return vm.isDepartmentOfState === false && vm.federalTradeRegulations === false;
        }

        function openFtrCodesPopup() {
            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ewf-modal_width_large',
                template: '<div ewf-modal nls-title=shipment.shipment_type_itar_ftr_lookup_title_help><h4 nls=shipment.shipment_type_itar_ftr_lookup_title_ftr></h4><p nls=shipment.shipment_type_itar_ftr_lookup_ftr_definition></p><table class=\"table table_zebra\"><thead><tr><th nls=shipment.shipment_type_itar_table_ftr_label></th><th nls=shipment.shipment_type_itar_table_ftr_explanation_label></th></tr></thead><tbody><tr ng-repeat=\"exemption in itarCtrl.ftrExemptionList\"><td>{{exemption.code}}</td><td nls={{exemption.description}}></td></tr></tbody></table><p class=margin-bottom-none nls=shipment.shipment_type_itar_ftr_lookup_footnote></p></div>'
            });
        }

        function getComodityItems() {
            var items = vm.itarEeiCtrl.commodityList.map(function (commodityRow) {
                return {
                    description: commodityRow.description,
                    licenseType: commodityRow.licenseType,
                    licenseNumber: commodityRow.licenseNumber,
                    eccn: commodityRow.ECCN,
                    quantity: parseFloat(commodityRow.quantity),
                    units: commodityRow.quantityUnit,
                    exportCode: commodityRow.exportCode.value,
                    commodityOrigin: commodityRow.origin,
                    totalWeight: parseFloat(commodityRow.totalWeight),
                    totalValue: parseFloat(commodityRow.totalValue)
                };
            });

            return items;
        }
    }
});
//# sourceMappingURL=ewf-itar-controller.js.map
