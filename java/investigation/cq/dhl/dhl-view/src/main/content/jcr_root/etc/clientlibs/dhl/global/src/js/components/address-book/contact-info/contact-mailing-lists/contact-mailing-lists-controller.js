import './contact-mailing-lists-service';
import '../../../../services/attrs-service';

ContactMailingListsController.$inject = ['$scope', '$attrs', 'attrsService', 'contactMailingListsService'];

export default function ContactMailingListsController($scope, $attrs, attrsService, contactMailingListsService) {
    const vm = this;
    attrsService.track($scope, $attrs, 'mailingLists', vm);

    vm.addNewListItem = addNewListItem;
    vm.removeListItem = removeListItem;

    attrsService.track($scope, $attrs, 'mailingLists', vm);

    initSelectData();

    function initSelectData() {
        contactMailingListsService.getTypeaheadMailingLists()
            .then((response) => {
                vm.mailingListsSelectData = response;
                if (!vm.mailingLists.length) {
                    addNewListItem();
                }
            });
    }

    function addNewListItem() {
        vm.mailingLists.push('');
    }

    function removeListItem(index) {
        vm.mailingLists.splice(index, 1);
    }
}
