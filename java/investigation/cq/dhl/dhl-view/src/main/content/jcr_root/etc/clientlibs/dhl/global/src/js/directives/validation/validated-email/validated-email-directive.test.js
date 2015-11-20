import 'angularMocks';
import validationConfig from '../services/validation-config';

describe('validatedEmail', function() {
    let scope;

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        spyOn(scope, '$on');

        const element = angular.element('<form name="form">' +
          '<input ng-model="model.username" name="username" validated-email/>' +
          '</form>');
        scope.model = {username: {}};
        $compile(element)(scope);
        scope.$apply();
    }));

    it('should set pattern rule', function() {
        expect(scope.model.username.pattern).toEqual(validationConfig.EMAIL_PATTERN);
    });

    it('should subscribe on ValidateForm event', function() {
        expect(scope.$on).toHaveBeenCalled();
    });

    it('should set maxLength rule', function() {
        expect(scope.model.username.maxLength).toEqual(validationConfig.EMAIL_MAX_LENGTH);
    });

    //TODO: add test
    // it('should call service method to init validation', function() {
    // });
});
