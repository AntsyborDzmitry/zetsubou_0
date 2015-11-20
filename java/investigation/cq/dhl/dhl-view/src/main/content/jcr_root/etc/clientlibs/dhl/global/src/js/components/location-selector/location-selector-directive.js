import ewf from 'ewf';
import LocationController from './location-selector-controller';

ewf.directive('ewfLocationSelector', function() {
    return {
        restrict: 'E',
        controller: LocationController,
        controllerAs: 'locationSelector',
        templateUrl: 'location-selector-layout.html'
    };
});
