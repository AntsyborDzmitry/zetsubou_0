import ewf from 'ewf';

ewf.service('shipmentProductsService', ShipmentProductsService);

ShipmentProductsService.$inject = ['$http', '$q', 'logService'];

export default function ShipmentProductsService($http, $q, logService) {
    let shipmentProducts = {};
    let shipmentTimezoneOffset = '';

    angular.extend(this, {
        getShipmentDates,
        getProductsByDate,
        clearProductsCache,
        getFavoriteProduct,
        getProductWithDiscount,
        getShipmentTimezoneOffset
    });

    function getShipmentDates(countryCode, postalCode, city) {
        return $http.get(`/api/shipment/products/shipmentDates/${countryCode}/${postalCode}/${city}`)
            .then((response) => {
                shipmentTimezoneOffset = response.data.timeZoneOffset;
                return response.data;
            })
            .catch((response) => {
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

        return $http.post('/api/shipment/products/list', quotationRequestData)
            .then((response = {}) => {
                response.data = response.data || {};
                shipmentProducts[dateTimestamp] = sortProducts(response.data.products || []);
                return shipmentProducts[dateTimestamp];
            })
            .catch((response) => {
                logService.error('ShipmentProductsService#getProductsByDate: response error', response);
            });
    }

    function clearProductsCache() {
        shipmentProducts = {};
        return this;
    }

    function sortProducts(products) {
        return products.sort((first, second) => {
            return first.estimatedDelivery - second.estimatedDelivery;
        });
    }

    function getFavoriteProduct() {
        return $http.get('/api/shipment/products/favoriteCode')
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ShipmentProductsService#getFavoriteProduct: response error', response);
            });
    }

    function getProductWithDiscount(accountNumber, targetProduct, shipmentDate, quotationRequestData) {
        quotationRequestData.accountNumber = accountNumber;

        return this.getProductsByDate(shipmentDate, quotationRequestData)
            .then((products) => products.find((product) => product.code === targetProduct.code));
    }

    function getShipmentTimezoneOffset() {
        return shipmentTimezoneOffset;
    }
}
