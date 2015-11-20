import ewf from 'ewf';

ewf.service('itemAttributesService', ItemAttributesService);

ItemAttributesService.$inject = ['$http', '$q', 'logService'];

export default function ItemAttributesService($http, $q, logService) {
    const publicAPI = {
        getShipmentItemAttributesDetails,
        getCommodityCodeCategories,
        getCommodityCodeSubcategories,
        getCommodityCodes,
        saveShipmentItemAttributes,
        getShippingPurposeList,
        getCountries
    };

    function getShipmentItemAttributesDetails() {
        //user dependent
        return $http.get(`/api/shipment/itemAttributes/details`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getShipmentItemAttributesDetails: response error', response);
                return $q.reject(response);
            });
    }

    function getCommodityCodeCategories() {
        return $http.get(`/api/shipment/itemAttributes/commodityCodeCategories`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getCommodityCodeCategories: response error', response);
                return $q.reject(response);
            });
    }

    function getCommodityCodeSubcategories(categoryId) {
        return $http.get(`/api/shipment/itemAttributes/commodityCodeSubcategories/${categoryId}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getCommodityCodeSubcategories: response error', response);
                return $q.reject(response);
            });
    }

    function getCommodityCodes(query, categoryId, subcategoryId) {
        return $http.get(`/api/shipment/itemAttributes/commodityCodes?
                            categoryId=${categoryId}&subcategoryId=${subcategoryId}&descriptionPart=${query}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getCommodityCodes: response error', response);
                return $q.reject(response);
            });
    }

    function saveShipmentItemAttributes(itemAttributesRow) {
        return $http.post(`/api/shipment/itemAttributes/save`, itemAttributesRow)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#saveShipmentItemAttributes: response error', response);
                return $q.reject(response);
            });
    }

    function getShippingPurposeList(countryCode) {
        return $http.get(`/api/shipment/customsInvoice/purpose/list/${countryCode}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getShippingPurposeList: response error', response);
                return $q.reject(response);
            });
    }

    function getCountries() {
        return $http.get(`/api/location/list`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ItemAttributesService#getCountries: response error', response);
                return $q.reject(response);
            });
    }

    return publicAPI;
}
