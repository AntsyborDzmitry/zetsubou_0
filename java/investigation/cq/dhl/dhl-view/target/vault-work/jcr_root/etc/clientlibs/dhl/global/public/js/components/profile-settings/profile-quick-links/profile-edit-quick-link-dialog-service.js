define(['exports', 'module', 'ewf', './profile-edit-quick-link-dialog-controller'], function (exports, module, _ewf, _profileEditQuickLinkDialogController) {
    'use strict';

    module.exports = profileEditQuickLinkDialogService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfileEditQuickLinkDialogController = _interopRequireDefault(_profileEditQuickLinkDialogController);

    _ewf2['default'].service('profileEditQuickLinkDialogService', profileEditQuickLinkDialogService);

    profileEditQuickLinkDialogService.$inject = ['$controller'];

    /**
     * Confirmation service. Creates controller instance to show confirmation message
     *
     * @param {Object} $controller - used to instantiate new controller
     */

    function profileEditQuickLinkDialogService($controller) {

        this.showSaveDialog = function (name, url) {
            var controller = $controller(_ProfileEditQuickLinkDialogController['default']);
            return controller.showSaveDialog(name, url);
        };
    }
});
//# sourceMappingURL=profile-edit-quick-link-dialog-service.js.map
