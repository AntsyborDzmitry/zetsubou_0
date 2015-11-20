import ewf from 'ewf';
import EwfPdfController from './ewf-pdf-controller';

ewf.directive('ewfPdf', function() {
    return {
        restrict: 'E',
        controller: EwfPdfController,
        controllerAs: 'pdfCtrl',
        templateUrl: 'ewf-pdf-layout.html',
        link: {
            post: postLink
        }
    };

    //TODO: write test for postLink
    function postLink(scope, element, attrs, ctrl) {
        ctrl.canvas = element.find('canvas');
    }
});
