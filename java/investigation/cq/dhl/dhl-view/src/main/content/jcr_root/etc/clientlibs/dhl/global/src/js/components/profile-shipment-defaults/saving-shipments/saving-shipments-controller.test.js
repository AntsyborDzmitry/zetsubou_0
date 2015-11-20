import SavingShipmentsController from './saving-shipments-controller';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('SavingShipmentsController', function() {
    let sut;
    let $q;
    let $timeout;
    let profileShipmentService;
    let navigationServiceMock;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        profileShipmentService = jasmine.createSpyObj(
            'profileShipmentService',
            ['getDefaultSavingShipment', 'updateDefaultSavingShipment']
        );
        profileShipmentService = jasmine.createSpyObj(
            'profileShipmentService',
            [
                'getDefaultSavingShipment',
                'updateDefaultSavingShipment'
            ]);
        navigationServiceMock = jasmine.mockComponent(new NavigationService());

        navigationServiceMock.getParamFromUrl.and.returnValue('section');

        sut = new SavingShipmentsController(profileShipmentService, navigationServiceMock);
        spyOn(sut, 'resetChanges').and.callThrough();
    }));

    describe('#constructor', () => {
        it('should set isEditing flag to false by default', () => {
            expect(sut.isEditing).toBe(false);
        });
        it('should set saveIncompleteShipments flag to false by default', () => {
            expect(sut.saveIncompleteSavings).toBe(false);
        });
    });

    describe('#toggleLayout', () => {
        it('Should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = true;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(false);
        });
    });

    describe('#preloadDefaultSavingShipment', () => {
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            profileShipmentService.getDefaultSavingShipment.and.returnValue(defer.promise);
        });

        it('should load saving shipment data with service', () => {
            sut.preloadDefaultSavingShipment();
            expect(profileShipmentService.getDefaultSavingShipment).toHaveBeenCalled();
        });

        it('should store defaults saving shipment', () => {
            const data = {
                saveIncompleteSavings: true
            };

            sut.saveIncompleteSavings = false;
            sut.preloadDefaultSavingShipment();
            defer.resolve(data);
            $timeout.flush();

            expect(sut.saveIncompleteSavings).toBe(data.saveIncompleteSavings);
        });

        it('should save response for restoring changes', () => {
            const data = {
                saveIncompleteSavings: true
            };
            sut.saveIncompleteSavings = false;
            sut.preloadDefaultSavingShipment();
            defer.resolve(data);
            $timeout.flush();
            expect(sut.serverData).toBe(data.saveIncompleteSavings);
        });
    });

    describe('#updateDefaultSavingShipment', () => {
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            profileShipmentService.updateDefaultSavingShipment.and.returnValue(defer.promise);
        });

        it('should update saving shipment data with service', () => {
            sut.saveIncompleteSavings = true;
            sut.updateDefaultSavingShipment();
            expect(profileShipmentService.updateDefaultSavingShipment)
                .toHaveBeenCalledWith({saveIncompleteSavings: sut.saveIncompleteSavings});
            expect(profileShipmentService.updateDefaultSavingShipment)
                .toHaveBeenCalledWith({saveIncompleteSavings: sut.saveIncompleteSavings});
        });

        it('should update server settings', () => {
            sut.serverData = true;
            sut.saveIncompleteSavings = false;
            sut.updateDefaultSavingShipment();
            expect(sut.serverData).toEqual(false);
        });
    });

    describe('#preloadSectionFromUrl', () => {
        it('should load data from url', () => {
            sut.preloadSectionFromUrl();
            expect(navigationServiceMock.getParamFromUrl).toHaveBeenCalled();
        });
    });

    describe('#toggleLayout', () => {
        it('Should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = false;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });

    describe('#toggleLayout', () => {
        it('Should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = false;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });

    describe('#resetChanges', () => {
        it('should reset changes that was done by user', () => {
            sut.serverData = true;
            sut.saveIncompleteSavings = false;
            sut.resetChanges();
            expect(sut.saveIncompleteSavings).toBeTruthy();
        });
    });

    describe('#exitFromEditing', () => {
        it('should toggle layout and reset changes', () => {
            sut.isEditing = true;
            sut.exitFromEditing();
            expect(sut.isEditing).toBeFalsy();
            expect(sut.resetChanges).toHaveBeenCalled();
        });
    });
});
