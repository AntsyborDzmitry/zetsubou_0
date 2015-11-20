import ewf from 'ewf';

import ProviewController from './proview-controller';

ewf.directive('ewfProview', function() {
    return {
        restrict: 'E',
        controller: ProviewController,
        controllerAs: 'proviewController',
        templateUrl: 'proview-layout.html'
    };
});

