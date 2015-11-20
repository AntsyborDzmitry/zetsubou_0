define(['exports', 'ewf', './ewf-pdf-controller'], function (exports, _ewf, _ewfPdfController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfPdfController = _interopRequireDefault(_ewfPdfController);

    _ewf2['default'].directive('ewfPdf', function () {
        return {
            restrict: 'E',
            controller: _EwfPdfController['default'],
            controllerAs: 'pdfCtrl',
            template: '<canvas id=pdf></canvas>',
            link: {
                post: postLink
            }
        };

        //TODO: write test for postLink
        function postLink(scope, element, attrs, ctrl) {
            ctrl.canvas = element.find('canvas');
        }
    });
});
//# sourceMappingURL=ewf-pdf-directive.js.map
