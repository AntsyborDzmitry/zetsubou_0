define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfModalController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfModalController', EwfModalController);

    EwfModalController.$inject = ['$scope', '$element', '$transclude'];

    function EwfModalController($scope, $element, $transclude) {
        var vm = this;
        var dialogScope = $scope.$parent;

        vm.close = dialogScope.$close;
        vm.dismiss = dialogScope.$dismiss;

        dialogScope.ewfModalCtrl = vm;

        $transclude(dialogScope, function (content) {
            $element.find('.ewf-modal__content').append(content);
        });
    }
});
//# sourceMappingURL=ewf-modal-controller.js.map
