define(['exports', 'module', './form-poc-service'], function (exports, module, _formPocService) {
    'use strict';

    module.exports = FormPocController;

    FormPocController.$inject = ['formPocService', 'logService'];

    function FormPocController(formPocService, logService) {
        var vm = this;
        vm.isConfig = false;
        vm.hideRules = null;
        vm.fieldsToHide = null;

        vm.initFormConfig = function () {
            formPocService.getFormConfig(vm.fieldsToHide || randomIntFromInterval(10, 30)).then(function (hideRules) {
                vm.isConfig = true;
                vm.hideRules = hideRules;
            })['catch'](function () {
                logService.log('SOMETHING WENT WRONG');
            })['finally'](function () {
                logService.log('FORM CONFIG LOADED');
            });
        };

        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }
});
//# sourceMappingURL=form-poc-controller.js.map
