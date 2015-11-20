/**
 * typeAheadService is for autocomplete of address field in registration form.
 * addresses - is for query simulation
 * value.fullAddr - is for concatination of all strings of addresses
 */


import ewf from 'ewf';

ewf.service('typeAheadService', typeAheadService);

export default function typeAheadService() {
    this.getAddressList = getAddr;

        let addresses = [
            {addr: 'amosova', city: 'kiev', zip: '69006'},
            {addr: 'kudrashova', city: 'kiev', zip: '69206'},
            {addr: 'zhilanska', city: 'kiev', zip: '69036'},
            {addr: 'olimpijska', city: 'kiev', zip: '69506'},
            {addr: 'artema', city: 'kiev', zip: '69006'},
            {addr: 'lenina', city: 'kiev', zip: '79006'},
            {addr: 'amosova', city: 'kiev', zip: '69026'},
            {addr: 'kudrashova', city: 'kiev', zip: '69206'},
            {addr: 'zhilanska', city: 'kiev', zip: '69006'},
            {addr: 'olimpijska', city: 'kiev', zip: '69066'},
            {addr: 'artema', city: 'kiev', zip: '69036'},
            {addr: 'lenina', city: 'kiev', zip: '69006'},
            {addr: 'amosova', city: 'kiev', zip: '69006'},
            {addr: 'kudrashova', city: 'kiev', zip: '69006'},
            {addr: 'zhilanska', city: 'kiev', zip: '61006'},
            {addr: 'olimpijska', city: 'kiev', zip: '69006'},
            {addr: 'artema', city: 'kiev', zip: '69006'},
            {addr: 'lenina', city: 'kiev', zip: '69006'},
            {addr: 'feodosijska', city: 'kiev', zip: '69006'}
        ];

    addresses.forEach((value) => value.fullAddr = `${value.addr}, ${value.city}, ${value.zip}`);

    function getAddr() {
        return addresses;
    }
}
