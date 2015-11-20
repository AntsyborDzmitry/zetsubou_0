define(['exports', 'module', 'ewf', './../../services/attrs-service'], function (exports, module, _ewf, _servicesAttrsService) {
    'use strict';

    module.exports = EwfProgressBarController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('ewfProgressBarController', EwfProgressBarController);

    EwfProgressBarController.$inject = ['$scope', '$attrs', 'attrsService'];

    function EwfProgressBarController($scope, $attrs, attrsService) {
        var vm = this;

        attrsService.track($scope, $attrs, 'ewfProgress', vm, null, 'progress');
    }
});
//# sourceMappingURL=ewf-progress-bar-controller.js.map
