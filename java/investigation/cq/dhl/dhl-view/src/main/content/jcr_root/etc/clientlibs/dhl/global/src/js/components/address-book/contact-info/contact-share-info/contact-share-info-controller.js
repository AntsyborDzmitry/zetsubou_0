import '../../../../services/attrs-service';

ContactShareInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

export default function ContactShareInfoController($scope, $attrs, attrsService) {
    const vm = this;
    attrsService.track($scope, $attrs, 'shareSettings', vm);
}
