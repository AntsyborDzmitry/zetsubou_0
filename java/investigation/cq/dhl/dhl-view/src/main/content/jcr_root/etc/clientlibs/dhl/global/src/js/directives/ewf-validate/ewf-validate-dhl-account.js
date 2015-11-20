//import ewf from 'ewf';
//import './../validation/services/validation-service';
//
//ewfValidateDhlAccount.$inject = ['validationService'];
//ewf.directive('ewfValidateDhlAccount', ewfValidateDhlAccount);
//
//
//export default function ewfValidateDhlAccount(validationService) {
//    return {
//        restrict: 'A',
//        require: ['ewfInput'],
//        link: {
//            pre: function (scope, element, attrs, controllers) {
//                const [inputCtrl] = controllers;
//                const isImpAccount = attrs.ewfValidateDhlAccount === 'IMP';
//                inputCtrl.addValidator(
//                      validationService.createValidatorByDirective('dhlAccount', {isImp: isImpAccount}));
//            }
//        }
//    };
//}
