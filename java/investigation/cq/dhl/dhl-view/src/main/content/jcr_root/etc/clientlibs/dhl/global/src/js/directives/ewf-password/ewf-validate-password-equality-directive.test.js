import EwfValidatePasswordEquality from './ewf-validate-password-equality-directive';
import InputController from './../ewf-input/ewf-input-controller';
import 'angularMocks';

describe('ewfValidatePasswordEquality', () => {
    let sut;
    let $scope;
    let element;
    let attrs;
    let inputCtrl;
    let ngModelCtrl;

    const errorMessage = 'errors.provided_passwords_do_not_match';

    function callPostLink() {
        sut.link.post($scope, element, attrs, [inputCtrl, ngModelCtrl]);
    }

    function applyValues(value1, value2) {
        $scope.$apply(() => {
            $scope.password = value1;
            ngModelCtrl.$viewValue = value2;
        });
    }

    beforeEach(inject((_$rootScope_, _$q_) => {
        $scope = _$rootScope_.$new();

        attrs = {};

        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setValidity']);
        ngModelCtrl.$viewValue = '';
        $scope.password = '';

        inputCtrl = jasmine.mockComponent(new InputController({}, _$q_));

        sut = new EwfValidatePasswordEquality();
    }));

    describe('#postLink', () => {
        it('should watch the scope', () => {

            spyOn($scope, '$watch');

            attrs.ewfValidatePasswordEquality =
                `{passwordField: \'password\', operation: \'matches\', errorMessage: \'${errorMessage}\'}`;
            callPostLink();

            expect($scope.$watch).toHaveBeenCalled();
        });

        it(`should invalidate model and add error message if passwords not match
                (different values and match operation)`, () => {

            const operation = 'matches';
            attrs.ewfValidatePasswordEquality =
                `{passwordField: \'password\', operation: \'${operation}\', errorMessage: \'${errorMessage}\'}`;
            callPostLink();
            applyValues('password1', 'password2');

            expect(inputCtrl.addErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith(operation, false);
        });

        it(`should invalidate model and do\'nt add error message if passwords are the same
                (same values and match operation)`, () => {

            const operation = 'matches';
            attrs.ewfValidatePasswordEquality =
                `{passwordField: \'password\', operation: \'${operation}\', errorMessage: \'${errorMessage}\'}`;
            callPostLink();
            applyValues('password', 'password');

            expect(inputCtrl.addErrorMessage).not.toHaveBeenCalled();
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith(operation, true);
        });

        it(`should invalidate model and do\'nt add error message if passwords not match
                (different values and differs operation)`, () => {

            const operation = 'differs';
            attrs.ewfValidatePasswordEquality =
                `{passwordField: \'password\', operation: \'${operation}\', errorMessage: \'${errorMessage}\'}`;
            callPostLink();
            applyValues('password1', 'password2');

            expect(inputCtrl.addErrorMessage).not.toHaveBeenCalled();
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith(operation, true);
        });

        it(`should invalidate model and add error message if passwords are the same
                (same values and differs operation)`, () => {

            const operation = 'differs';
            attrs.ewfValidatePasswordEquality =
                `{passwordField: \'password\', operation: \'${operation}\', errorMessage: \'${errorMessage}\'}`;
            callPostLink();
            applyValues('password', 'password');

            expect(inputCtrl.addErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith(operation, false);
        });
    });
});
