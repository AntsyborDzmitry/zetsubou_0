import ewf from 'ewf';

ShipmentFlowService.$inject = [];
ewf.service('shipmentFlowService', ShipmentFlowService);

export default function ShipmentFlowService() {
    const publicAPI = {
        getStepsIncompleteData: () => {}
    };

    return publicAPI;
}
