define(['exports', 'module', 'ewf', './ewf-modal-controller'], function (exports, module, _ewf, _ewfModalController) {
    'use strict';

    module.exports = ewfModal;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfModalController = _interopRequireDefault(_ewfModalController);

    _ewf2['default'].directive('ewfModal', ewfModal);

    function ewfModal() {
        return {
            restrict: 'EA',
            controller: _EwfModalController['default'],
            controllerAs: 'ewfModalCtrl',
            template: '<div class=ewf-modal ng-class=\"dialogWidth ? \'ewf-modal_width_\' + dialogWidth : null\"><div class=ewf-modal__dialog><div class=ewf-modal__wrapper><div class=ewf-modal__content><button class=btn-close ng-if=!noCloseButton ng-click=ewfModalCtrl.dismiss();></button><div class=ewf-modal__header ng-if=!noHeader><h3 class=ewf-modal__title><span ng-if=title ng-bind=title></span> <span ng-if=nlsTitle nls={{nlsTitle}}></span></h3></div></div></div></div></div>',
            transclude: true,
            scope: {
                title: '@',
                nlsTitle: '@',
                dialogWidth: '@',
                noCloseButton: '=',
                noHeader: '='
            }
        };
    }
});
//# sourceMappingURL=ewf-modal-directive.js.map
