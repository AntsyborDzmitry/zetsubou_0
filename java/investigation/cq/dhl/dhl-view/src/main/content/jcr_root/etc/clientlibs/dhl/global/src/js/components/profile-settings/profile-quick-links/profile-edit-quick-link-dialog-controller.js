import ewf from 'ewf';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-field/ewf-field-directive';
import './../../../directives/ewf-validate/ewf-validate-pattern-directive';
import './../../../directives/ewf-validate/ewf-validate-required-directive';
import './../../../services/modal/modal-service';

ProfileEditQuickLinkDialogController.$inject = ['$q', '$rootScope', 'modalService'];

ewf.controller('ProfileEditQuickLinkDialogController', ProfileEditQuickLinkDialogController);

/**
 * Confirmation dialog controller
 *
 * @param $q
 * @param $rootScope
 * @param modalService
 * @return defered object
 */
export default function ProfileEditQuickLinkDialogController($q, $rootScope, modalService) {
    const vm = this;
    $rootScope.profileEditQuickLinkDialogCtrl = vm;

    vm.linkPattern = '^(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$';
    vm.showSaveDialog = showSaveDialog;
    vm.confirmAction = confirmAction;
    vm.rejectAction = rejectAction;

    function showSaveDialog(name, url) {
        vm.linkName = name;
        vm.url = url;
        let deferedAction = $q.defer();
        modalService.showDialog({
            closeOnEsc: true,
            scope: $rootScope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'profile-edit-quick-link-layout.html'
        });

        if (vm.deferedAction) {
            vm.deferedAction.reject('obsolete action');
        }

        vm.deferedAction = deferedAction;
        return deferedAction.promise;
    }

    function confirmAction() {
        vm.deferedAction.resolve({name: vm.linkName, url: vm.url});
        return true;
    }

    function rejectAction() {
        vm.deferedAction.reject('User rejected action');
        return true;
    }
}
