import 'angularMocks';
import EwfFieldController from './ewf-field-controller';

describe('EwfFieldController', () => {
    let sut;
    beforeEach(() => {
        sut = new EwfFieldController();
    });
    describe('#constructor', () => {
        it('should has ewfFormCtrl property', () => {
            expect(sut.ewfFormCtrl).toBeDefined();
        });
    });
});
