import ewf from 'ewf';
import ProfileSettingsController from './profile-settings-controller';
import './profile-password/profile-password-directive';
import './profile-rewards/profile-rewards-directive';
import './profile-quick-links/profile-quick-links-directive';

ewf.directive('ewfProfileSettings', ewfProfileSettings);

function ewfProfileSettings() {
    return {
        restrict: 'E',
        controller: ProfileSettingsController,
        controllerAs: 'profileSettingsCtrl'
    };
}
