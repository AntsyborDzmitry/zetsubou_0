import ShipmentCompleteController from './shipment-complete-controller';
import ModalService from './../../../services/modal/modal-service';
import NotificationsDialogController from './notifications-dialog/notifications-dialog-controller';
import SaveAsFavoriteDialogController from './save-as-favorite/save-as-favorite-dialog-controller';
import 'angularMocks';

describe('ShipmentCompleteController', () => {
    let sut;
    let modalService;

    beforeEach(() => {
        modalService = jasmine.mockComponent(new ModalService());

        sut = new ShipmentCompleteController(modalService);
    });

    describe('#showNotificationsDialog', () => {
        beforeEach(() => {
            sut.showNotificationsDialog();
        });

        it('should call showDialog method of modalService', () => {
            expect(modalService.showDialog).toHaveBeenCalledWith({
                controller: NotificationsDialogController,
                controllerAs: 'notificationsDialogCtrl',
                template: jasmine.any(String)
            });
        });
    });

    describe('#showSaveAsFavoriteDialog', () => {
        beforeEach(() => {
            sut.showSaveAsFavoriteDialog();
        });

        it('should call showDialog method of modalService', () => {
            expect(modalService.showDialog).toHaveBeenCalledWith({
                controller: SaveAsFavoriteDialogController,
                controllerAs: 'saveAsFavoriteDialogCtrl',
                template: jasmine.any(String)
            });
        });
    });
});
