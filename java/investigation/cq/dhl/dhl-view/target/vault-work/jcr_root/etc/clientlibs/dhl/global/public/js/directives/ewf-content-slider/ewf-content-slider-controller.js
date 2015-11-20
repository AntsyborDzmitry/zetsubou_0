define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfContentSliderController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfContentSliderController', EwfContentSliderController);

    EwfContentSliderController.inject = [];

    function EwfContentSliderController() {
        var vm = this;

        vm.next = next;
        vm.prev = prev;
        vm.addSlide = addSlide;

        vm.slideIndex = 0;
        vm.slides = [];

        function next() {
            vm.slideIndex++;
            if (vm.slideIndex >= vm.slides.length) {
                vm.slideIndex = 0;
            }
        }

        function prev() {
            vm.slideIndex--;
            if (vm.slideIndex < 0) {
                vm.slideIndex = vm.slides.length - 1;
            }
        }

        function addSlide(slide) {
            slide.id = vm.slides.length;
            vm.slides.push(slide);
        }
    }
});
//# sourceMappingURL=ewf-content-slider-controller.js.map
