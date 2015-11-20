import ewf from 'ewf';
import ConfirmationDialogController from './confirmation-dialog-controller';

ewf.service('confirmationDialogService', confirmationDialogService);

confirmationDialogService.$inject = ['$controller'];

/**
 * Confirmation service. Creates controller instance to show confirmation message
 *
 * @param {Object} $q - defered angular libs
 * @param {Object} $controller - used to instantiate new controller
 * @param {Object} ngDialog - ngDialog lib
 */
function confirmationDialogService($controller) {

    this.showConfirmationDialog = function(confirmationMessage) {
        let controller = $controller(ConfirmationDialogController);
        return controller.showConfirmationDialog(confirmationMessage);
    };
}
