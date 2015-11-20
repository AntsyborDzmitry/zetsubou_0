define(['exports', 'module', 'ewf', './ewf-shipment-step-base-controller', './ewf-shipment-flow-service'], function (exports, module, _ewf, _ewfShipmentStepBaseController, _ewfShipmentFlowService) {
    'use strict';

    module.exports = EwfShipmentController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    EwfShipmentController.$inject = ['$scope', '$location', 'userService', 'nlsService', 'navigationService', 'shipmentFlowService', 'shipmentService'];
    _ewf2['default'].controller('EwfShipmentController', EwfShipmentController);

    function EwfShipmentController($scope, $location, userService, nlsService, navigationService, shipmentFlowService, shipmentService) {

        var vm = this;
        var steps = {};
        var stepsIndex = [];
        var initializedSteps = [];

        var currentStep = null;
        var shipmentId = null;
        var mainFlowVisible = true;

        Object.assign(vm, {
            init: init,
            addStep: addStep,
            triggerMainFlowVisibility: triggerMainFlowVisibility,
            isMainFlowVisible: isMainFlowVisible
        });

        function init() {
            shipmentFlowService.getStepsIncompleteData = getStepsIncompleteData;

            subscribeForUrlChange();
            goToFirstStep();
            userService.whoAmI();
            nlsService.getDictionary('shipment');

            shipmentId = navigationService.getParamFromUrl('shipmentId');
            if (shipmentId) {
                shipmentService.getSavedShipmentData(shipmentId).then(triggerStepsLoadingShipmentData);
            }
        }

        function subscribeForUrlChange() {
            $scope.$on('$locationChangeSuccess', onLocationChange);
        }

        function onLocationChange() {
            var stepName = $location.hash();
            processStep(stepName);
        }

        function goToFirstStep() {
            var stepName = stepsIndex[0];
            if (stepName) {
                $location.hash(stepName);
            }
        }

        function goToNextStep() {
            var nextStepIndex = stepsIndex.indexOf(currentStep.getName()) + 1;
            var nextStepName = stepsIndex[nextStepIndex];
            if (nextStepName) {
                $location.hash(nextStepName);
            }
        }

        function processStep(stepName) {
            var stepCtrl = steps[stepName];
            if (currentStep) {
                currentStep.preview();
            }
            if (!initializedSteps.includes(stepName)) {
                stepCtrl.init();
                initializedSteps.push(stepName);
            }
            stepCtrl.edit();
            currentStep = stepCtrl;
        }

        function addStep(stepCtrl) {
            if (!(stepCtrl instanceof _EwfShipmentStepBaseController['default'])) {
                throw new Error('stepCtrl should be an instance of EwfShipmentStepBaseController');
            }
            var stepName = stepCtrl.getName();

            if (!stepsIndex.includes(stepName)) {
                steps[stepName] = stepCtrl;
                stepsIndex.push(stepName);

                stepCtrl.setNextCallback(function () {
                    goToNextStep();
                });
                stepCtrl.setEditCallback(function () {
                    goToStep(stepName);
                });
            }
        }

        function goToStep(stepName) {
            $location.hash(stepName);
        }

        function getStepsIncompleteData() {
            Object.keys(steps).forEach(function (stepName) {
                steps[stepName].getCurrentIncompleteData();
            });
        }

        function triggerStepsLoadingShipmentData(data) {
            Object.keys(steps).forEach(function (stepName) {
                steps[stepName].loadShipmentData(data);
            });
        }

        function triggerMainFlowVisibility() {
            mainFlowVisible = !mainFlowVisible;
        }

        function isMainFlowVisible() {
            return mainFlowVisible;
        }
    }
});
//# sourceMappingURL=ewf-shipment-controller.js.map
