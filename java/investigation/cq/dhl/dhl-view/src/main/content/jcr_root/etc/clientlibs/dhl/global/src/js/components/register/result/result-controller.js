export default function RegistrationSuccessController() {
    const vm = this;

    Object.assign(vm, {
        isAccountHolder: false,

        setRegistrationController,
        activateAccount
    });

    let registrationController;

    function setRegistrationController(controller) {
        registrationController = controller;
        const regResult = registrationController.getActivationId();
        vm.isAccountHolder = regResult.accountHolder;
    }

    function activateAccount() {
        registrationController.navigateToEmailActivationPage();
    }
}
