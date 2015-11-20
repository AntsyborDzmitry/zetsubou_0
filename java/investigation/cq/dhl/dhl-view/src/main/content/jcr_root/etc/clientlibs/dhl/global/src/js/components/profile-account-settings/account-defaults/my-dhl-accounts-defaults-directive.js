import ewf from 'ewf';
import './../../register/form/directives/ewf-check-account-directive';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-validate/ewf-validate-dhl-account';
import MyDhlAccountsDefaultsController from './my-dhl-accounts-defaults-controller';

ewf.directive('myDhlAccountsDefaults', () => {
    return {
        restrict: 'AE',
        controller: MyDhlAccountsDefaultsController,
        controllerAs: 'paymentDefaultsController'
    };
});
