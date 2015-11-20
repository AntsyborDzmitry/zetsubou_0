define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = PackageDetailsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('packageDetailsService', PackageDetailsService);

    PackageDetailsService.$inject = ['$http', '$q', 'logService'];

    function PackageDetailsService($http, $q, logService) {
        return {
            getPackagingDetails: getPackagingDetails,
            saveCustomPackaging: saveCustomPackaging
        };

        function getPackagingDetails(shipmentType, shipmentCountry) {
            var isCustomPackagesExcluded = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var params = isCustomPackagesExcluded ? { isCustomPackagesExcluded: isCustomPackagesExcluded } : {};

            return $http.get('/api/shipment/packaging/details/' + shipmentCountry + '/' + shipmentType, { params: params }).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Packaging details failed with some error');
                return $q.reject(response.data);
            });
        }

        function saveCustomPackaging(customPackaging) {
            return $http.post('/api/myprofile/packaging/custom', customPackaging).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Saving package failed with some error');
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=package-details-service.js.map
