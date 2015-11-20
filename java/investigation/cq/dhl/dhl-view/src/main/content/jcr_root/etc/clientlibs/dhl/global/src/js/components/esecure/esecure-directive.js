import ewf from 'ewf';

import ESecureController from './esecure-controller';

ewf.directive('ewfEsecure', function() {
    return {
        restrict: 'E',
        controller: ESecureController,
        controllerAs: 'eSecureController',
        templateUrl: 'esecure-layout.html'
    };
});

