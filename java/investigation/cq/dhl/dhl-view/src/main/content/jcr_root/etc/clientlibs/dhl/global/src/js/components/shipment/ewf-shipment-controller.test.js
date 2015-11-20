import EwfShipmentController from './ewf-shipment-controller';
import ShipmentService from './ewf-shipment-service';
import ShipmentFlowService from './ewf-shipment-flow-service';
import EwfShipmentStepBaseController from './ewf-shipment-step-base-controller';
import NavigationService from '../../services/navigation-service';
import UserService from '../../services/user-service';
import 'angularMocks';

describe('ewfShipmentController', () => {
    let sut;
    let $scope;
    let deferred;
    let $location;
    let nlsService;
    let userService;
    let shipmentService;
    let navigationService;
    let shipmentFlowService;


    const SHIPMENT_ID = 1;

    beforeEach(inject((_$rootScope_, _$location_, $q) => {
        $scope = _$rootScope_.$new();
        $location = _$location_;

        deferred = $q.defer();

        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.getSavedShipmentData.and.returnValue(deferred.promise);

        shipmentFlowService = jasmine.mockComponent(new ShipmentFlowService());
        shipmentFlowService.getStepsIncompleteData.and.callThrough();

        userService = jasmine.mockComponent(new UserService());
        nlsService = jasmine.createSpyObj('nlsService', ['getDictionary']);
        navigationService = jasmine.mockComponent(new NavigationService());

        navigationService.getParamFromUrl.and.returnValue(SHIPMENT_ID);

        sut = new EwfShipmentController($scope,
            $location,
            userService,
            nlsService,
            navigationService,
            shipmentFlowService,
            shipmentService);
    }));

    describe('#constructor', () => {
        it('should define public interface', () => {
            expect(sut.init).toEqual(jasmine.any(Function));
            expect(sut.addStep).toEqual(jasmine.any(Function));
        });
    });

    describe('#init', () => {
        it('should subscribe for url hash change event', () => {
            spyOn($scope, '$on');
            sut.init();

            expect($scope.$on).toHaveBeenCalledWith('$locationChangeSuccess', jasmine.any(Function));
        });

        it('should set url hash to a name of first step', () => {
            spyOn($location, 'hash');
            sut.addStep(new EwfShipmentStepBaseController('step-1'));
            sut.addStep(new EwfShipmentStepBaseController('step-2'));
            sut.init();
            expect($location.hash).toHaveBeenCalledWith('step-1');
        });

        it('should pre-load user information', () => {
            sut.init();
            expect(userService.whoAmI).toHaveBeenCalled();
        });

        it('should pre-load localization dictionary for shipment', () => {
            sut.init();
            expect(nlsService.getDictionary).toHaveBeenCalledWith('shipment');
        });

        it('should check if shipment id have been given as GET parameter', () => {
            sut.init();
            expect(navigationService.getParamFromUrl).toHaveBeenCalledWith('shipmentId');
        });

        it('should get saved shipment data if shipment id have been given', () => {
            sut.init();
            expect(shipmentService.getSavedShipmentData).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should iterate through the steps and trigger loading shipment data to them', () => {
            const step = new EwfShipmentStepBaseController('step-name');
            step.loadShipmentData = jasmine.createSpy('loadShipmentData');

            sut.addStep(step);
            sut.init();

            deferred.resolve({data: 'some_data'});
            $scope.$apply();

            expect(step.loadShipmentData).toHaveBeenCalled();
        });
    });

    describe('#addStep', () => {
        let exception;
        let callAddStep;
        let stepCtrl;

        beforeEach(() => {
            exception = new Error('stepCtrl should be an instance of EwfShipmentStepBaseController');
            callAddStep = () => {
                sut.addStep(stepCtrl);
            };
        });

        it('should accept instance of EwfShipmentStepBaseController', () => {
            stepCtrl = new EwfShipmentStepBaseController('step-name');
            expect(callAddStep).not.toThrow(exception);
        });

        it('should throw an exception if controller not implements shipment step interface', () => {
            stepCtrl = jasmine.any(Object);
            expect(callAddStep).toThrow(exception);
        });

        it('should set next callback for step', () => {
            stepCtrl = new EwfShipmentStepBaseController('step-name');
            spyOn(stepCtrl, 'setNextCallback');

            sut.addStep(stepCtrl);

            expect(stepCtrl.setNextCallback).toHaveBeenCalledWith(jasmine.any(Function));

        });

    });

    describe('#getStepsIncompleteData', () => {
        it('should iterate through the steps and save their incomplete data', () => {
            const step = new EwfShipmentStepBaseController('step-name');
            step.getCurrentIncompleteData = jasmine.createSpy();

            sut.init();
            sut.addStep(step);

            shipmentFlowService.getStepsIncompleteData();
            expect(step.getCurrentIncompleteData).toHaveBeenCalled();
        });
    });

    it('should check if shipment main flow is visible by default', () => {
        const flowVisibility = sut.isMainFlowVisible();

        expect(flowVisibility).toEqual(true);
    });

    it('should change visibility of main shipment flow', () => {
        const flowVisibility = sut.isMainFlowVisible();
        sut.triggerMainFlowVisibility();

        expect(sut.isMainFlowVisible()).toEqual(!flowVisibility);
    });
});
