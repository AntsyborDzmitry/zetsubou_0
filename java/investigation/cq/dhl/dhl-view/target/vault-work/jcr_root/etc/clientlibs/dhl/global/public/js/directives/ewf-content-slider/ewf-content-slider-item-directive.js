define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfContentSliderItem;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfContentSliderItem', ewfContentSliderItem);

    function ewfContentSliderItem() {
        return {
            restrict: 'E',
            require: '^ewfContentSlider',
            template: '<div class=content-slider__item data-ng-class=\"{\'is-active\' : isActive()}\"><div class=content-slider__item__title ng-bind=header></div><div class=content-slider__item__content ng-transclude></div></div>',
            transclude: true,
            scope: {
                header: '@'
            },
            link: function link(scope, element, attrs, ctrl) {
                scope.isActive = isActive;
                ctrl.addSlide(scope);

                function isActive() {
                    return scope.id === ctrl.slideIndex;
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-content-slider-item-directive.js.map
