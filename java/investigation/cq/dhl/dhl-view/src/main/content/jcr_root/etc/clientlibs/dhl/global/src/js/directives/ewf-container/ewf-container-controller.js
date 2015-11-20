import ewf from 'ewf';

ewf.controller('ewfContainerController', ewfContainerController);

ewfContainerController.inject = ['logService'];

/**
 * Instance storage controller.
 * Stores controller's instances, that may be required by other controller and cannot be injected with requires
 *
 * @param {logService} logService
 */
export default function ewfContainerController(logService) {
    const vm = this;
    const controllerInstances = {};
    const callbackStorage = {};

    Object.assign(vm, {
        registerControllerInstance,
        getRegisteredControllerInstance,
        registerCallback
    });

    function registerControllerInstance(controllerName, ctrlInstance) {
        const wasRegistered = !!controllerInstances[controllerName];

        controllerInstances[controllerName] = ctrlInstance;

        logService.log(wasRegistered
            ? `Trying to register controller ${controllerName} again.`
            : `${controllerName} controller successfully registered`);

        if (callbackStorage[controllerName]) {
            callbackStorage[controllerName]();
        }
    }

    function getRegisteredControllerInstance(controllerName) {
        const ctrlInstance = controllerInstances[controllerName];
        if (ctrlInstance) {
            return ctrlInstance;
        }

        logService.error(`No ${controllerName} controller found!`);
    }

    function registerCallback(controllerName, callback) {
        if (controllerInstances[controllerName]) {
            logService.error(`${controllerName} controller already registered, callback does not make any sense`);
            return;
        }

        callbackStorage[controllerName] = callback;
    }
}
