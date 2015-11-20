define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfFormErrorsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfFormErrorsController', EwfFormErrorsController);

    function EwfFormErrorsController() {
        var vm = this;
        vm.errorMessages = [];
        vm.formCtrl = null;
    }
});
//# sourceMappingURL=ewf-form-errors-controller.js.map
