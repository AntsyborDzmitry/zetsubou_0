define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _ewf2 = _interopRequireDefault(_ewf);

    var EwfShipmentStepBaseController = (function () {
        function EwfShipmentStepBaseController(name) {
            _classCallCheck(this, EwfShipmentStepBaseController);

            this.name = name;
            this.initialized = false;
            this.editModeActive = null;
            this.nextCallback = function () {};
            this.editCallback = function () {};
        }

        // It needs to be called after declaration - there's no hoisting for classes?

        /**
         * Initialize step controller to make it visible in layout
         */

        _createClass(EwfShipmentStepBaseController, [{
            key: 'init',
            value: function init() {
                this.onInit();
                this.initialized = true;
            }

            /**
             * Specific tasks on initialization
             */
        }, {
            key: 'onInit',
            value: function onInit() {}

            /**
             * Method to call on next button click
             */
        }, {
            key: 'onNextClick',
            value: function onNextClick() {
                this.nextCallback();
            }

            /*
             * Method to call on edit button click
             */
        }, {
            key: 'onEditClick',
            value: function onEditClick() {
                this.editCallback();
            }

            /**
             * Returns step's name
             * @returns {String}
             */
        }, {
            key: 'getName',
            value: function getName() {
                return this.name;
            }

            /**
             * Run step's edit mode
             */
        }, {
            key: 'edit',
            value: function edit() {
                this.onEdit();
                this.editModeActive = true;
            }

            /**
             * Specific tasks when go to edit mode
             */
        }, {
            key: 'onEdit',
            value: function onEdit() {}

            /**
             * Run step's preview mode
             */
        }, {
            key: 'preview',
            value: function preview() {
                this.editModeActive = false;
            }

            /**
             * Run step's validation
             * @return {Boolean}
             */
        }, {
            key: 'isValid',
            value: function isValid() {}

            /**
             * Sets callback that will be called when the next button is pressed
             */
        }, {
            key: 'setNextCallback',
            value: function setNextCallback(callback) {
                this.nextCallback = callback;
            }

            /**
             * Sets callback that will be called when the edit button is pressed
             */
        }, {
            key: 'setEditCallback',
            value: function setEditCallback(callback) {
                this.editCallback = callback;
            }

            /**
             * Gets step data without validation
             */
        }, {
            key: 'getCurrentIncompleteData',
            value: function getCurrentIncompleteData() {}

            /**
             * Loads shipment data to step
             */
        }, {
            key: 'loadShipmentData',
            value: function loadShipmentData() {}
        }]);

        return EwfShipmentStepBaseController;
    })();

    module.exports = EwfShipmentStepBaseController;
    _ewf2['default'].controller('EwfShipmentStepBaseController', EwfShipmentStepBaseController);
});
//# sourceMappingURL=ewf-shipment-step-base-controller.js.map
