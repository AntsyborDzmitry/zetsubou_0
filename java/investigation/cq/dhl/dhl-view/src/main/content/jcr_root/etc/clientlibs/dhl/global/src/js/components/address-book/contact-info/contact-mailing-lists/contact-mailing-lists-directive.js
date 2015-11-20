import ewf from 'ewf';
import ContactMailingListsController from './contact-mailing-lists-controller';

ewf.directive('contactMailingLists', ContactMailingLists);

function ContactMailingLists() {
    return {
        restrict: 'EA',
        controller: ContactMailingListsController,
        controllerAs: 'contactMailingListsCtrl',
        scope: true,
        templateUrl: 'contact-mailing-lists-directive.html'
    };
}
