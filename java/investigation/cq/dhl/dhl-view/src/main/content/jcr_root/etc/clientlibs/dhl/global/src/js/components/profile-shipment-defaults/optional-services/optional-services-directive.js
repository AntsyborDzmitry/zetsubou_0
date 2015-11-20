import ewf from 'ewf';
import OptionalServicesController from './optional-services-controller';
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('OptionalServices', OptionalServices);

function OptionalServices() {
    return {
        restrict: 'AE',
        controller: OptionalServicesController,
        controllerAs: 'optionalServicesController'
    };
}
