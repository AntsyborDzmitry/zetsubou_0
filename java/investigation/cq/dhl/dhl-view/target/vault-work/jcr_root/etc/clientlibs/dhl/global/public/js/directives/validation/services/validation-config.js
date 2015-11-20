define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = validationConfig;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].factory('validationConfig', validationConfig);

    function validationConfig() {
        return {
            EMAIL_PATTERN: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]*)\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/,
            PASSWORD_PATTERN: /(^[\x20-\x7A]*)$/,
            EMAIL_MAX_LENGTH: 100,
            PASSWORD_MAX_LENGTH: 35,
            EMAIL_ADDRESS_INAPPROPRIATE_FORMAT: 'errors.email_inappropriate_format_message',
            PASSWORD_INAPPROPRIATE_FORMAT: 'errors.password_inappropriate_format_message',
            PASSWORD_REQUIRED_ERROR: 'errors.required_field_error_password_is_empty',
            EMAIL_EXIST: 'errors.validation_email_already_exists'
        };
    }
});
//# sourceMappingURL=validation-config.js.map
