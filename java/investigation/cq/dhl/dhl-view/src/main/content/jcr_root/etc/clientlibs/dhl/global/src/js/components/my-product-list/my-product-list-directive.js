import ewf from 'ewf';
import './../../directives/ewf-form/ewf-form-directive';
import MyProductListController from './my-product-list-controller';

ewf.directive('myProductList', MyProductList);

export default function MyProductList() {
    return {
        restrict: 'E',
        controller: MyProductListController,
        controllerAs: 'myProductListCtrl',
        require: ['myProductList', 'ewfContainer'],
        link: {
            post: postLink
        }
    };
}

function postLink(scope, element, attributes, controllers) {
    const [MyProductListCtrl, ewfContainerCtrl] = controllers;

    const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
    gridCtrl.ctrlToNotify = MyProductListCtrl;

    MyProductListCtrl.gridCtrl = gridCtrl;
    MyProductListCtrl.init();
}
