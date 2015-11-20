import ewf from 'ewf';
import ProductUploadListController from './product-upload-list-controller';

ewf.directive('productUploadList', ProductUploadList);

export default function ProductUploadList() {
    return {
        restrict: 'E',
        controller: ProductUploadListController,
        controllerAs: 'productUploadListCtrl'
    };
}
