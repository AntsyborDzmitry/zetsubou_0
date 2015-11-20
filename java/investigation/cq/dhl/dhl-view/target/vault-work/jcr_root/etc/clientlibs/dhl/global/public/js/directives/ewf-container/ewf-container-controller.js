define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfContainerController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('ewfContainerController', ewfContainerController);

    ewfContainerController.inject = ['logService'];

    /**
     * Instance storage controller.
     * Stores controller's instances, that may be required by other controller and cannot be injected with requires
     *
     * @param {logService} logService
     */

    function ewfContainerController(logService) {
        var vm = this;
        var controllerInstances = {};
        var callbackStorage = {};

        Object.assign(vm, {
            registerControllerInstance: registerControllerInstance,
            getRegisteredControllerInstance: getRegisteredControllerInstance,
            registerCallback: registerCallback
        });

        function registerControllerInstance(controllerName, ctrlInstance) {
            var wasRegistered = !!controllerInstances[controllerName];

            controllerInstances[controllerName] = ctrlInstance;

            logService.log(wasRegistered ? 'Trying to register controller ' + controllerName + ' again.' : controllerName + ' controller successfully registered');

            if (callbackStorage[controllerName]) {
                callbackStorage[controllerName]();
            }
        }

        function getRegisteredControllerInstance(controllerName) {
            var ctrlInstance = controllerInstances[controllerName];
            if (ctrlInstance) {
                return ctrlInstance;
            }

            logService.error('No ' + controllerName + ' controller found!');
        }

        function registerCallback(controllerName, callback) {
            if (controllerInstances[controllerName]) {
                logService.error(controllerName + ' controller already registered, callback does not make any sense');
                return;
            }

            callbackStorage[controllerName] = callback;
        }
    }
});
//# sourceMappingURL=ewf-container-controller.js.map
