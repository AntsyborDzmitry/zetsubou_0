import ewf from 'ewf';

ewf.directive('ewfContentSliderItem', ewfContentSliderItem);

export default function ewfContentSliderItem() {
    return {
        restrict: 'E',
        require: '^ewfContentSlider',
        templateUrl: './ewf-content-slider-item-layout.html',
        transclude: true,
        scope: {
            header: '@'
        },
        link: function(scope, element, attrs, ctrl) {
            scope.isActive = isActive;
            ctrl.addSlide(scope);

            function isActive() {
                return (scope.id === ctrl.slideIndex);
            }
        }
    };
}
