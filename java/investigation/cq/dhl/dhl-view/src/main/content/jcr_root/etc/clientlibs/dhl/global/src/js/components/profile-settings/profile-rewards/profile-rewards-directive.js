import ewf from 'ewf';
import ProfileRewardsController from './profile-rewards-controller';
import './../../../directives/ewf-input/ewf-input-directive';
import './../../../directives/ewf-validate/ewf-validate-pattern-directive';

ewf.directive('profileRewards', ProfileRewards);

function ProfileRewards() {
    return {
        restrict: 'E',
        controller: ProfileRewardsController,
        controllerAs: 'profileRewardsCtrl',
        require: 'profileRewards'
    };
}
