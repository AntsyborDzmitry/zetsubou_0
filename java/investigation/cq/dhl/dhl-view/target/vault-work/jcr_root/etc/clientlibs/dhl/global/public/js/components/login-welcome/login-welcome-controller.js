define(['exports', 'module', './../../services/modal/modal-service'], function (exports, module, _servicesModalModalService) {
    'use strict';

    module.exports = LoginWelcomeController;

    LoginWelcomeController.$inject = ['$scope', 'modalService', 'navigationService'];

    /**
     * Login Welcome controller
     */

    function LoginWelcomeController($scope, modalService, navigationService) {
        var vm = this;
        vm.openRegistrationBenefitsPopup = function () {
            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div id=modal_registrationBenefits><h3 nls=login.registration_benefits_popup_title></h3><div class=ngdialog-message nls=login.registration_benefits_popup_message></div></div></div>'
            });
        };

        vm.goToRegistration = function () {
            navigationService.location('registration.html');
        };
    }
});
//# sourceMappingURL=login-welcome-controller.js.map
