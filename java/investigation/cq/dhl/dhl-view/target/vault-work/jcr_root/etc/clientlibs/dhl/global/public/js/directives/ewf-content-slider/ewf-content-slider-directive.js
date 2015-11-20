define(['exports', 'module', 'ewf', './ewf-content-slider-item-directive', './ewf-content-slider-controller'], function (exports, module, _ewf, _ewfContentSliderItemDirective, _ewfContentSliderController) {
    'use strict';

    module.exports = ewfContentSlider;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfContentSliderController = _interopRequireDefault(_ewfContentSliderController);

    _ewf2['default'].directive('ewfContentSlider', ewfContentSlider);

    function ewfContentSlider() {
        return {
            restrict: 'E',
            controllerAs: 'contentSlider',
            controller: _EwfContentSliderController['default'],
            transclude: true,
            template: '<span class=content-slider ng-class=\"{\'is-visible\' : isShowing}\"><span class=content-slider__container><a class=content-slider__close ng-click=\"isShowing = false\"></a><div ng-transclude></div><ul class=content-slider__pages><li class=content-slider__pages__prev ng-click=contentSlider.prev()><i class=dhlicon-carat-left></i></li><li class=\"content-slider__pages__item {{($index == contentSlider.slideIndex) ? \'is-active\': \'\'}}\" ng-click=\"contentSlider.slideIndex = $index\" ng-repeat=\"slide in contentSlider.slides track by $index\"></li><li class=content-slider__pages__next ng-click=contentSlider.next()><i class=dhlicon-carat-right></i></li></ul></span></span>',
            scope: {
                isShowing: '=showWhen'
            }
        };
    }
});
//# sourceMappingURL=ewf-content-slider-directive.js.map
