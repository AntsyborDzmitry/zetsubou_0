import './../../../../../services/nls-service';
import './../../../ewf-shipment-service';
import './../../shipment-type-service';
import './../../../package-details/package-details-service';
import './../ewf-itar-service';

ItarEeiController.$inject = [
    '$filter',
    'nlsService',
    'shipmentService',
    'shipmentTypeService',
    'itarService',
    'packageDetailsService'
];

export default function ItarEeiController($filter,
                                          nlsService,
                                          shipmentService,
                                          shipmentTypeService,
                                          itarService,
                                          packageDetailsService) {
    const vm = this;

    const exportCodes = [
        {key: 'CH', nls: 'shipment.shipment_type_itar_eei_export_code_ch_label'},
        {key: 'CR', nls: 'shipment.shipment_type_itar_eei_export_code_cr_label'},
        {key: 'DD', nls: 'shipment.shipment_type_itar_eei_export_code_dd_label'},
        {key: 'DP', nls: 'shipment.shipment_type_itar_eei_export_code_dp_label'},
        {key: 'FS', nls: 'shipment.shipment_type_itar_eei_export_code_fs_label'},
        {key: 'GP', nls: 'shipment.shipment_type_itar_eei_export_code_gp_label'},
        {key: 'GS', nls: 'shipment.shipment_type_itar_eei_export_code_gs_label'},
        {key: 'HH', nls: 'shipment.shipment_type_itar_eei_export_code_hh_label'},
        {key: 'IC', nls: 'shipment.shipment_type_itar_eei_export_code_ic_label'},
        {key: 'IP', nls: 'shipment.shipment_type_itar_eei_export_code_ip_label'},
        {key: 'IR', nls: 'shipment.shipment_type_itar_eei_export_code_ir_label'},
        {key: 'IS', nls: 'shipment.shipment_type_itar_eei_export_code_is_label'},
        {key: 'LC', nls: 'shipment.shipment_type_itar_eei_export_code_lc_label'},
        {key: 'LV', nls: 'shipment.shipment_type_itar_eei_export_code_lv_label'},
        {key: 'MS', nls: 'shipment.shipment_type_itar_eei_export_code_ms_label'},
        {key: 'OS', nls: 'shipment.shipment_type_itar_eei_export_code_os_label'},
        {key: 'SC', nls: 'shipment.shipment_type_itar_eei_export_code_sc_label'},
        {key: 'TE', nls: 'shipment.shipment_type_itar_eei_export_code_te_label'},
        {key: 'TL', nls: 'shipment.shipment_type_itar_eei_export_code_tl_label'},
        {key: 'TP', nls: 'shipment.shipment_type_itar_eei_export_code_tp_label'},
        {key: 'UG', nls: 'shipment.shipment_type_itar_eei_export_code_ug_label'},
        {key: 'ZD', nls: 'shipment.shipment_type_itar_eei_export_code_zd_label'}
    ];
    const licenseTypes = [
        {key: '', nls: 'shipment.select_one'},
        {key: 'APR', nls: 'shipment.shipment_type_itar_eei_license_type_apr_label'},
        {key: 'AVS', nls: 'shipment.shipment_type_itar_eei_license_type_avs_label'},
        {key: 'BAG', nls: 'shipment.shipment_type_itar_eei_license_type_bag_label'},
        {key: 'BIS', nls: 'shipment.shipment_type_itar_eei_license_type_bis_label'},
        {key: 'CIV', nls: 'shipment.shipment_type_itar_eei_license_type_civ_label'},
        {key: 'CTP', nls: 'shipment.shipment_type_itar_eei_license_type_ctp_label'},
        {key: 'ENC', nls: 'shipment.shipment_type_itar_eei_license_type_enc_label'},
        {key: 'GBS', nls: 'shipment.shipment_type_itar_eei_license_type_gbs_label'},
        {key: 'GFT', nls: 'shipment.shipment_type_itar_eei_license_type_gft_label'},
        {key: 'GOV', nls: 'shipment.shipment_type_itar_eei_license_type_gov_label'},
        {key: 'KMI', nls: 'shipment.shipment_type_itar_eei_license_type_kmi_label'},
        {key: 'KPC', nls: 'shipment.shipment_type_itar_eei_license_type_kpc_label'},
        {key: 'LIC', nls: 'shipment.shipment_type_itar_eei_license_type_lic_label'},
        {key: 'LVS', nls: 'shipment.shipment_type_itar_eei_license_type_lvs_label'},
        {key: 'NLR', nls: 'shipment.shipment_type_itar_eei_license_type_nlr_label'},
        {key: 'RPL', nls: 'shipment.shipment_type_itar_eei_license_type_rpl_label'},
        {key: 'SCL', nls: 'shipment.shipment_type_itar_eei_license_type_scl_label'},
        {key: 'TMP', nls: 'shipment.shipment_type_itar_eei_license_type_tmp_label'},
        {key: 'TSR', nls: 'shipment.shipment_type_itar_eei_license_type_tsr_label'},
        {key: 'TSU', nls: 'shipment.shipment_type_itar_eei_license_type_tsu_label'},
        {key: 'VEU', nls: 'shipment.shipment_type_itar_eei_license_type_veu_label'}
    ];
    const originTypes = {
        domestic: 'DOMESTIC',
        international: 'INTERNATIONAL'
    };
    const WEIGHT_UOM = {
        METRIC: 'kg',
        IMPERIAL: 'lb'
    };

    Object.assign(vm, {
        init,
        addEmptyCommodityRow,
        addNewCommodityRow,
        deleteCommodityRow,
        calculateTotalWeight,

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
        originTypes,
        exportCodes,
        licenseTypes
    });

    function init() {
        const customsInvoice = shipmentService.getCustomsInvoice();
        if (customsInvoice && customsInvoice.items) {
            mapCustomsInvoiceToList(customsInvoice.items);
        }
        if (!vm.commodityList.length) {
            addEmptyCommodityRow();
        }

        const fromCountry = shipmentService.getShipmentCountry();
        const toCountry = shipmentService.getDestinationCountry();

        //TODO: remove package details service when max-total-weight parameter will move to shipment parameters
        const shipmentCountry = shipmentService.getShipmentCountry();
        const shipmentType = shipmentService.getShipmentType();
        packageDetailsService.getPackagingDetails(shipmentType, shipmentCountry)
            .then(({maxTotalWeight}) => {
                vm.maxTotalWeight = maxTotalWeight;
            });

        itarService.getCriticalShipmentItem(fromCountry)
            .then((criticalPrice) => {
                vm.maxTotalValue = criticalPrice;
                vm.descriptionContinuing = nlsService
                    .getTranslationSync('shipment.shipment_type_itar_eei_description_continuing')
                    .replace('{number}', $filter('number')(criticalPrice));
            });

        shipmentTypeService.getShipmentParameters(fromCountry, toCountry)
            .then(({units}) => {
                vm.quantityUnits = units.map((unit) => unit.name);

                const defaultUnit = units.find((unit) => unit.default).name;
                vm.commodityList.forEach((code) => {
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
        customsInvoiceList.forEach((item) => {
            const existingItem = vm.commodityList.find((commodity) => commodity.commodityCode === item.commodityCode);

            const quantity = +item.quantity || 1;
            const totalWeight = (+item.netWeight || 0) * quantity;
            const totalValue = (+item.value || 0) * quantity;

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalWeight += totalWeight;
                existingItem.totalValue += totalValue;
            } else {
                let newCommodityRow = generateEmptyCommodityRow();
                newCommodityRow = Object.assign(newCommodityRow, {
                    commodityCode: item.commodityCode,
                    description: `${item.commodityCode}/${item.description}`,
                    quantityUnit: item.quantityUnits,
                    quantity,
                    totalWeight,
                    totalValue,
                    editable: false
                });
                vm.commodityList.push(newCommodityRow);
            }
        });
    }

    function getSomParameters() {
        const SOM = shipmentService.getCountrySomParameters();
        vm.currentWeightUnit = WEIGHT_UOM[SOM.shipperCountrySom];
        vm.oppositeWeightUnit = WEIGHT_UOM[SOM.userProfileCountrySom];

        vm.weightConvertionRate = SOM.weightConvertionRate;
        vm.userProfileCountryConversionPrecision = SOM.userProfileCountryConversionPrecision;
        vm.isUnitsMismatched = SOM.shipperCountrySom !== SOM.userProfileCountrySom;
    }

    function translateList(list) {
        list.forEach((item) => {
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
