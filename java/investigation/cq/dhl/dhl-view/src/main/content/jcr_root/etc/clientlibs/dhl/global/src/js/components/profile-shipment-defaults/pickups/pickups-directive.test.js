import pickupsDirective from './pickups-directive';
import 'angularMocks';

describe('pickupsDirective', () => {
    let sut;
    let $scope;
    let $q;
    let $timeout;
    let ctrl;
    let deferedGet;
    let elementMock;

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;

        deferedGet = $q.defer();
        $timeout = _$timeout_;
        ctrl = jasmine.createSpyObj('PickupsController', ['preloadSectionFromUrl', 'init', 'savePickupsSettings']);
        ctrl.rangeSliderOptions = {name: 'some options for rangeSlider'};
        ctrl.pickupSettings = {name: 'mock pickup settings'};

        elementMock = jasmine.createSpyObj('element', ['find', 'click', 'text', 'attr', 'ionRangeSlider']);
        elementMock.find.and.returnValue(elementMock);
        elementMock.text.and.returnValue('some element text');
        ctrl.init.and.returnValue(deferedGet.promise);

        sut = new pickupsDirective();
    }));

    it('should call controller to pre-load settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadSectionFromUrl).toHaveBeenCalled();
    });

    describe('"post" link function', () => {
        beforeEach(() => {
            sut.link.post($scope, elementMock, {}, ctrl);
            deferedGet.resolve({});
            $timeout.flush();
        });

        it('should call controller to post-load settings', () => {
            expect(ctrl.init).toHaveBeenCalled();
        });

        it('should init ionRangeSlider', () => {
            expect(elementMock.find).toHaveBeenCalledWith('#range-slider');
            expect(elementMock.ionRangeSlider).toHaveBeenCalledWith(ctrl.rangeSliderOptions);
        });

        it('should add attrs to ".irs-from" and ".irs-to"', () => {
           expect(elementMock.find).toHaveBeenCalledWith('.irs-from');
           expect(elementMock.find).toHaveBeenCalledWith('.irs-to');
           expect(elementMock.attr).toHaveBeenCalledWith('data-content', jasmine.any(String));
        });

        it('should add click handler to "button.btn"', () => {
            expect(elementMock.find).toHaveBeenCalledWith('button.btn');
            expect(elementMock.click).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should savePickupsSettings on click', () => {
            const clickHandler = elementMock.click.calls.mostRecent().args[0];
            clickHandler();
            expect(ctrl.savePickupsSettings).toHaveBeenCalledWith(ctrl.pickupSettings);
        });
    });
});
