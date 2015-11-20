define(['exports', 'module', './contact-mailing-lists-service', '../../../../services/attrs-service'], function (exports, module, _contactMailingListsService, _servicesAttrsService) {
    'use strict';

    module.exports = ContactMailingListsController;

    ContactMailingListsController.$inject = ['$scope', '$attrs', 'attrsService', 'contactMailingListsService'];

    function ContactMailingListsController($scope, $attrs, attrsService, contactMailingListsService) {
        var vm = this;
        attrsService.track($scope, $attrs, 'mailingLists', vm);

        vm.addNewListItem = addNewListItem;
        vm.removeListItem = removeListItem;

        attrsService.track($scope, $attrs, 'mailingLists', vm);

        initSelectData();

        function initSelectData() {
            contactMailingListsService.getTypeaheadMailingLists().then(function (response) {
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
});
//# sourceMappingURL=contact-mailing-lists-controller.js.map
