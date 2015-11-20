import ewf from 'ewf';
import EwfShipmentStepBaseController from './ewf-shipment-step-base-controller';
import './ewf-shipment-flow-service';

EwfShipmentController.$inject = ['$scope',
                                 '$location',
                                 'userService',
                                 'nlsService',
                                 'navigationService',
                                 'shipmentFlowService',
                                 'shipmentService'];
ewf.controller('EwfShipmentController', EwfShipmentController);

export default function EwfShipmentController($scope,
                                              $location,
                                              userService,
                                              nlsService,
                                              navigationService,
                                              shipmentFlowService,
                                              shipmentService) {

    const vm = this;
    const steps = {};
    const stepsIndex = [];
    const initializedSteps = [];

    let currentStep = null;
    let shipmentId = null;
    let mainFlowVisible = true;

    Object.assign(vm, {
        init,
        addStep,
        triggerMainFlowVisibility,
        isMainFlowVisible
    });

    function init() {
        shipmentFlowService.getStepsIncompleteData = getStepsIncompleteData;

        subscribeForUrlChange();
        goToFirstStep();
        userService.whoAmI();
        nlsService.getDictionary('shipment');

        shipmentId = navigationService.getParamFromUrl('shipmentId');
        if (shipmentId) {
            shipmentService.getSavedShipmentData(shipmentId)
                .then(triggerStepsLoadingShipmentData);
        }
    }

    function subscribeForUrlChange() {
        $scope.$on('$locationChangeSuccess', onLocationChange);
    }

    function onLocationChange() {
        const stepName = $location.hash();
        processStep(stepName);
    }

    function goToFirstStep() {
        const stepName = stepsIndex[0];
        if (stepName) {
            $location.hash(stepName);
        }
    }

    function goToNextStep() {
        const nextStepIndex = stepsIndex.indexOf(currentStep.getName()) + 1;
        const nextStepName = stepsIndex[nextStepIndex];
        if (nextStepName) {
            $location.hash(nextStepName);
        }
    }

    function processStep(stepName) {
        const stepCtrl = steps[stepName];
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
        if (!(stepCtrl instanceof EwfShipmentStepBaseController)) {
            throw new Error('stepCtrl should be an instance of EwfShipmentStepBaseController');
        }
        const stepName = stepCtrl.getName();

        if (!stepsIndex.includes(stepName)) {
            steps[stepName] = stepCtrl;
            stepsIndex.push(stepName);

            stepCtrl.setNextCallback(() => {
                goToNextStep();
            });
            stepCtrl.setEditCallback(() => {
                goToStep(stepName);
            });
        }
    }

    function goToStep(stepName) {
        $location.hash(stepName);
    }

    function getStepsIncompleteData() {
        Object.keys(steps).forEach((stepName) => {
            steps[stepName].getCurrentIncompleteData();
        });
    }

    function triggerStepsLoadingShipmentData(data) {
        Object.keys(steps).forEach((stepName) => {
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
