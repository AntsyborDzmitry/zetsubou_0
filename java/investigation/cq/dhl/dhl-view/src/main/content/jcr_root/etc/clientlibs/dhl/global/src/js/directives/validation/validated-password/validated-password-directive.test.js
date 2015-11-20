import 'angularMocks';
import validationConfig from '../services/validation-config';

describe('validatedPassword', function() {
    let scope;

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        spyOn(scope, '$on');
        const element = angular.element('<form name="form">' +
          '<input ng-model="model.password" name="password" validated-password/>' +
          '</form>');
        scope.model = {password: {}};
        $compile(element)(scope);
        scope.$apply();
    }));

    it('should set pattern rule', function() {
        expect(scope.model.password.pattern).toEqual(validationConfig.PASSWORD_PATTERN);
    });

    it('should subscribe on ValidateForm event', function() {
        expect(scope.$on).toHaveBeenCalled();
    });

    it('should set maxLength rule', function() {
        expect(scope.model.password.maxLength).toEqual(validationConfig.PASSWORD_MAX_LENGTH);
    });
});
