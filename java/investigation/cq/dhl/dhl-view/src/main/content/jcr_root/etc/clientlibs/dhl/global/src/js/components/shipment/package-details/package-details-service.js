import ewf from 'ewf';

ewf.service('packageDetailsService', PackageDetailsService);

PackageDetailsService.$inject = ['$http', '$q', 'logService'];

export default function PackageDetailsService($http, $q, logService) {
    return {
        getPackagingDetails,
        saveCustomPackaging
    };

    function getPackagingDetails(shipmentType, shipmentCountry, isCustomPackagesExcluded = false) {
        const params = isCustomPackagesExcluded ? {isCustomPackagesExcluded} : {};

        return $http.get(`/api/shipment/packaging/details/${shipmentCountry}/${shipmentType}`, {params})
            .then((response) => response.data)
            .catch((response) => {
                logService.error('Packaging details failed with some error');
                return $q.reject(response.data);
            });
    }

    function saveCustomPackaging(customPackaging) {
        return $http.post('/api/myprofile/packaging/custom', customPackaging)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('Saving package failed with some error');
                return $q.reject(response.data);
            });
    }
}
