define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    /**
     * typeAheadService is for autocomplete of address field in registration form.
     * addresses - is for query simulation
     * value.fullAddr - is for concatination of all strings of addresses
     */

    'use strict';

    module.exports = typeAheadService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('typeAheadService', typeAheadService);

    function typeAheadService() {
        this.getAddressList = getAddr;

        var addresses = [{ addr: 'amosova', city: 'kiev', zip: '69006' }, { addr: 'kudrashova', city: 'kiev', zip: '69206' }, { addr: 'zhilanska', city: 'kiev', zip: '69036' }, { addr: 'olimpijska', city: 'kiev', zip: '69506' }, { addr: 'artema', city: 'kiev', zip: '69006' }, { addr: 'lenina', city: 'kiev', zip: '79006' }, { addr: 'amosova', city: 'kiev', zip: '69026' }, { addr: 'kudrashova', city: 'kiev', zip: '69206' }, { addr: 'zhilanska', city: 'kiev', zip: '69006' }, { addr: 'olimpijska', city: 'kiev', zip: '69066' }, { addr: 'artema', city: 'kiev', zip: '69036' }, { addr: 'lenina', city: 'kiev', zip: '69006' }, { addr: 'amosova', city: 'kiev', zip: '69006' }, { addr: 'kudrashova', city: 'kiev', zip: '69006' }, { addr: 'zhilanska', city: 'kiev', zip: '61006' }, { addr: 'olimpijska', city: 'kiev', zip: '69006' }, { addr: 'artema', city: 'kiev', zip: '69006' }, { addr: 'lenina', city: 'kiev', zip: '69006' }, { addr: 'feodosijska', city: 'kiev', zip: '69006' }];

        addresses.forEach(function (value) {
            return value.fullAddr = value.addr + ', ' + value.city + ', ' + value.zip;
        });

        function getAddr() {
            return addresses;
        }
    }
});
//# sourceMappingURL=type-ahead-service.js.map
