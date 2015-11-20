import ewf from 'ewf';
import EwfMyProfileController from './ewf-my-profile-controller';

ewf.directive('ewfMyProfile', function() {
    return {
        restrict: 'E',
        controller: EwfMyProfileController,
        controllerAs: 'myProfileCtrl',
        templateUrl: 'ewf-my-profile-layout.html'
    };
});
