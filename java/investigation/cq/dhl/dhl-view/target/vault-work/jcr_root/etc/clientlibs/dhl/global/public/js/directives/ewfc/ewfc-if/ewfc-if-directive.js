define(['exports', 'module', 'ewf', './ewfc-if-controller'], function (exports, module, _ewf, _ewfcIfController) {
    'use strict';

    module.exports = ewfcIf;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfcIfController = _interopRequireDefault(_ewfcIfController);

    _ewf2['default'].directive('ewfcIf', ewfcIf);

    ewfcIf.$inject = ['ngIfDirective'];

    function ewfcIf(ngIfDirective) {
        var ngIf = ngIfDirective[0];

        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            controller: _EwfcIfController['default'],
            link: function link($scope, $element, $attr, controller) {
                var ciRequest = $attr.ewfcIf;

                controller.setRenderFunction(render($attr, arguments));
                controller.setValue(ciRequest);
            }
        };

        function render($attr, args) {
            return function (response) {
                $attr.ngIf = function () {
                    return response;
                };
                ngIf.link.apply(ngIf, args);
            };
        }
    }
});
//# sourceMappingURL=ewfc-if-directive.js.map
