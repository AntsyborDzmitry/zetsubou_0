define(['exports', 'module', 'pdfjs'], function (exports, module, _pdfjs) {
    'use strict';

    module.exports = EwfPdfController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _PDFJS = _interopRequireDefault(_pdfjs);

    EwfPdfController.$inject = ['$scope', '$window', 'logService'];

    function EwfPdfController($scope, $window, logService) {
        var vm = this;

        var CANVAS_WIDTH = 420;

        vm.pdfDocument = $window.atob($scope.$parent.previewedDocument);

        //TODO: add polyfills for ie 9 for Uint8Array, ArrayBuffer and atob
        //https://github.com/inexorabletash/polyfill/blob/master/typedarray.js
        //https://github.com/davidchambers/Base64.js/blob/master/base64.js
        var arr = new Uint8Array(new ArrayBuffer(vm.pdfDocument.length));

        for (var i = 0; i < vm.pdfDocument.length; i++) {
            arr[i] = vm.pdfDocument.charCodeAt(i);
        }

        $window.PDFJS = _PDFJS['default'] || $window.PDFJS;
        $window.PDFJS.getDocument(arr).then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var viewport = page.getViewport(CANVAS_WIDTH / page.getViewport(1.0).width);

                var canvas = vm.canvas[0];
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            })['catch'](function (err) {
                logService.log(err);
            });
        })['catch'](function (err) {
            logService.log(err);
        });
    }
});
//# sourceMappingURL=ewf-pdf-controller.js.map
