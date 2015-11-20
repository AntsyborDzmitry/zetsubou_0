import './shipment-print-service';
import './../../../services/modal/modal-service';
import PDFJS from 'pdfjs';

ShipmentPrintController.$inject = [
    '$scope',
    'modalService',
    'logService',
    'shipmentPrintService',
    '$window',
    '$q',
    'navigationService',
    'nlsService'
];

// TODO: wrong inject order
// TODO: check all this file: controllers should not work with raw http response
export default function ShipmentPrintController(
    $scope,
    modalService,
    logService,
    shipmentPrintService,
    $window,
    $q,
    navigationService,
    nlsService) {
    const vm = this;

    $window.PDFJS = PDFJS || $window.PDFJS; // Workaround for PDFJS not exposing itself through the import variable
                                            // TODO: remove this?

    Object.assign(vm, {
        previewDocument,
        print,
        saveAsFavorite,

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


    const shipmentId = navigationService.getParamFromUrl('shipmentId');

    $window.onbeforeunload = () => vm.navigateAwayMessage;

    nlsService.getTranslation('shipment.navigating_without_printing')
        .then((translation) => {
            vm.navigateAwayMessage = translation;
        });

    shipmentPrintService.getDocumentsForPrinting(shipmentId)
        .then((response) => {
            if (response.data.documents.length) {
                vm.documents = response.data.documents;
                processDocuments();
            } else {
                vm.error = 'errors.print_service_receive_documents';
            }
        })
        .catch((error) => {
            vm.error = error;
        });

    //TODO: rewrite this when the real service will be available
    shipmentPrintService.getTrackingNumber(shipmentId)
        .then((trackingNumber) => {
            if (trackingNumber) {
                vm.trackingNumber = trackingNumber;
            } else {
                vm.error = 'errors.tracking_number_receive';
            }
        })
        .catch(() => {
            vm.error = 'errors.tracking_number_receive';
        });

    //TODO: rewrite this when the real service will be ready
    shipmentPrintService.getPickUpInfo(shipmentId)
        .then((response) => {
            if (response) {
                vm.pickUpDate = response.pickupDate;
                vm.pickUpNumber = response.confirmationNumber;
            } else {
                vm.error = 'errors.pickup_info_receive';
            }
        });

    function processDocuments() {
        const waybillDocument = vm.documents.find((item) => item.documentType === vm.DOCUMENT_TYPES.WAYBILL);
        if (waybillDocument) {
            vm.waybillDocument = waybillDocument.pdfBase64;
        }
        const invoiceDocument = vm.documents.find((item) => item.documentType === vm.DOCUMENT_TYPES.INVOICE);
        if (invoiceDocument) {
            vm.invoiceDocument = invoiceDocument.pdfBase64;
        }
        const receiptDocument = vm.documents.find((item) => item.documentType === vm.DOCUMENT_TYPES.RECEIPT);
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
            templateUrl: 'shipment-print-preview-dialog.html'
        });
    }

    function print() {

        $window.onbeforeunload = null;

        const pdfArrays = [];
        const waybillPdfArray = pdfBase64ToArray(vm.waybillDocument);
        pdfArrays.push(waybillPdfArray);

        if (vm.invoiceDocument) {
            const invoicePdfArray = pdfBase64ToArray(vm.invoiceDocument);
            pdfArrays.push(invoicePdfArray);

            for (let i = 1; i < vm.invoiceQuantity; i++) {
                pdfArrays.push(invoicePdfArray);
            }

        }

        for (let i = 1; i < vm.waybillQuantity; i++) {
            pdfArrays.push(waybillPdfArray);
        }

        if (vm.printReceiptSelected) {
            const receiptPdfArray = pdfBase64ToArray(vm.receiptDocument);

            for (let i = 0; i < vm.receiptQuantity; i++) {
                pdfArrays.push(receiptPdfArray);
            }
        }

        const pagesContext = {
            total: 0,
            rendered: 0,
            canvases: []
        };

        printPdfArrays(pdfArrays, pagesContext);

    }

    function pdfBase64ToArray(pdfBase64) {
        const printingDocument = $window.atob(pdfBase64);
        const arr = new Uint8Array(new ArrayBuffer(printingDocument.length));

        for (let i = 0; i < printingDocument.length; i++) {
            arr[i] = printingDocument.charCodeAt(i);
        }

        return arr;
    }

    function printPdfArrays(pdfArrays, pagesContext) {
        $q.all(pdfArrays.map((pdfArr) => $window.PDFJS.getDocument(pdfArr)))
            .then((pdfDocuments) => {

                pdfDocuments.forEach((pdfDocument) => {
                    pagesContext.total += pdfDocument.numPages;

                    //TODO: refactor error handling here
                    for (let i = 0; i < pdfDocument.numPages; i++) {
                        pdfDocument.getPage(i + 1)
                            .then(callRenderPage)
                            .catch(fallBackDownloadPDFs);
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

            })
            .catch((error) => {
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
        const scale = 1.7;
        const viewport = page.getViewport(scale);

        const canvas = $window.document.createElement('canvas');
        canvas.className = 'print';
        $window.document.body.appendChild(canvas);
        pagesContext.canvases.push(canvas);
        const canvasContext = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {canvasContext, viewport};

        const pageRendering = page.render(renderContext);

        const completeCallback = pageRendering._internalRenderTask.callback; //eslint-disable-line no-underscore-dangle
        pageRendering._internalRenderTask.callback = function(error) { //eslint-disable-line no-underscore-dangle
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
        $window.setTimeout(() => {
            $window.print();
            $window.setTimeout(() => {
                removeCanvases(pagesContext.canvases);
                navigationService.location(`shipment-complete.html?shipmentId=${shipmentId}`);
            }, 1);
        }, 500);
    }

    function removeCanvases(canvases) {
        canvases.forEach((canvas) => {
            $window.document.body.removeChild(canvas);
        });
    }

    function saveAsFavorite() {
        shipmentPrintService.saveAsFavorite(shipmentId)
            .then((response) => {
                logService.log(response);
            })
            .catch((err) => {
                logService.error(err);
            });
    }

}
