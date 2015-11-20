define(['exports', 'module', 'ewf', './../../../directives/ewf-form/ewf-form-directive', './../../../directives/ewf-field/ewf-field-directive', './../../../directives/ewf-validate/ewf-validate-pattern-directive', './../../../directives/ewf-validate/ewf-validate-required-directive', './../../../services/modal/modal-service'], function (exports, module, _ewf, _directivesEwfFormEwfFormDirective, _directivesEwfFieldEwfFieldDirective, _directivesEwfValidateEwfValidatePatternDirective, _directivesEwfValidateEwfValidateRequiredDirective, _servicesModalModalService) {
    'use strict';

    module.exports = ProfileEditQuickLinkDialogController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ProfileEditQuickLinkDialogController.$inject = ['$q', '$rootScope', 'modalService'];

    _ewf2['default'].controller('ProfileEditQuickLinkDialogController', ProfileEditQuickLinkDialogController);

    /**
     * Confirmation dialog controller
     *
     * @param $q
     * @param $rootScope
     * @param modalService
     * @return defered object
     */

    function ProfileEditQuickLinkDialogController($q, $rootScope, modalService) {
        var vm = this;
        $rootScope.profileEditQuickLinkDialogCtrl = vm;

        vm.linkPattern = '^(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$';
        vm.showSaveDialog = showSaveDialog;
        vm.confirmAction = confirmAction;
        vm.rejectAction = rejectAction;

        function showSaveDialog(name, url) {
            vm.linkName = name;
            vm.url = url;
            var deferedAction = $q.defer();
            modalService.showDialog({
                closeOnEsc: true,
                scope: $rootScope,
                windowClass: 'ngdialog-theme-default',
                template: '<script>\r\n    document.createElement(\'ewf-form\');\r\n    document.createElement(\'ewf-field\');\r\n    dhl.registerComponent(\'directives/ewf-form/ewf-form-directive\');\r\n    dhl.registerComponent(\'directives/ewf-input/ewf-input-controller\');\r\n    dhl.registerComponent(\'directives/ewf-validate/ewf-validate-pattern-directive\');\r\n    dhl.registerComponent(\'directives/ewf-validate/ewf-validate-required-directive\');\r\n\r\n</script><div ewf-modal class=\"modal visible modal-edit-link\" id=modal_editLink><form ewf-form=editLink name=editLink><h3>Edit Quick Link</h3><div class=field-wrapper ewf-field=linkName><label for=link_name class=label>Name</label> <input type=text class=\"input modal-edit-link__text-input\" id=link_name ng-model=profileEditQuickLinkDialogCtrl.linkName ewf-input=editLink.linkName ewf-validate-required> <span class=validation-mark></span><div ewf-field-errors></div></div><div class=field-wrapper ewf-field=linkUrl><label for=link_url class=label>URL</label> <input type=text class=\"input modal-edit-link__text-input\" id=link_url ng-model=profileEditQuickLinkDialogCtrl.url ewf-input=editLink.linkUrl ewf-validate-required ewf-validate-pattern={{profileEditQuickLinkDialogCtrl.linkPattern}} ewf-validate-pattern-message=my-profile.error_pattern_quick_link> <span class=validation-mark></span><div ewf-field-errors></div></div><div class=\"row a-right modal-edit-link__btn-save\"><button type=submit ng-click=\"editLink.$valid && profileEditQuickLinkDialogCtrl.confirmAction() && ewfModalCtrl.close()\" class=btn>Save</button></div></form></div>'
            });

            if (vm.deferedAction) {
                vm.deferedAction.reject('obsolete action');
            }

            vm.deferedAction = deferedAction;
            return deferedAction.promise;
        }

        function confirmAction() {
            vm.deferedAction.resolve({ name: vm.linkName, url: vm.url });
            return true;
        }

        function rejectAction() {
            vm.deferedAction.reject('User rejected action');
            return true;
        }
    }
});
//# sourceMappingURL=profile-edit-quick-link-dialog-controller.js.map
