define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = convertUomToOpposite;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].filter('convertUomToOpposite', convertUomToOpposite);

    function convertUomToOpposite() {
        var defaultConvertPrecision = 2;

        return function (value, uomCoefficient) {
            var convertPrecision = arguments.length <= 2 || arguments[2] === undefined ? defaultConvertPrecision : arguments[2];

            var convertedValue = 0;
            var valueToConvert = parseFloat(value);

            if (valueToConvert) {
                convertedValue = valueToConvert * (+uomCoefficient || 1);
            }
            return +convertedValue.toFixed(convertPrecision);
        };
    }
});
//# sourceMappingURL=convert-uom-filter.js.map
