define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ConfirmationDialogController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ConfirmationDialogController.$inject = ['$q', '$rootScope', 'ngDialog'];

    _ewf2['default'].controller('ConfirmationDialogController', ConfirmationDialogController);

    /**
     * Confirmation dialog controller
     *
     * @param $q
     * @param ngDialog
     * @return defered object
     */

    function ConfirmationDialogController($q, $rootScope, ngDialog) {
        var vm = this;
        $rootScope.confirmationDialogCtrl = vm;

        vm.showConfirmationDialog = showConfirmationDialog;
        vm.confirmAction = confirmAction;
        vm.rejectAction = rejectAction;

        function showConfirmationDialog(confirmationMessage, yes, no) {
            vm.message = confirmationMessage;

            if (arguments.length >= 2) {
                vm.yes = yes;
            } else {
                vm.yes = 'Yes';
            }

            if (arguments.length >= 3) {
                vm.no = no;
            } else {
                vm.no = 'No';
            }

            var deferedAction = $q.defer();

            ngDialog.open({
                template: '<div class=\"modal ng-scope visible\" id=modal_confirmAction><form id=form_action-confirm method=GET><h3 class=area__title>{{confirmationDialogCtrl.message}}</h3><a class=btn ng-show=confirmationDialogCtrl.yes ng-click=confirmationDialogCtrl.confirmAction(closeThisDialog)>{{ confirmationDialogCtrl.yes }}</a> <a class=\"btn close-modal\" ng-show=!!confirmationDialogCtrl.no ng-click=confirmationDialogCtrl.rejectAction(closeThisDialog)>{{ confirmationDialogCtrl.no }}</a></form></div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $rootScope
            });

            if (vm.deferedAction) {
                vm.deferedAction.reject('obsolete action');
            }

            vm.deferedAction = deferedAction;
            return deferedAction.promise;
        }

        function confirmAction(closeThisDialog) {
            vm.deferedAction.resolve('User confirmed action');
            closeThisDialog();
            return true;
        }

        function rejectAction(closeThisDialog) {
            vm.deferedAction.reject('User rejected action');
            closeThisDialog();
            return true;
        }
    }
});
//# sourceMappingURL=confirmation-dialog-controller.js.map
