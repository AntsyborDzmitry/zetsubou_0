import 'angularMocks';
import EwfNonEmptyValidator from './ewf-non-empty-validator-directive';

describe('ewfNonEmptyValidator', () => {
    let sut;
    let scope;
    let attrs;
    let ngModelCtrl;

    function callSutPreLink() {
        sut.link.pre(scope, null, attrs, ngModelCtrl);
    }

    beforeEach(inject(($rootScope) => {
        scope = $rootScope.$new();

        attrs = {
            ngModel: 'model'
        };
        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setValidity']);

        sut = new EwfNonEmptyValidator();
    }));

    describe('#preLink', () => {
        it('should set invalid when model is empty', () => {
            scope.model = {};
            callSutPreLink();
            scope.$apply();

            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('nonEmpty', false);
        });

        it('should set invalid when model properties are empty', () => {
            scope.model = {
                prop1: false,
                prop2: null,
                prop3: undefined
            };
            callSutPreLink();
            scope.$apply();

            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('nonEmpty', false);
        });

        it('should set valid when at least one of the model properties is not empty', () => {
            scope.model = {
                prop1: false,
                prop2: true,
                prop3: undefined
            };
            callSutPreLink();
            scope.$apply();

            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('nonEmpty', true);
        });
    });
});
