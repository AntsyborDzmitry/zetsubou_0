import ewf from 'ewf';
import ProfileQuickLinksController from './profile-quick-links-controller';
import './../../../directives/ewf-grid/ewf-grid-directive';
import './../../../directives/ewf-grid/ewf-grid-pagination-directive';

ewf.directive('ewfProfileQuickLinks', ewfProfileQuickLinks);

function ewfProfileQuickLinks() {
    return {
        restrict: 'AE',
        controller: ProfileQuickLinksController,
        controllerAs: 'profileQuickLinksCtrl',
        require: ['ewfProfileQuickLinks', 'ewfContainer'],
        link: {
            post: function(scope, element, attributes, controllers) {
                const [ewfProfileQuickLinksCtrl, ewfContainerCtrl] = controllers;

                const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
                gridCtrl.ctrlToNotify = ewfProfileQuickLinksCtrl;

                ewfProfileQuickLinksCtrl.gridCtrl = gridCtrl;
                ewfProfileQuickLinksCtrl.init();
            }
        }
    };
}
