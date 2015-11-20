define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ItemAttributesService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('itemAttributesService', ItemAttributesService);

    ItemAttributesService.$inject = ['$http', '$q', 'logService'];

    function ItemAttributesService($http, $q, logService) {
        var publicAPI = {
            getShipmentItemAttributesDetails: getShipmentItemAttributesDetails,
            getCommodityCodeCategories: getCommodityCodeCategories,
            getCommodityCodeSubcategories: getCommodityCodeSubcategories,
            getCommodityCodes: getCommodityCodes,
            saveShipmentItemAttributes: saveShipmentItemAttributes,
            getShippingPurposeList: getShippingPurposeList,
            getCountries: getCountries
        };

        function getShipmentItemAttributesDetails() {
            //user dependent
            return $http.get('/api/shipment/itemAttributes/details').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getShipmentItemAttributesDetails: response error', response);
                return $q.reject(response);
            });
        }

        function getCommodityCodeCategories() {
            return $http.get('/api/shipment/itemAttributes/commodityCodeCategories').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getCommodityCodeCategories: response error', response);
                return $q.reject(response);
            });
        }

        function getCommodityCodeSubcategories(categoryId) {
            return $http.get('/api/shipment/itemAttributes/commodityCodeSubcategories/' + categoryId).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getCommodityCodeSubcategories: response error', response);
                return $q.reject(response);
            });
        }

        function getCommodityCodes(query, categoryId, subcategoryId) {
            return $http.get('/api/shipment/itemAttributes/commodityCodes?\n                            categoryId=' + categoryId + '&subcategoryId=' + subcategoryId + '&descriptionPart=' + query).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getCommodityCodes: response error', response);
                return $q.reject(response);
            });
        }

        function saveShipmentItemAttributes(itemAttributesRow) {
            return $http.post('/api/shipment/itemAttributes/save', itemAttributesRow).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#saveShipmentItemAttributes: response error', response);
                return $q.reject(response);
            });
        }

        function getShippingPurposeList(countryCode) {
            return $http.get('/api/shipment/customsInvoice/purpose/list/' + countryCode).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getShippingPurposeList: response error', response);
                return $q.reject(response);
            });
        }

        function getCountries() {
            return $http.get('/api/location/list').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ItemAttributesService#getCountries: response error', response);
                return $q.reject(response);
            });
        }

        return publicAPI;
    }
});
//# sourceMappingURL=item-attributes-service.js.map
