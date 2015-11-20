import EwfClick from './ewf-click-directive';
import EwfClickController from './ewf-click-controller';
import 'angularMocks';

describe('ewfClick', () => {
    let sut;
    let ewfClickController;
    let $scope, elem, attrs, $q, $timeout;
    let queryProcessing = false;
    let defer;

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        $q = _$q_;
        $timeout = _$timeout_;
        defer = $q.deffer;

        ewfClickController = jasmine.mockComponent(new EwfClickController());

        ewfClickController.handleClickFunction.and.returnValue(defer.promise);

        sut = new EwfClick($q, $timeout);
    }));

    function preLinkInit() {
        const ctrl = ewfClickController;
        sut.link.pre($scope, elem, attrs, ctrl);
    }

    describe('preLink function', () => {
        beforeEach(() => {
            preLinkInit();
        });

        it('should set queryProcessing to false on preLink function call', () => {
            expect(queryProcessing).toEqual(true);
        });

        it('should change state of button to active when query processed', () => {
            defer.resolve();
            $timeout.flush();
            expect(queryProcessing).toBe(false);
            expect(angular.element.removeClass).toHaveBeenCalled();
        });
    });
});
