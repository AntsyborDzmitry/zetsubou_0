define(['exports', 'module', './shipment-print-service', './../../../services/modal/modal-service', 'pdfjs'], function (exports, module, _shipmentPrintService, _servicesModalModalService, _pdfjs) {
    'use strict';

    module.exports = ShipmentPrintController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _PDFJS = _interopRequireDefault(_pdfjs);

    ShipmentPrintController.$inject = ['$scope', 'modalService', 'logService', 'shipmentPrintService', '$window', '$q', 'navigationService', 'nlsService'];

    // TODO: wrong inject order
    // TODO: check all this file: controllers should not work with raw http response

    function ShipmentPrintController($scope, modalService, logService, shipmentPrintService, $window, $q, navigationService, nlsService) {
        var vm = this;

        $window.PDFJS = _PDFJS['default'] || $window.PDFJS; // Workaround for PDFJS not exposing itself through the import variable
        // TODO: remove this?

        Object.assign(vm, {
            previewDocument: previewDocument,
            print: print,
            saveAsFavorite: saveAsFavorite,

            waybillDocument: null,
            receiptDocument: null,
            invoiceDocument: null,

            waybillQuantity: 1,
            invoiceQuantity: 1,
            receiptQuantity: 1,

            pickUpDate: null,
            pickUpNumber: null,
            trackingNumber: null,

            documents: {},
            documentsAssigned: false,

            DOCUMENT_TYPES: {
                WAYBILL: 'WAYBILL_LABEL',
                RECEIPT: 'RECEIPT',
                INVOICE: 'INVOICE'
            },

            PATTERNS: {
                numeric: '^(\\s*|\\d+)$'
            },

            //It will be used if the translation service is haven't given translation yet.
            navigateAwayMessage: 'You haven\'t printed your documents! Do you still want to navigate away from this page?'
        });

        var shipmentId = navigationService.getParamFromUrl('shipmentId');

        $window.onbeforeunload = function () {
            return vm.navigateAwayMessage;
        };

        nlsService.getTranslation('shipment.navigating_without_printing').then(function (translation) {
            vm.navigateAwayMessage = translation;
        });

        shipmentPrintService.getDocumentsForPrinting(shipmentId).then(function (response) {
            if (response.data.documents.length) {
                vm.documents = response.data.documents;
                processDocuments();
            } else {
                vm.error = 'errors.print_service_receive_documents';
            }
        })['catch'](function (error) {
            vm.error = error;
        });

        //TODO: rewrite this when the real service will be available
        shipmentPrintService.getTrackingNumber(shipmentId).then(function (trackingNumber) {
            if (trackingNumber) {
                vm.trackingNumber = trackingNumber;
            } else {
                vm.error = 'errors.tracking_number_receive';
            }
        })['catch'](function () {
            vm.error = 'errors.tracking_number_receive';
        });

        //TODO: rewrite this when the real service will be ready
        shipmentPrintService.getPickUpInfo(shipmentId).then(function (response) {
            if (response) {
                vm.pickUpDate = response.pickupDate;
                vm.pickUpNumber = response.confirmationNumber;
            } else {
                vm.error = 'errors.pickup_info_receive';
            }
        });

        function processDocuments() {
            var waybillDocument = vm.documents.find(function (item) {
                return item.documentType === vm.DOCUMENT_TYPES.WAYBILL;
            });
            if (waybillDocument) {
                vm.waybillDocument = waybillDocument.pdfBase64;
            }
            var invoiceDocument = vm.documents.find(function (item) {
                return item.documentType === vm.DOCUMENT_TYPES.INVOICE;
            });
            if (invoiceDocument) {
                vm.invoiceDocument = invoiceDocument.pdfBase64;
            }
            var receiptDocument = vm.documents.find(function (item) {
                return item.documentType === vm.DOCUMENT_TYPES.RECEIPT;
            });
            if (receiptDocument) {
                vm.receiptDocument = receiptDocument.pdfBase64;
            }

            vm.documentsAssigned = true;
        }

        function previewDocument(docName) {

            switch (docName) {
                case vm.DOCUMENT_TYPES.WAYBILL:
                    $scope.previewedDocument = vm.waybillDocument;
                    break;
                case vm.DOCUMENT_TYPES.RECEIPT:
                    $scope.previewedDocument = vm.receiptDocument;
                    break;
                case vm.DOCUMENT_TYPES.INVOICE:
                    $scope.previewedDocument = vm.invoiceDocument;
                    break;
            }

            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div class=ewf-modal__body><ewf-pdf pdf-document={{previewedDocument}}></ewf-pdf></div></div>'
            });
        }

        function print() {

            $window.onbeforeunload = null;

            var pdfArrays = [];
            var waybillPdfArray = pdfBase64ToArray(vm.waybillDocument);
            pdfArrays.push(waybillPdfArray);

            if (vm.invoiceDocument) {
                var invoicePdfArray = pdfBase64ToArray(vm.invoiceDocument);
                pdfArrays.push(invoicePdfArray);

                for (var i = 1; i < vm.invoiceQuantity; i++) {
                    pdfArrays.push(invoicePdfArray);
                }
            }

            for (var i = 1; i < vm.waybillQuantity; i++) {
                pdfArrays.push(waybillPdfArray);
            }

            if (vm.printReceiptSelected) {
                var receiptPdfArray = pdfBase64ToArray(vm.receiptDocument);

                for (var i = 0; i < vm.receiptQuantity; i++) {
                    pdfArrays.push(receiptPdfArray);
                }
            }

            var pagesContext = {
                total: 0,
                rendered: 0,
                canvases: []
            };

            printPdfArrays(pdfArrays, pagesContext);
        }

        function pdfBase64ToArray(pdfBase64) {
            var printingDocument = $window.atob(pdfBase64);
            var arr = new Uint8Array(new ArrayBuffer(printingDocument.length));

            for (var i = 0; i < printingDocument.length; i++) {
                arr[i] = printingDocument.charCodeAt(i);
            }

            return arr;
        }

        function printPdfArrays(pdfArrays, pagesContext) {
            $q.all(pdfArrays.map(function (pdfArr) {
                return $window.PDFJS.getDocument(pdfArr);
            })).then(function (pdfDocuments) {

                pdfDocuments.forEach(function (pdfDocument) {
                    pagesContext.total += pdfDocument.numPages;

                    //TODO: refactor error handling here
                    for (var i = 0; i < pdfDocument.numPages; i++) {
                        pdfDocument.getPage(i + 1).then(callRenderPage)['catch'](fallBackDownloadPDFs);
                    }
                });

                function callRenderPage(page) {
                    renderPage(page, pagesContext);
                }

                function fallBackDownloadPDFs(error) {
                    logService.error(error);
                    vm.error = error;
                    shipmentPrintService.downloadWaybillPdf();
                    shipmentPrintService.downloadInvoicePdf();
                    if (vm.printReceiptSelected) {
                        shipmentPrintService.downloadReceiptPdf();
                    }
                    removeCanvases(pagesContext.canvases);
                }
            })['catch'](function (error) {
                logService.error(error);
                vm.error = error;
                shipmentPrintService.downloadWaybillPdf(shipmentId);
                shipmentPrintService.downloadInvoicePdf(shipmentId);
                if (vm.printReceiptSelected) {
                    shipmentPrintService.downloadReceiptPdf(shipmentId);
                }
                removeCanvases(pagesContext.canvases);
            });
        }

        function renderPage(page, pagesContext) {
            var scale = 1.7;
            var viewport = page.getViewport(scale);

            var canvas = $window.document.createElement('canvas');
            canvas.className = 'print';
            $window.document.body.appendChild(canvas);
            pagesContext.canvases.push(canvas);
            var canvasContext = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = { canvasContext: canvasContext, viewport: viewport };

            var pageRendering = page.render(renderContext);

            var completeCallback = pageRendering._internalRenderTask.callback; //eslint-disable-line no-underscore-dangle
            pageRendering._internalRenderTask.callback = function (error) {
                //eslint-disable-line no-underscore-dangle
                completeCallback.call(this, error);
                pagesContext.rendered++;
                sendToPrinterIfReady(pagesContext);
            };
        }

        function sendToPrinterIfReady(pagesContext) {
            if (pagesContext.rendered === pagesContext.total) {
                sendToPrinter(pagesContext);
            }
        }

        function sendToPrinter(pagesContext) {
            $window.setTimeout(function () {
                $window.print();
                $window.setTimeout(function () {
                    removeCanvases(pagesContext.canvases);
                    navigationService.location('shipment-complete.html?shipmentId=' + shipmentId);
                }, 1);
            }, 500);
        }

        function removeCanvases(canvases) {
            canvases.forEach(function (canvas) {
                $window.document.body.removeChild(canvas);
            });
        }

        function saveAsFavorite() {
            shipmentPrintService.saveAsFavorite(shipmentId).then(function (response) {
                logService.log(response);
            })['catch'](function (err) {
                logService.error(err);
            });
        }
    }
});
//# sourceMappingURL=shipment-print-controller.js.map
