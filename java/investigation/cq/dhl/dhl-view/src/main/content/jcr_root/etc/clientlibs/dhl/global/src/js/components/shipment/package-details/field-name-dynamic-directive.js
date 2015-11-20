import ewf from 'ewf';
ewf.directive('fieldNameDynamic', fieldNameDynamic);

export default function fieldNameDynamic() {
    return {
        restrict: 'A',
        priority: -1,
        require: ['ngModel'],
        link: {
            post: function(scope, elem, attrs, ctrls) {
                let name = elem[0].name;
                name += attrs.fieldNameDynamic;

                let modelCtrl = ctrls[0];
                modelCtrl.$name = name;
            }
        }
    };
}
