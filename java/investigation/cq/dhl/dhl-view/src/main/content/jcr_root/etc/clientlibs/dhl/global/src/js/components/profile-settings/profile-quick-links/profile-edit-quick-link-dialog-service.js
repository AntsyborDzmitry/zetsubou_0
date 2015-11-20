import ewf from 'ewf';
import ProfileEditQuickLinkDialogController from './profile-edit-quick-link-dialog-controller';

ewf.service('profileEditQuickLinkDialogService', profileEditQuickLinkDialogService);

profileEditQuickLinkDialogService.$inject = ['$controller'];

/**
 * Confirmation service. Creates controller instance to show confirmation message
 *
 * @param {Object} $controller - used to instantiate new controller
 */
export default function profileEditQuickLinkDialogService($controller) {

    this.showSaveDialog = function(name, url) {
        let controller = $controller(ProfileEditQuickLinkDialogController);
        return controller.showSaveDialog(name, url);
    };
}
