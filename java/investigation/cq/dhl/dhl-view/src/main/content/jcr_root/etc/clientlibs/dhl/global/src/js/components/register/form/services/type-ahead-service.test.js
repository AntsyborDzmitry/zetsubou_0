import typeAheadService from './type-ahead-service';

describe('typeAheadService', function() {

    let sut;

    beforeEach(function() {
      sut = new typeAheadService();
    });

    it('should be an object', function() {
        expect(sut.getAddressList()).toEqual(jasmine.any(Object));
    });

    it('should be not empty object', function() {
        expect(sut.getAddressList().length).toBeGreaterThan(0);
    });

});
