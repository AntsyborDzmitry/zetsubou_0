define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ShipmentPrintService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('shipmentPrintService', ShipmentPrintService);

    ShipmentPrintService.$inject = ['$http', '$q', '$window', 'logService'];

    function ShipmentPrintService($http, $q, $window, logService) {
        this.getDocumentsForPrinting = getDocumentsForPrinting;

        this.downloadWaybillPdf = downloadWaybillPdf;
        this.downloadReceiptPdf = downloadReceiptPdf;
        this.downloadInvoicePdf = downloadInvoicePdf;

        this.saveAsFavorite = saveAsFavorite;
        this.getPickUpInfo = getPickUpInfo;
        this.getTrackingNumber = getTrackingNumber;

        function getDocumentsForPrinting(shipmentId) {
            return $http.get('/api/shipment/' + shipmentId + '/print/documents').then(function (response) {
                return response;
            })['catch'](function (response) {
                logService.error('can not receive PDF files for printing');
                return $q.reject(customParseError(response));
            });
        }

        function getPickUpInfo() /*shipmentId*/{
            //TODO: replace when the end-point will be available
            var pickUpInfo = {
                pickupDate: 'Today, 28 July 2022',
                confirmationNumber: '777777777'
            };

            return $q.when(pickUpInfo);

            /*return $http.get(`/api/shipment/${shipmentId}/pickup`)
                 .then(function (response) {
                    return response;
                 })
                 .catch(function (response) {
                    logService.error('can not save shipment as favorite');
                    return $q.reject(response);
                });*/
        }

        function downloadWaybillPdf(shipmentId) {
            $window.open('/api/shipment/' + shipmentId + '/label/pdf');
        }
        function downloadReceiptPdf(shipmentId) {
            $window.open('/api/shipment/' + shipmentId + '/receipt/pdf');
        }
        function downloadInvoicePdf(shipmentId) {
            $window.open('/api/shipment/' + shipmentId + '/invoice/pdf');
        }

        function saveAsFavorite(shipmentId) {
            var deferred = $q.defer();
            deferred.resolve(shipmentId);
            return deferred.promise;

            /*return $http.get(`/api/shipment/favorite/${shipmentId}`)
                .then(function (response) {
                    return response;
                })
                .catch(function (response) {
                    logService.error('can not save shipment as favorite');
                    return $q.reject(response);
                });*/
        }

        function getTrackingNumber(shipmentId) {
            return $http.get('/api/shipment/' + shipmentId + '/trackingInfo').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('can not receive tracking number');
                return $q.reject(response);
            });
        }

        var shipmentNotFound = 'errors.shipment_not_found',
            printLabelError = 'errors.print_label_cannot_be_rendered',
            printServiceError = 'errors.print_service_error';

        function customParseError(response) {
            switch (response.status) {
                case 404:
                    return shipmentNotFound;
                case 422:
                    return printLabelError;
                default:
                    return printServiceError;
            }
        }
    }
});
//# sourceMappingURL=shipment-print-service.js.map
