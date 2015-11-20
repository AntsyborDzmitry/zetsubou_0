import ewf from 'ewf';

ewf.controller('EwfContentSliderController', EwfContentSliderController);

EwfContentSliderController.inject = [];

export default function EwfContentSliderController() {
    const vm = this;

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
