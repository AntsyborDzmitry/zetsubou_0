import ewf from 'ewf';
import './../../../directives/ewf-form/ewf-form-directive';

import MyDhlAccountsController from './my-dhl-accounts-controller';

ewf.directive('myDhlAccounts', () => {
    return {
        restrict: 'AE',
        controller: MyDhlAccountsController,
        controllerAs: 'myDhlAccountsCtrl',
        require: ['myDhlAccounts', 'ewfContainer'],
        link: {
            post: function(scope, element, attributes, controllers) {
                const [dhlAccountsCtrl, ewfContainerCtrl] = controllers;

                const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
                gridCtrl.ctrlToNotify = dhlAccountsCtrl;

                dhlAccountsCtrl.gridCtrl = gridCtrl;
                dhlAccountsCtrl.init();
            }
        }
    };
});
