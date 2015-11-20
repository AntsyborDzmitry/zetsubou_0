import ewf from 'ewf';
import '../services/type-ahead-service';

ewf.directive('ewfAutocomplete', EwfAutocomplete);

EwfAutocomplete.$inject = ['filterFilter', 'typeAheadService'];

function EwfAutocomplete(filterFilter, typeAheadService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: (scope, element, attrs, ctrl) => postLink(scope, element, attrs, ctrl, filterFilter, typeAheadService)
    };
}

function postLink(scope, element, attrs, ctrl, filterFilter, typeAheadService) {

    let selectionConfirmed = -1;

    scope.$watch('query', (val) => {

        if (!selectionConfirmed) {
            const addresses = typeAheadService.getAddressList();
            scope.locationsList = filterFilter(addresses, val);
        } else {
            scope.locationsList = {};
        }

        selectionConfirmed = false;
    });

    scope.addrClick = (elmnt) => {
        scope.query = elmnt.fullAddr;
        selectionConfirmed = true;
    };
}
