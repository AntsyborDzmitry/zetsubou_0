import ewf from 'ewf';
import EwfAddressController from './ewf-address-controller';

ewf.directive('ewfAddress', EwfAddress);

export default function EwfAddress() {
    return {
        restrict: 'E',
        controller: EwfAddressController,
        controllerAs: 'addressCtrl',
        scope: true,
        require: 'ewfAddress',
        link: {
            post: postLink
        }
    };

    function postLink(scope, elem, attrs, controller) {
        const setResidentialFlagFromProfile = scope.$eval(attrs.setResidentialFlagFromProfile);
        controller.init({
            setResidentialFlagFromProfile
        });
    }
}
