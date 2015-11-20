import ewf from 'ewf';
import PaperlessCustomsController from './paperless-customs-controller';

ewf.directive('ewfPaperlessCustoms', PaperlessCustoms);

export default function PaperlessCustoms() {
    return {
        restrict: 'AE',
        controller: PaperlessCustomsController,
        controllerAs: 'paperlessCustomsCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.loadSettings();
    }
}
