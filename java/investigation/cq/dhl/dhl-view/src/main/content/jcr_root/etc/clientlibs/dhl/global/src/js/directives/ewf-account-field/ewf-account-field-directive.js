import ewf from 'ewf';
import AccountFieldController from './ewf-account-field-controller';

ewf.directive('ewfAccountField', ewfFieldAccount);

function ewfFieldAccount() {
    return {
        restrict: 'A',
        require: ['ewfAccountField', '^registrationForm'],
        scope: true,
        controller: AccountFieldController,
        controllerAs: 'accountFieldController',
        link
    };

    function link(scope, element, attrs, controllers) {
        const [accountFieldController] = controllers;
        const fieldId = attrs.ewfAccountField;
        accountFieldController.setFieldId(fieldId);
    }
}
