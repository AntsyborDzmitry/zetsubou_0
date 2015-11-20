import ewf from 'ewf';
import MyProductFormController from './my-product-form-controller';

ewf.directive('ewfMyProductForm', MyProductFormDirective);

export default function MyProductFormDirective() {
    return {
        restrict: 'AE',
        controller: MyProductFormController,
        controllerAs: 'myProductFormCtrl',
        link
    };

    function link(scope, element, attrs, controller) {
        controller.init();
    }
}
