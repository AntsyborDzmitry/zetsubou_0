define(['exports', 'module', 'ewf', './../../directives/ewf-modal/ewf-modal-directive', './../nls-service'], function (exports, module, _ewf, _directivesEwfModalEwfModalDirective, _nlsService) {
    'use strict';

    module.exports = modalService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('modalService', modalService);

    modalService.$inject = ['$modal', '$rootScope', 'nlsService'];

    function modalService($modal, $rootScope) {
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
            var defaultOptions = {
                closeOnEsc: true
            };

            var _Object$assign = Object.assign({}, defaultOptions, options);

            var closeOnEsc = _Object$assign.closeOnEsc;
            var controller = _Object$assign.controller;
            var controllerAs = _Object$assign.controllerAs;
            var scope = _Object$assign.scope;
            var template = _Object$assign.template;
            var templateUrl = _Object$assign.templateUrl;
            var windowClass = _Object$assign.windowClass;

            return $modal.open({
                backdrop: true,
                backdropClass: 'ewf-modal-bg',
                windowClass: 'is-visible template ' + windowClass,
                openedClass: 'modal-is-open',
                keyboard: closeOnEsc,
                controller: controller,
                controllerAs: controllerAs,
                scope: scope,
                template: template,
                templateUrl: templateUrl
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

            var scope = $rootScope.$new();
            Object.assign(scope, options);

            return this.showDialog({
                closeOnEsc: true,
                scope: scope,
                template: '<div ewf-modal title={{title}} nls-title={{nlsTitle}}><div class=ewf-modal__body><p ng-if=nlsMessage nls={{nlsMessage}}></p><p ng-if=message ng-bind=message></p></div><div class=ewf-modal__footer><button class=\"btn btn_primary-action\" ng-click=ewfModalCtrl.close();><span ng-if=okButtonLabel ng-bind=okButtonLabel></span> <span ng-if=okButtonNlsLabel nls={{okButtonNlsLabel}}></span></button></div></div>'
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

            var scope = $rootScope.$new();
            Object.assign(scope, options);

            return this.showDialog({
                closeOnEsc: true,
                scope: scope,
                template: '<div ewf-modal title={{title}} nls-title={{nlsTitle}}><div class=ewf-modal__body><p ng-if=nlsMessage nls={{nlsMessage}}></p><p ng-if=message ng-bind=message></p></div><div class=ewf-modal__footer><button class=\"btn btn_action\" ng-click=ewfModalCtrl.close();><span ng-if=okButtonLabel ng-bind=okButtonLabel></span> <span ng-if=okButtonNlsLabel nls={{okButtonNlsLabel}}></span></button> <button class=\"btn btn_action\" ng-click=ewfModalCtrl.dismiss();><span ng-if=cancelButtonLabel ng-bind=cancelButtonLabel></span> <span ng-if=cancelButtonNlsLabel nls={{cancelButtonNlsLabel}}></span></button></div></div>'
            }).result;
        }
    }
});
//# sourceMappingURL=modal-service.js.map
