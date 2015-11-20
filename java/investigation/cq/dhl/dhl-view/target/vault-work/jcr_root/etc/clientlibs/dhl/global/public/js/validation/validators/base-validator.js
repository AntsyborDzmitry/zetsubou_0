define(['exports', 'module'], function (exports, module) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var BaseValidator = (function () {
        function BaseValidator() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, BaseValidator);

            this.setOptions(options);
        }

        _createClass(BaseValidator, [{
            key: 'getMessage',
            value: function getMessage() {
                return this.options.msg || this.msg || '';
            }
        }, {
            key: 'setMessage',
            value: function setMessage(msg) {
                this.msg = msg || '';
            }
        }, {
            key: 'setCSSClass',
            value: function setCSSClass(cssClass) {
                this.cssClass = cssClass;
            }
        }, {
            key: 'getCSSClass',
            value: function getCSSClass() {
                return this.cssClass || '';
            }
        }, {
            key: 'setOptions',
            value: function setOptions(options) {
                this.options = options;
            }
        }, {
            key: 'getOptions',
            value: function getOptions() {
                return this.options;
            }
        }, {
            key: 'validate',
            value: function validate() {
                throw new Error('BaseValidator#validate should be implemented in child.');
            }
        }]);

        return BaseValidator;
    })();

    module.exports = BaseValidator;
});
//# sourceMappingURL=base-validator.js.map
