import './form-poc-service';

FormPocController.$inject = ['formPocService', 'logService'];

export default function FormPocController(formPocService, logService) {
    const vm = this;
    vm.isConfig = false;
    vm.hideRules = null;
    vm.fieldsToHide = null;

    vm.initFormConfig = function() {
        formPocService.getFormConfig(vm.fieldsToHide || randomIntFromInterval(10, 30))
            .then((hideRules) => {
                vm.isConfig = true;
                vm.hideRules = hideRules;
            })
            .catch(() => {
                logService.log('SOMETHING WENT WRONG');
            })
            .finally(() => {
                logService.log('FORM CONFIG LOADED');
            });
    };

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
