import ewf from 'ewf';
import './../../directives/ewf-form/ewf-form-directive';
import PackagingSettingsController from './packaging-settings-controller';

ewf.directive('packagingSettings', PackagingSettings);

export default function PackagingSettings() {
    return {
        restrict: 'E',
        controller: PackagingSettingsController,
        controllerAs: 'packagingSettingsCtrl',
        require: ['packagingSettings', 'ewfContainer'],
        link: {
            post: function(scope, element, attributes, controllers) {
                const [packagingSettingsCtrl, ewfContainerCtrl] = controllers;

                const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
                gridCtrl.ctrlToNotify = packagingSettingsCtrl;

                packagingSettingsCtrl.gridCtrl = gridCtrl;
                packagingSettingsCtrl.init();
            }
        }
    };
}
