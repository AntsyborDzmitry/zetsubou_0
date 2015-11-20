import ewf from 'ewf';
import AddressEntryController from './address-entry-controller';

ewf.directive('addressEntry', AddressEntry);

export default function AddressEntry() {
    return {
        restrict: 'AE',
        controller: AddressEntryController,
        controllerAs: 'addressEntryCtrl',
        link: {
            post: postLink
        }
    };

    function postLink(scope, elem, attrs, controller) {
        controller.init();
        controller.preloadSectionFromUrl();
    }
}
