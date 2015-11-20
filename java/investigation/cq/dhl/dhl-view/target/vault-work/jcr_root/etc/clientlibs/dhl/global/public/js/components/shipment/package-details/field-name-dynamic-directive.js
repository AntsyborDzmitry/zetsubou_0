define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = fieldNameDynamic;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('fieldNameDynamic', fieldNameDynamic);

    function fieldNameDynamic() {
        return {
            restrict: 'A',
            priority: -1,
            require: ['ngModel'],
            link: {
                post: function post(scope, elem, attrs, ctrls) {
                    var name = elem[0].name;
                    name += attrs.fieldNameDynamic;

                    var modelCtrl = ctrls[0];
                    modelCtrl.$name = name;
                }
            }
        };
    }
});
//# sourceMappingURL=field-name-dynamic-directive.js.map
