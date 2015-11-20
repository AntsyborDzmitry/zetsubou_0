define(['exports', 'ewf', './confirmation-dialog-controller'], function (exports, _ewf, _confirmationDialogController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ConfirmationDialogController = _interopRequireDefault(_confirmationDialogController);

    _ewf2['default'].service('confirmationDialogService', confirmationDialogService);

    confirmationDialogService.$inject = ['$controller'];

    /**
     * Confirmation service. Creates controller instance to show confirmation message
     *
     * @param {Object} $q - defered angular libs
     * @param {Object} $controller - used to instantiate new controller
     * @param {Object} ngDialog - ngDialog lib
     */
    function confirmationDialogService($controller) {

        this.showConfirmationDialog = function (confirmationMessage) {
            var controller = $controller(_ConfirmationDialogController['default']);
            return controller.showConfirmationDialog(confirmationMessage);
        };
    }
});
//# sourceMappingURL=confirmation-dialog-service.js.map
