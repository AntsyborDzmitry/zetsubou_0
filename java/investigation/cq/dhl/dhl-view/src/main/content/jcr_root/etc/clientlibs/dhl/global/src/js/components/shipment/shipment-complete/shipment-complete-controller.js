import './../../../services/modal/modal-service';
import NotificationsDialogController from './notifications-dialog/notifications-dialog-controller';
import SaveAsFavoriteDialogController from './save-as-favorite/save-as-favorite-dialog-controller';

ShipmentCompleteController.$inject = ['modalService'];

export default function ShipmentCompleteController(modalService) {
    const vm = this;

    Object.assign(vm, {
        showNotificationsDialog,
        showSaveAsFavoriteDialog
    });

    function showNotificationsDialog() {
        modalService.showDialog({
            controller: NotificationsDialogController,
            controllerAs: 'notificationsDialogCtrl',
            templateUrl: 'notifications-dialog/notifications-dialog-layout.html'
        });
    }

    function showSaveAsFavoriteDialog() {
        modalService.showDialog({
            controller: SaveAsFavoriteDialogController,
            controllerAs: 'saveAsFavoriteDialogCtrl',
            templateUrl: 'save-as-favorite/save-as-favorite-dialog-layout.html'
        });
    }
}
