import PDFJS from 'pdfjs';
EwfPdfController.$inject = ['$scope', '$window', 'logService'];
export default function EwfPdfController($scope, $window, logService) {
    const vm = this;

    const CANVAS_WIDTH = 420;

    vm.pdfDocument = $window.atob($scope.$parent.previewedDocument);

    //TODO: add polyfills for ie 9 for Uint8Array, ArrayBuffer and atob
    //https://github.com/inexorabletash/polyfill/blob/master/typedarray.js
    //https://github.com/davidchambers/Base64.js/blob/master/base64.js
    const arr = new Uint8Array(new ArrayBuffer(vm.pdfDocument.length));

    for (let i = 0; i < vm.pdfDocument.length; i++) {
        arr[i] = vm.pdfDocument.charCodeAt(i);
    }

    $window.PDFJS = PDFJS || $window.PDFJS;
    $window.PDFJS.getDocument(arr)
        .then(function(pdf) {
            pdf.getPage(1)
                .then(function(page) {
                    const viewport = page.getViewport(CANVAS_WIDTH / page.getViewport(1.0).width);

                    const canvas = vm.canvas[0];
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport
                    };
                    page.render(renderContext);
                })
                .catch(function(err) {
                    logService.log(err);
                });
        })
        .catch(function(err) {
            logService.log(err);
        });
}
