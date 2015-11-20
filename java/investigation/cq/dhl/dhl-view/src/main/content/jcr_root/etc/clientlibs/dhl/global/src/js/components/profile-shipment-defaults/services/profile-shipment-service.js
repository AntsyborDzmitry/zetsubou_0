import ewf from 'ewf';

ewf.service('profileShipmentService', profileShipmentService);

profileShipmentService.$inject = ['ewfCrudService'];

export default function profileShipmentService(ewfCrudService) {
    const ENDPOINT_PREFIX = '/api/myprofile/shipment/defaults/';

    const INSURANCE_ENDPOINT = `${ENDPOINT_PREFIX}insurance`;
    const RETURN_SHIPMENTS_ENDPOINT = `${ENDPOINT_PREFIX}return`;
    const PICKUPS_ENDPOINT = `${ENDPOINT_PREFIX}pickup`;
    const SAVING_SHIPMENTS_ENDPOINT = `${ENDPOINT_PREFIX}saving`;
    const SOM_CURRENCY_ENDPOINT = `${ENDPOINT_PREFIX}uomac`;
    const PACKAGES_ENDPOINT = `${ENDPOINT_PREFIX}packages`;

    return {
        getShipmentInsurance,
        updateShipmentInsurance,

        getReturnShipments,
        updateReturnShipments,

        getPickupsData,
        savePickupsData,

        getDefaultSavingShipment,
        updateDefaultSavingShipment,

        getDefaultSomAndCurrency,
        updateDefaultSomAndCurrency,

        getPackagesData,
        updatePackagesData
    };

    function getShipmentInsurance() {
        return ewfCrudService.getElementList(INSURANCE_ENDPOINT);
    }

    function updateShipmentInsurance(data) {
        return ewfCrudService.updateElement(INSURANCE_ENDPOINT, data);
    }

    function getReturnShipments() {
        return ewfCrudService.getElementList(RETURN_SHIPMENTS_ENDPOINT);
    }
    function updateReturnShipments(data) {
        return ewfCrudService.updateElement(RETURN_SHIPMENTS_ENDPOINT, data);
    }

    function getPickupsData() {
        return ewfCrudService.getElementList(PICKUPS_ENDPOINT);
    }

    function savePickupsData(data) {
        return ewfCrudService.updateElement(PICKUPS_ENDPOINT, data);
    }

    function getDefaultSavingShipment() {
        return ewfCrudService.getElementList(SAVING_SHIPMENTS_ENDPOINT);
    }

    function updateDefaultSavingShipment(data) {
        return ewfCrudService.updateElement(SAVING_SHIPMENTS_ENDPOINT, data);
    }

    function getDefaultSomAndCurrency() {
        return ewfCrudService.getElementList(SOM_CURRENCY_ENDPOINT);
    }

    function updateDefaultSomAndCurrency(data) {
        return ewfCrudService.updateElement(SOM_CURRENCY_ENDPOINT, data);
    }

    function getPackagesData() {
        return ewfCrudService.getElementList(PACKAGES_ENDPOINT);
    }

    function updatePackagesData(data) {
        return ewfCrudService.updateElement(PACKAGES_ENDPOINT, data);
    }
}
