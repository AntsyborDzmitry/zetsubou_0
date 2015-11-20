define(['exports', 'module', './../../services/ewf-pattern-service', 'ewf'], function (exports, module, _servicesEwfPatternService, _ewf) {
    'use strict';

    module.exports = PackagingMeasuresService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('packagingMeasuresService', PackagingMeasuresService);

    PackagingMeasuresService.$inject = ['ewfPatternService'];

    function PackagingMeasuresService(ewfPatternService) {
        var IMPERIAL = 'IMPERIAL';
        var METRIC = 'METRIC';

        var WEIGHT = 'WEIGHT';
        var DIMENSION = 'DIMENSION';

        var defaultSystem = IMPERIAL;

        var units = [{
            key: 'KG',
            title: 'kg',
            system: METRIC,
            type: WEIGHT,
            factor: 1
        }, {
            key: 'LB',
            title: 'lb',
            system: IMPERIAL,
            type: WEIGHT,
            factor: 0.45359237
        }, {
            key: 'CM',
            title: 'cm',
            system: METRIC,
            type: DIMENSION,
            factor: 0.01
        }, {
            key: 'IN',
            title: 'in',
            system: IMPERIAL,
            type: DIMENSION,
            factor: 0.0254
        }];

        var unitsMap = {};

        var UNSIGNED_FLOAT = ewfPatternService.getPattern('UNSIGNED_FLOAT');

        units.forEach(function (item) {
            unitsMap[item.key] = item;
        });

        function convertValue(fromUnit, toUnit, value) {
            if (!UNSIGNED_FLOAT.test(value)) {
                return value;
            }

            var convertedValue = Number.parseFloat(value) * unitsMap[fromUnit].factor / unitsMap[toUnit].factor;

            return Math.round(convertedValue * 100) / 100;
        }

        function getWeightUnits() {
            return units.filter(function (item) {
                return item.type === WEIGHT;
            });
        }

        function getDimensionUnits() {
            return units.filter(function (item) {
                return item.type === DIMENSION;
            });
        }

        function getDefaultWeightUnit() {
            return units.find(function (item) {
                return item.type === WEIGHT && item.system === defaultSystem;
            });
        }

        function getDefaultDimensionUnit() {
            return units.find(function (item) {
                return item.type === DIMENSION && item.system === defaultSystem;
            });
        }

        function getUnitInfo(unitKey) {
            return unitsMap[unitKey];
        }

        return {
            convertValue: convertValue,

            getWeightUnits: getWeightUnits,
            getDimensionUnits: getDimensionUnits,

            getDefaultWeightUnit: getDefaultWeightUnit,
            getDefaultDimensionUnit: getDefaultDimensionUnit,

            getUnitInfo: getUnitInfo
        };
    }
});
//# sourceMappingURL=packaging-measures-service.js.map
