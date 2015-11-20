import './../../services/ewf-spinner-service';

EwfSpinnerController.$inject = ['ewfSpinnerService'];

export default function EwfSpinnerController(ewfSpinnerService) {
    const vm = this;

    vm.isSpinnerVisible = isSpinnerVisible;

    function isSpinnerVisible() {
        return ewfSpinnerService.isSpinnerActive();
    }
}
