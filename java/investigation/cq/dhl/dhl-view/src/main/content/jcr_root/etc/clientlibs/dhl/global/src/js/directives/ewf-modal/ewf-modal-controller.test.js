import EwfModalController from './ewf-modal-controller';
import 'angularMocks';

describe('EwfModalController', () => {
    let sut;
    let $scope, $element, $transclude;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        $scope.$parent = {
            $close: jasmine.createSpy('$close'),
            $dismiss: jasmine.createSpy('$dismiss'),
            $new: () => {
                return {};
            }
        };

        $element = null;

        $transclude = jasmine.createSpy('$transclude');

        sut = new EwfModalController($scope, $element, $transclude);
    }));

    it('should be properly initialized', () => {
        expect($transclude).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
    });

    describe('#close', () => {
        it('should call $close method of $scope.$parent', () => {
            sut.close();
            expect($scope.$parent.$close).toHaveBeenCalled();
        });
    });

    describe('#dismiss', () => {
        it('should call $dismiss methos of $scope.$parent', () => {
            sut.dismiss();
            expect($scope.$parent.$dismiss).toHaveBeenCalled();
        });
    });
});
