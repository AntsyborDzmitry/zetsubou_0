import ewf from 'ewf';

ewf.directive('ewfPaperlessCustomsTermsConditions', PaperlessCustomsTermsConditions);

export default function PaperlessCustomsTermsConditions() {
    return {
        restrict: 'AE',
        templateUrl: 'paperless-customs-terms-conditions.html'
    };
}
