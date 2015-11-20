import ewf from 'ewf';

ewf.controller('EwfModalController', EwfModalController);

EwfModalController.$inject = ['$scope', '$element', '$transclude'];

export default function EwfModalController($scope, $element, $transclude) {
    const vm = this;
    const dialogScope = $scope.$parent;

    vm.close = dialogScope.$close;
    vm.dismiss = dialogScope.$dismiss;

    dialogScope.ewfModalCtrl = vm;

    $transclude(dialogScope, (content) => {
        $element.find('.ewf-modal__content').append(content);
    });
}
