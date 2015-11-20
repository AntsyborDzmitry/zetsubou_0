define(['exports', 'module', './../../../../../services/nls-service', './../../../ewf-shipment-service', './../../shipment-type-service', './../../../package-details/package-details-service', './../ewf-itar-service'], function (exports, module, _servicesNlsService, _ewfShipmentService, _shipmentTypeService, _packageDetailsPackageDetailsService, _ewfItarService) {
    'use strict';

    module.exports = ItarEeiController;

    ItarEeiController.$inject = ['$filter', 'nlsService', 'shipmentService', 'shipmentTypeService', 'itarService', 'packageDetailsService'];

    function ItarEeiController($filter, nlsService, shipmentService, shipmentTypeService, itarService, packageDetailsService) {
        var vm = this;

        var exportCodes = [{ key: 'CH', nls: 'shipment.shipment_type_itar_eei_export_code_ch_label' }, { key: 'CR', nls: 'shipment.shipment_type_itar_eei_export_code_cr_label' }, { key: 'DD', nls: 'shipment.shipment_type_itar_eei_export_code_dd_label' }, { key: 'DP', nls: 'shipment.shipment_type_itar_eei_export_code_dp_label' }, { key: 'FS', nls: 'shipment.shipment_type_itar_eei_export_code_fs_label' }, { key: 'GP', nls: 'shipment.shipment_type_itar_eei_export_code_gp_label' }, { key: 'GS', nls: 'shipment.shipment_type_itar_eei_export_code_gs_label' }, { key: 'HH', nls: 'shipment.shipment_type_itar_eei_export_code_hh_label' }, { key: 'IC', nls: 'shipment.shipment_type_itar_eei_export_code_ic_label' }, { key: 'IP', nls: 'shipment.shipment_type_itar_eei_export_code_ip_label' }, { key: 'IR', nls: 'shipment.shipment_type_itar_eei_export_code_ir_label' }, { key: 'IS', nls: 'shipment.shipment_type_itar_eei_export_code_is_label' }, { key: 'LC', nls: 'shipment.shipment_type_itar_eei_export_code_lc_label' }, { key: 'LV', nls: 'shipment.shipment_type_itar_eei_export_code_lv_label' }, { key: 'MS', nls: 'shipment.shipment_type_itar_eei_export_code_ms_label' }, { key: 'OS', nls: 'shipment.shipment_type_itar_eei_export_code_os_label' }, { key: 'SC', nls: 'shipment.shipment_type_itar_eei_export_code_sc_label' }, { key: 'TE', nls: 'shipment.shipment_type_itar_eei_export_code_te_label' }, { key: 'TL', nls: 'shipment.shipment_type_itar_eei_export_code_tl_label' }, { key: 'TP', nls: 'shipment.shipment_type_itar_eei_export_code_tp_label' }, { key: 'UG', nls: 'shipment.shipment_type_itar_eei_export_code_ug_label' }, { key: 'ZD', nls: 'shipment.shipment_type_itar_eei_export_code_zd_label' }];
        var licenseTypes = [{ key: '', nls: 'shipment.select_one' }, { key: 'APR', nls: 'shipment.shipment_type_itar_eei_license_type_apr_label' }, { key: 'AVS', nls: 'shipment.shipment_type_itar_eei_license_type_avs_label' }, { key: 'BAG', nls: 'shipment.shipment_type_itar_eei_license_type_bag_label' }, { key: 'BIS', nls: 'shipment.shipment_type_itar_eei_license_type_bis_label' }, { key: 'CIV', nls: 'shipment.shipment_type_itar_eei_license_type_civ_label' }, { key: 'CTP', nls: 'shipment.shipment_type_itar_eei_license_type_ctp_label' }, { key: 'ENC', nls: 'shipment.shipment_type_itar_eei_license_type_enc_label' }, { key: 'GBS', nls: 'shipment.shipment_type_itar_eei_license_type_gbs_label' }, { key: 'GFT', nls: 'shipment.shipment_type_itar_eei_license_type_gft_label' }, { key: 'GOV', nls: 'shipment.shipment_type_itar_eei_license_type_gov_label' }, { key: 'KMI', nls: 'shipment.shipment_type_itar_eei_license_type_kmi_label' }, { key: 'KPC', nls: 'shipment.shipment_type_itar_eei_license_type_kpc_label' }, { key: 'LIC', nls: 'shipment.shipment_type_itar_eei_license_type_lic_label' }, { key: 'LVS', nls: 'shipment.shipment_type_itar_eei_license_type_lvs_label' }, { key: 'NLR', nls: 'shipment.shipment_type_itar_eei_license_type_nlr_label' }, { key: 'RPL', nls: 'shipment.shipment_type_itar_eei_license_type_rpl_label' }, { key: 'SCL', nls: 'shipment.shipment_type_itar_eei_license_type_scl_label' }, { key: 'TMP', nls: 'shipment.shipment_type_itar_eei_license_type_tmp_label' }, { key: 'TSR', nls: 'shipment.shipment_type_itar_eei_license_type_tsr_label' }, { key: 'TSU', nls: 'shipment.shipment_type_itar_eei_license_type_tsu_label' }, { key: 'VEU', nls: 'shipment.shipment_type_itar_eei_license_type_veu_label' }];
        var originTypes = {
            domestic: 'DOMESTIC',
            international: 'INTERNATIONAL'
        };
        var WEIGHT_UOM = {
            METRIC: 'kg',
            IMPERIAL: 'lb'
        };

        Object.assign(vm, {
            init: init,
            addEmptyCommodityRow: addEmptyCommodityRow,
            addNewCommodityRow: addNewCommodityRow,
            deleteCommodityRow: deleteCommodityRow,
            calculateTotalWeight: calculateTotalWeight,

            //TODO: use ewf-pattern-service
            PATTERNS: {
                EIN: '^(\\d{9}([a-zA-Z]{2}|\\d{2}))?$',
                LIC: '^([a-zA-Z0-9]{12})?$',
                NUMBER: '(^[1-9][0-9]*$)|(?:^$)'
            },
            commodityList: [],
            quantityUnits: [],
            isUnitsMismatched: false,
            maxTotalWeight: '',
            maxTotalValue: '',
            currentWeightUnit: '',
            ein: '',
            isRelated: false,
            originTypes: originTypes,
            exportCodes: exportCodes,
            licenseTypes: licenseTypes
        });

        function init() {
            var customsInvoice = shipmentService.getCustomsInvoice();
            if (customsInvoice && customsInvoice.items) {
                mapCustomsInvoiceToList(customsInvoice.items);
            }
            if (!vm.commodityList.length) {
                addEmptyCommodityRow();
            }

            var fromCountry = shipmentService.getShipmentCountry();
            var toCountry = shipmentService.getDestinationCountry();

            //TODO: remove package details service when max-total-weight parameter will move to shipment parameters
            var shipmentCountry = shipmentService.getShipmentCountry();
            var shipmentType = shipmentService.getShipmentType();
            packageDetailsService.getPackagingDetails(shipmentType, shipmentCountry).then(function (_ref) {
                var maxTotalWeight = _ref.maxTotalWeight;

                vm.maxTotalWeight = maxTotalWeight;
            });

            itarService.getCriticalShipmentItem(fromCountry).then(function (criticalPrice) {
                vm.maxTotalValue = criticalPrice;
                vm.descriptionContinuing = nlsService.getTranslationSync('shipment.shipment_type_itar_eei_description_continuing').replace('{number}', $filter('number')(criticalPrice));
            });

            shipmentTypeService.getShipmentParameters(fromCountry, toCountry).then(function (_ref2) {
                var units = _ref2.units;

                vm.quantityUnits = units.map(function (unit) {
                    return unit.name;
                });

                var defaultUnit = units.find(function (unit) {
                    return unit['default'];
                }).name;
                vm.commodityList.forEach(function (code) {
                    code.quantityUnit = defaultUnit;
                });
            });

            getSomParameters();

            translateList(exportCodes);
            translateList(licenseTypes);
        }

        function generateEmptyCommodityRow() {
            return {
                description: '',
                licenseType: '',
                licenseNumber: '',
                ECCN: '',
                quantity: 1,
                quantityUnit: '',
                exportCode: '',
                origin: '',
                totalWeight: '',
                totalValue: '',
                editable: true
            };
        }

        function mapCustomsInvoiceToList(customsInvoiceList) {
            vm.commodityList = [];
            customsInvoiceList.forEach(function (item) {
                var existingItem = vm.commodityList.find(function (commodity) {
                    return commodity.commodityCode === item.commodityCode;
                });

                var quantity = +item.quantity || 1;
                var totalWeight = (+item.netWeight || 0) * quantity;
                var totalValue = (+item.value || 0) * quantity;

                if (existingItem) {
                    existingItem.quantity += quantity;
                    existingItem.totalWeight += totalWeight;
                    existingItem.totalValue += totalValue;
                } else {
                    var newCommodityRow = generateEmptyCommodityRow();
                    newCommodityRow = Object.assign(newCommodityRow, {
                        commodityCode: item.commodityCode,
                        description: item.commodityCode + '/' + item.description,
                        quantityUnit: item.quantityUnits,
                        quantity: quantity,
                        totalWeight: totalWeight,
                        totalValue: totalValue,
                        editable: false
                    });
                    vm.commodityList.push(newCommodityRow);
                }
            });
        }

        function getSomParameters() {
            var SOM = shipmentService.getCountrySomParameters();
            vm.currentWeightUnit = WEIGHT_UOM[SOM.shipperCountrySom];
            vm.oppositeWeightUnit = WEIGHT_UOM[SOM.userProfileCountrySom];

            vm.weightConvertionRate = SOM.weightConvertionRate;
            vm.userProfileCountryConversionPrecision = SOM.userProfileCountryConversionPrecision;
            vm.isUnitsMismatched = SOM.shipperCountrySom !== SOM.userProfileCountrySom;
        }

        function translateList(list) {
            list.forEach(function (item) {
                item.value = nlsService.getTranslationSync(item.nls);
            });
        }

        function addEmptyCommodityRow() {
            vm.commodityList.push(generateEmptyCommodityRow());
        }

        function addNewCommodityRow(form, ewfFormCtrl) {
            if (form.$valid || !ewfFormCtrl.ewfValidation()) {
                vm.addEmptyCommodityRow();
            }
        }

        function deleteCommodityRow(row) {
            vm.commodityList.splice(vm.commodityList.indexOf(row), 1);
        }

        function calculateTotalWeight() {
            return $filter('calculateTotal')(vm.commodityList, 'totalWeight', 'quantity');
        }
    }
});
//# sourceMappingURL=ewf-itar-eei-controller.js.map
