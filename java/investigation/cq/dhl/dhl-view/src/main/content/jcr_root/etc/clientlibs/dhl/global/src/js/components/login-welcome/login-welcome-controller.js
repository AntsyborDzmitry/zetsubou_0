import './../../services/modal/modal-service';

LoginWelcomeController.$inject = ['$scope', 'modalService', 'navigationService'];

/**
 * Login Welcome controller
 */
export default function LoginWelcomeController($scope, modalService, navigationService) {
    const vm = this;
    vm.openRegistrationBenefitsPopup = function() {
        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'registration-benefits-modal.html'
        });
    };

    vm.goToRegistration = function() {
        navigationService.location('registration.html');
    };
}
