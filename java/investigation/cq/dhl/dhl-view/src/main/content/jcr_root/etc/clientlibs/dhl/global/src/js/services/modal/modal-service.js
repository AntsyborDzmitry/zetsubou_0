import ewf from 'ewf';
import './../../directives/ewf-modal/ewf-modal-directive';
import './../nls-service';

ewf.service('modalService', modalService);

modalService.$inject = ['$modal', '$rootScope', 'nlsService'];

export default function modalService($modal, $rootScope) {
    this.showDialog = showDialog;
    this.showMessageDialog = showMessageDialog;
    this.showConfirmationDialog = showConfirmationDialog;

    /**
    * @param {Object} options - confirmation dialog options
    * @param {String} options.closeOnEsc - close dialog on esc key press, enabled by default
    * @param {String} options.controller - dialog controller
    * @param {String} options.controllerAs - dialog scope property for controller
    * @param {String} options.scope - dialog scope
    * @param {String} options.template - dialog template
    * @param {String} options.templateUrl - dialog templateUrl
    * @param {String} options.cancelButtonLabel - dialog cancel button label, defaults to 'Ok'
    * @param {String} options.cancelButtonNlsLabel - dialog cancel button label nls full key, defaults to 'Cancel'
    * @returns {Object} dialogInstance - promise, which close(), dismiss() methods and result promise
    */
    function showDialog(options) {
        const defaultOptions = {
            closeOnEsc: true
        };

        const {
            closeOnEsc,
            controller,
            controllerAs,
            scope,
            template,
            templateUrl,
            windowClass
        } = Object.assign({}, defaultOptions, options);

        return $modal.open({
            backdrop: true,
            backdropClass: 'ewf-modal-bg',
            windowClass: `is-visible template ${windowClass}`,
            openedClass: 'modal-is-open',
            keyboard: closeOnEsc,
            controller,
            controllerAs,
            scope,
            template,
            templateUrl
        });
    }

    /**
    * @param {Object} options - confirmation dialog options
    * @param {String} options.title - dialog title
    * @param {String} options.nlsTitle - dialog title nls full key
    * @param {String} options.message - dialog message
    * @param {String} options.nlsMessage - dialog message nls full key
    * @param {String} options.okButtonLabel - dialog OK button label
    * @param {String} options.okButtonNlsLabel - dialog OK button label nls full key
    * @returns {Object} result - promise, which will be resolved on OK button click and rejected on close button click
    */
    function showMessageDialog(options) {
        if (!options.okButtonLabel && !options.okButtonNlsLabel) {
            options.okButtonNlsLabel = 'common.modal_ok_button_label';
        }

        const scope = $rootScope.$new();
        Object.assign(scope, options);

        return this.showDialog({
            closeOnEsc: true,
            scope,
            templateUrl: 'message-dialog-layout.html'
        }).result;
    }

    /**
    * @param {Object} options - confirmation dialog options
    * @param {String} options.title - dialog title
    * @param {String} options.nlsTitle - dialog title nls full key
    * @param {String} options.message - dialog message
    * @param {String} options.nlsMessage - dialog message nls full key
    * @param {String} options.okButtonLabel - dialog OK button label
    * @param {String} options.okButtonNlsLabel - dialog OK button label nls full key
    * @param {String} options.cancelButtonLabel - dialog cancel button label, defaults to 'Ok'
    * @param {String} options.cancelButtonNlsLabel - dialog cancel button label nls full key, defaults to 'Cancel'
    * @returns {Object} result - promise, which will be resolved on OK button click and rejected on cancel
     * or close button click
    */
    function showConfirmationDialog(options) {
        if (!options.okButtonLabel && !options.okButtonNlsLabel) {
            options.okButtonNlsLabel = 'common.modal_ok_button_label';
        }
        if (!options.cancelButtonLabel && !options.cancelButtonNlsLabel) {
            options.cancelButtonNlsLabel = 'common.modal_cancel_button_label';
        }

        const scope = $rootScope.$new();
        Object.assign(scope, options);

        return this.showDialog({
            closeOnEsc: true,
            scope,
            templateUrl: 'confirmation-dialog-layout.html'
        }).result;
    }
}
