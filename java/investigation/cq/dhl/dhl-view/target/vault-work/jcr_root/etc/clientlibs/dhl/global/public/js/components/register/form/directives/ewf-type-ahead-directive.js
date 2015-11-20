define(['exports', 'ewf', '../services/type-ahead-service'], function (exports, _ewf, _servicesTypeAheadService) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfAutocomplete', EwfAutocomplete);

    EwfAutocomplete.$inject = ['filterFilter', 'typeAheadService'];

    function EwfAutocomplete(filterFilter, typeAheadService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function link(scope, element, attrs, ctrl) {
                return postLink(scope, element, attrs, ctrl, filterFilter, typeAheadService);
            }
        };
    }

    function postLink(scope, element, attrs, ctrl, filterFilter, typeAheadService) {

        var selectionConfirmed = -1;

        scope.$watch('query', function (val) {

            if (!selectionConfirmed) {
                var addresses = typeAheadService.getAddressList();
                scope.locationsList = filterFilter(addresses, val);
            } else {
                scope.locationsList = {};
            }

            selectionConfirmed = false;
        });

        scope.addrClick = function (elmnt) {
            scope.query = elmnt.fullAddr;
            selectionConfirmed = true;
        };
    }
});
//# sourceMappingURL=ewf-type-ahead-directive.js.map
