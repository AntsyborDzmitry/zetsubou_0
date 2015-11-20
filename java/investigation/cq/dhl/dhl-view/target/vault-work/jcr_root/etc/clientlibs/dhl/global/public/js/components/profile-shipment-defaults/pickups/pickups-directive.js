define(['exports', 'module', 'ewf', './pickups-controller', 'ionrangeslider', './../../../directives/ewf-form/ewf-form-directive'], function (exports, module, _ewf, _pickupsController, _ionrangeslider, _directivesEwfFormEwfFormDirective) {
    'use strict';

    module.exports = pickupsDirective;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PickupsController = _interopRequireDefault(_pickupsController);

    var _ionrangeslider2 = _interopRequireDefault(_ionrangeslider);

    // eslint-disable-line

    _ewf2['default'].directive('pickupsDirective', pickupsDirective);

    function pickupsDirective() {
        return {
            restrict: 'AE',
            controller: _PickupsController['default'],
            controllerAs: 'pickupsCtrl',
            link: {
                pre: preLink,
                post: postLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.preloadSectionFromUrl();
        }

        function postLink(scope, element, attrs, ctrl) {
            ctrl.init().then(function () {
                element.find('#range-slider').ionRangeSlider(ctrl.rangeSliderOptions);
                element.find('.irs-from').attr('data-content', element.find('#earliest-pickup').text());
                element.find('.irs-to').attr('data-content', element.find('#latest-pickup').text());
            });

            element.find('button.btn').click(function () {
                ctrl.savePickupsSettings(ctrl.pickupSettings);
            });
        }
    }
});
//# sourceMappingURL=pickups-directive.js.map
