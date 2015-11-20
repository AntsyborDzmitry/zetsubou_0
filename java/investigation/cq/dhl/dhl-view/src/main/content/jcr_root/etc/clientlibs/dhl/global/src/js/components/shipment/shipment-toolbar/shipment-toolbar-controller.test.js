import ShipmentToolbarController from './shipment-toolbar-controller';
import ModalService from './../../../services/modal/modal-service';
import NavigationService from './../../../services/navigation-service';
import ShipmentService from './../ewf-shipment-service';
import ShipmentFlowService from './../ewf-shipment-flow-service';
import EnhancedInvoiceModel from './../enhanced-invoice/enhanced-invoice-model';
import NlsService from './../../../services/nls-service';
import ItemAttributesModel from './../shipment-type/item-attributes/item-attributes-model';
import 'angularMocks';

describe('ShipmentToolbarController', () => {
    let sut;
    let modal;
    let $scope, $filter;
    let responseMock;
    let nlsService, modalService, shipmentService, navigationService, shipmentFlowService;
    let enhancedInvoiceModel, itemAttributesModel;

    beforeEach(module('ewf'));
    beforeEach(inject(($rootScope, $q, _$filter_) => {
        $scope = $rootScope.$new();
        responseMock = $q.defer();

        modalService = jasmine.mockComponent(new ModalService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        navigationService = jasmine.mockComponent(new NavigationService());
        shipmentFlowService = jasmine.mockComponent(new ShipmentFlowService());

        $filter = _$filter_;
        nlsService = jasmine.mockComponent(new NlsService());
        nlsService.getTranslationSync.and.returnValue('translation');
        itemAttributesModel = jasmine.mockComponent(new ItemAttributesModel());
        const servicesForModel = [$filter, nlsService, itemAttributesModel];
        enhancedInvoiceModel = jasmine.mockComponent(new EnhancedInvoiceModel(...servicesForModel));

        modal = jasmine.createSpyObj('modal', ['close']);
        modalService.showDialog.and.returnValue(modal);

        shipmentService.saveShipmentForLater.and.returnValue(responseMock.promise);

        sut = new ShipmentToolbarController(
            $scope,
            navigationService,
            shipmentService,
            shipmentFlowService,
            modalService,
            enhancedInvoiceModel
        );
    }));

    describe('#showSaveForLaterDialog', () => {
        it('should open modal dialog', () => {
            const expectedParams = {
                template: jasmine.any(String),
                scope: jasmine.any(Object)
            };

            sut.showSaveForLaterDialog();

            expect(modalService.showDialog).toHaveBeenCalledWith(jasmine.objectContaining(expectedParams));
        });
    });

    describe('#saveShipmentForLater', () => {
        it('should run saving process', () => {
            sut.shipmentName = 'some name';
            sut.saveShipmentForLater();

            const expectedName = sut.shipmentName;

            expect(shipmentService.saveShipmentForLater).toHaveBeenCalledWith(expectedName);
        });

        it('should close modal window when saved successfully', () => {
            sut.shipmentName = 'some name';

            sut.showSaveForLaterDialog();
            sut.saveShipmentForLater();

            responseMock.resolve();

            $scope.$apply();
            expect(modal.close).toHaveBeenCalled();
        });

        it('should redirect to manage shipments page when saved successfully', () => {
            sut.shipmentName = 'some name';

            sut.showSaveForLaterDialog();
            sut.saveShipmentForLater();

            responseMock.resolve();

            $scope.$apply();
            expect(navigationService.location).toHaveBeenCalledWith('manage-shipments.html');
        });

        it('should handle saving error ', () => {
            sut.shipmentName = 'some name';
            sut.saveShipmentForLater();

            const reason = {
                errors: ['dictionary.message_key']
            };
            responseMock.reject(reason);

            $scope.$apply();
            expect(sut.errors).toBe(reason.errors);
        });
    });

    describe('#cancelEnhancedInvoiceChanges', () => {
        let shipmentCtrl;

        beforeEach(() => {
            shipmentCtrl = jasmine.createSpyObj('shipmentCtrl', ['triggerMainFlowVisibility']);
            sut.cancelEnhancedInvoiceChanges(shipmentCtrl);
        });

        it('should trigger enhanced-invoice-model reset', () => {
            expect(enhancedInvoiceModel.resetModel).toHaveBeenCalled();
        });

        it('should trigger main flow visibility', () => {
            expect(shipmentCtrl.triggerMainFlowVisibility).toHaveBeenCalled();
        });
    });
});
