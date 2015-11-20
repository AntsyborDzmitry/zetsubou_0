define(['exports', 'ewf', './contact-mailing-lists-controller'], function (exports, _ewf, _contactMailingListsController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ContactMailingListsController = _interopRequireDefault(_contactMailingListsController);

    _ewf2['default'].directive('contactMailingLists', ContactMailingLists);

    function ContactMailingLists() {
        return {
            restrict: 'EA',
            controller: _ContactMailingListsController['default'],
            controllerAs: 'contactMailingListsCtrl',
            scope: true,
            template: '<div class=overlay-white ng-init=\"isEditing = false\"><div class=showcase><div class=\"nav right\"><a id=contactNotificationShowEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = true\" ng-show=!isEditing><i class=dhlicon-pencil></i> <span nls=address-book.edit_btn></span></a></div><div class=\"nav right\"><a id=contactNotificationHideEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = false\" ng-show=isEditing><i class=dhlicon-pencil></i> <span nls=address-book.hide_btn></span></a></div><h3 class=margin-none nls=address-book.mailing_lists_title></h3><div ng-show=isEditing><hr><label class=label nls=address-book.add_contatc_to_mailing_lists_title></label><div class=\"field-wrapper ng-scope\" ng-repeat=\"mailingListItem in contactMailingListsCtrl.mailingLists track by $index\"><div class=col-6><span class=select><select ng-model=contactMailingListsCtrl.mailingLists[$index] ng-options=\"title for title in contactMailingListsCtrl.mailingListsSelectData track by title\"></select></span></div><div class=col-4><a class=\"btn btn_action ng-scope\" ng-click=contactMailingListsCtrl.removeListItem($index) ng-if=\"contactMailingListsCtrl.mailingLists.length > 1\"><i class=dhlicon-cancel></i><span nls=address-book.remove_label></span></a></div></div><a class=\"btn btn_animate btn_small\" ng-click=contactMailingListsCtrl.addNewListItem()><i class=dhlicon-add></i><span class=btn__text nls=address-book.add_another_label></span></a></div></div></div>'
        };
    }
});
//# sourceMappingURL=contact-mailing-lists-directive.js.map
