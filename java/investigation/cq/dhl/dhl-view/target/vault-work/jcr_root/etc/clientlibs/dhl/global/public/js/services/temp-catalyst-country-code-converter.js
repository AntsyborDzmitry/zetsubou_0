define(['exports', 'module', 'ewf', 'angular'], function (exports, module, _ewf, _angular) {
    'use strict';

    module.exports = countryCodeConverter;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _angular2 = _interopRequireDefault(_angular);

    _ewf2['default'].service('countryCodeConverter', countryCodeConverter);

    function countryCodeConverter() {
        return {
            fromThreeLetterToCatalystFormat: fromThreeLetterToCatalystFormat,
            fromTwoCapsToThreeLow: fromTwoCapsToThreeLow
        };

        //TODO: move to normal service without mock routine
        function fromThreeLetterToCatalystFormat(threeLetters, countryList) {
            if (_angular2['default'].isUndefined(countryList)) {
                return fromThreeLetterToCatalystFormatMock(threeLetters);
            }

            var country = countryList.find(function (eachCountry) {
                return eachCountry.code3.toLowerCase() === threeLetters.toLowerCase();
            });
            return country && country.code2;
        }

        function fromThreeLetterToCatalystFormatMock(threeLetters) {
            if (threeLetters === 'usa') {
                return 'US';
            }
            if (threeLetters === 'ukr') {
                return 'UA';
            }
            if (threeLetters === 'deu') {
                return 'DE';
            }
        }

        function fromTwoCapsToThreeLow(twoLetters) {
            if (twoLetters === 'US') {
                return 'usa';
            }
            if (twoLetters === 'UA') {
                return 'ukr';
            }
            if (twoLetters === 'DE') {
                return 'deu';
            }
        }
    }
});
//# sourceMappingURL=temp-catalyst-country-code-converter.js.map
