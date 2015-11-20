define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfFieldController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfFieldController', EwfFieldController);

    function EwfFieldController() {
        var vm = this;

        //properties
        vm.name = null;
        vm.ewfFormCtrl = null;
    }
});
//# sourceMappingURL=ewf-field-controller.js.map
