define(['exports', 'module', './base-validator'], function (exports, module, _baseValidator) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var _BaseValidator2 = _interopRequireDefault(_baseValidator);

    var LengthValidator = (function (_BaseValidator) {
        _inherits(LengthValidator, _BaseValidator);

        function LengthValidator(options) {
            _classCallCheck(this, LengthValidator);

            _get(Object.getPrototypeOf(LengthValidator.prototype), 'constructor', this).call(this, options);
            this.setCSSClass('ewf-length-validation');
            this.setMessage('errors.length_error_message');
        }

        _createClass(LengthValidator, [{
            key: 'validate',
            value: function validate(value) {
                if (typeof value === 'undefined') {
                    return true;
                }

                if (typeof this.options.min === 'number' && value.length < this.options.min) {
                    return false;
                }

                if (typeof this.options.max === 'number' && value.length > this.options.max) {
                    return false;
                }

                return true;
            }
        }]);

        return LengthValidator;
    })(_BaseValidator2['default']);

    module.exports = LengthValidator;
});
//# sourceMappingURL=length-validator.js.map
