define(['exports', 'module', 'ewf', './../../../services/ewf-crud-service'], function (exports, module, _ewf, _servicesEwfCrudService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = DeliveryOptionsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('deliveryOptionsService', DeliveryOptionsService);

    DeliveryOptionsService.$inject = ['$q', 'ewfCrudService'];

    function DeliveryOptionsService($q, ewfCrudService) {
        var deliveryOptionsUrl = '/api/myprofile/shipment/defaults/delivery';
        var countryListUrl = '/api/location/list';

        Object.assign(this, {
            getData: getData,
            saveOptions: saveOptions,
            getDeliveryOptions: getDeliveryOptions,
            getCountryList: getCountryList
        });

        function getData() {
            return $q.all([getDeliveryOptions(), getCountryList()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var options = _ref2[0];
                var countryList = _ref2[1];
                return {
                    options: options,
                    countryList: countryList
                };
            });
        }

        function getDeliveryOptions() {
            return ewfCrudService.getElementList(deliveryOptionsUrl);
        }

        function getCountryList() {
            return ewfCrudService.getElementList(countryListUrl);
        }

        function saveOptions(options) {
            return ewfCrudService.updateElement(deliveryOptionsUrl, options);
        }
    }
});
//# sourceMappingURL=delivery-options-service.js.map
