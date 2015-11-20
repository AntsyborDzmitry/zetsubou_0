import ewf from 'ewf';
import ContactShareInfoController from './contact-share-info-controller';

ewf.directive('contactShareInfo', ContactShareInfo);

function ContactShareInfo() {
    return {
        restrict: 'EA',
        controller: ContactShareInfoController,
        controllerAs: 'contactShareInfoCtrl',
        scope: true,
        templateUrl: 'contact-share-info-directive.html'
    };
}
