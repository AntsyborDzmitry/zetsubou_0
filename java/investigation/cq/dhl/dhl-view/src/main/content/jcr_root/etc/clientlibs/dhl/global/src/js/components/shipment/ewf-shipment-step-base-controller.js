import ewf from 'ewf';

export default class EwfShipmentStepBaseController {
    constructor(name) {
        this.name = name;
        this.initialized = false;
        this.editModeActive = null;
        this.nextCallback = function() {};
        this.editCallback = function() {};
    }

    /**
     * Initialize step controller to make it visible in layout
     */
    init() {
        this.onInit();
        this.initialized = true;
    }

    /**
     * Specific tasks on initialization
     */
    onInit() {}

    /**
     * Method to call on next button click
     */
    onNextClick() {
        this.nextCallback();
    }

    /*
     * Method to call on edit button click
     */
    onEditClick() {
        this.editCallback();
    }

    /**
     * Returns step's name
     * @returns {String}
     */
    getName() {
        return this.name;
    }

    /**
     * Run step's edit mode
     */
    edit() {
        this.onEdit();
        this.editModeActive = true;
    }

    /**
     * Specific tasks when go to edit mode
     */
    onEdit() {}

    /**
     * Run step's preview mode
     */
    preview() {
        this.editModeActive = false;
    }

    /**
     * Run step's validation
     * @return {Boolean}
     */
    isValid() {}

    /**
     * Sets callback that will be called when the next button is pressed
     */
    setNextCallback(callback) {
        this.nextCallback = callback;
    }

    /**
     * Sets callback that will be called when the edit button is pressed
     */
    setEditCallback(callback) {
        this.editCallback = callback;
    }

    /**
     * Gets step data without validation
     */
    getCurrentIncompleteData() {}

    /**
     * Loads shipment data to step
     */
    loadShipmentData() {}
}

// It needs to be called after declaration - there's no hoisting for classes?
ewf.controller('EwfShipmentStepBaseController', EwfShipmentStepBaseController);
