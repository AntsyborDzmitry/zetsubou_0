define(['exports', 'ewf', './optional-services-controller', './../../../directives/ewf-form/ewf-form-directive'], function (exports, _ewf, _optionalServicesController, _directivesEwfFormEwfFormDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _OptionalServicesController = _interopRequireDefault(_optionalServicesController);

    _ewf2['default'].directive('OptionalServices', OptionalServices);

    function OptionalServices() {
        return {
            restrict: 'AE',
            controller: _OptionalServicesController['default'],
            controllerAs: 'optionalServicesController'
        };
    }
});
//# sourceMappingURL=optional-services-directive.js.map
