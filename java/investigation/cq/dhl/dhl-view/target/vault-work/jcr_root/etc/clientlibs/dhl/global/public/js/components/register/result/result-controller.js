define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = RegistrationSuccessController;

    function RegistrationSuccessController() {
        var vm = this;

        Object.assign(vm, {
            isAccountHolder: false,

            setRegistrationController: setRegistrationController,
            activateAccount: activateAccount
        });

        var registrationController = undefined;

        function setRegistrationController(controller) {
            registrationController = controller;
            var regResult = registrationController.getActivationId();
            vm.isAccountHolder = regResult.accountHolder;
        }

        function activateAccount() {
            registrationController.navigateToEmailActivationPage();
        }
    }
});
//# sourceMappingURL=result-controller.js.map
