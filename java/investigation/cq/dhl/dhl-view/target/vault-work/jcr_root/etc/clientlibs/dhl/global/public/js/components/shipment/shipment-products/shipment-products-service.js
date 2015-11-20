define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ShipmentProductsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('shipmentProductsService', ShipmentProductsService);

    ShipmentProductsService.$inject = ['$http', '$q', 'logService'];

    function ShipmentProductsService($http, $q, logService) {
        var shipmentProducts = {};
        var shipmentTimezoneOffset = '';

        angular.extend(this, {
            getShipmentDates: getShipmentDates,
            getProductsByDate: getProductsByDate,
            clearProductsCache: clearProductsCache,
            getFavoriteProduct: getFavoriteProduct,
            getProductWithDiscount: getProductWithDiscount,
            getShipmentTimezoneOffset: getShipmentTimezoneOffset
        });

        function getShipmentDates(countryCode, postalCode, city) {
            return $http.get('/api/shipment/products/shipmentDates/' + countryCode + '/' + postalCode + '/' + city).then(function (response) {
                shipmentTimezoneOffset = response.data.timeZoneOffset;
                return response.data;
            })['catch'](function (response) {
                logService.error('ShipmentProductsService#getShipmentDates: response error', response);
            });
        }

        function getProductsByDate(dateTimestamp, quotationRequestData) {
            if (shipmentProducts.hasOwnProperty(dateTimestamp)) {
                return $q.when(shipmentProducts[dateTimestamp]);
            }

            quotationRequestData.readyTime = dateTimestamp;
            //TODO: refactor work with date/time considering timezone and using one general format (preferably milliseconds)
            quotationRequestData.pickupDate = new Date(dateTimestamp).getTime(); //fixme

            return $http.post('/api/shipment/products/list', quotationRequestData).then(function () {
                var response = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                response.data = response.data || {};
                shipmentProducts[dateTimestamp] = sortProducts(response.data.products || []);
                return shipmentProducts[dateTimestamp];
            })['catch'](function (response) {
                logService.error('ShipmentProductsService#getProductsByDate: response error', response);
            });
        }

        function clearProductsCache() {
            shipmentProducts = {};
            return this;
        }

        function sortProducts(products) {
            return products.sort(function (first, second) {
                return first.estimatedDelivery - second.estimatedDelivery;
            });
        }

        function getFavoriteProduct() {
            return $http.get('/api/shipment/products/favoriteCode').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ShipmentProductsService#getFavoriteProduct: response error', response);
            });
        }

        function getProductWithDiscount(accountNumber, targetProduct, shipmentDate, quotationRequestData) {
            quotationRequestData.accountNumber = accountNumber;

            return this.getProductsByDate(shipmentDate, quotationRequestData).then(function (products) {
                return products.find(function (product) {
                    return product.code === targetProduct.code;
                });
            });
        }

        function getShipmentTimezoneOffset() {
            return shipmentTimezoneOffset;
        }
    }
});
//# sourceMappingURL=shipment-products-service.js.map
