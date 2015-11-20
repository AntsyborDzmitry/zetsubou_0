import ewf from 'ewf';

ConfirmationDialogController.$inject = ['$q', '$rootScope', 'ngDialog'];

ewf.controller('ConfirmationDialogController', ConfirmationDialogController);

/**
 * Confirmation dialog controller
 *
 * @param $q
 * @param ngDialog
 * @return defered object
 */
export default function ConfirmationDialogController($q, $rootScope, ngDialog) {
    const vm = this;
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

        let deferedAction = $q.defer();

        ngDialog.open({
            templateUrl: 'confirmation-dialog.html',
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
