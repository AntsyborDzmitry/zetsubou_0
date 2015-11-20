import ewf from 'ewf';
import './../../directives/ewf-form/ewf-form-directive';
import './../../directives/ewf-grid/ewf-grid-directive';
import './../../directives/ewf-container/ewf-container-directive';

import AddressBookController from './address-book-controller';

ewf.directive('ewfAddressBook', ewfAddressBook);

function ewfAddressBook() {
    return {
        restrict: 'E',
        controller: AddressBookController,
        controllerAs: 'addressBookCtrl',
        require: ['ewfAddressBook', 'ewfContainer'],
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attrs, ctrls) {
        const [addressBookCtrl, ewfContainerCtrl] = ctrls;

        const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
        gridCtrl.ctrlToNotify = addressBookCtrl;

        addressBookCtrl.gridCtrl = gridCtrl;
    }
}
