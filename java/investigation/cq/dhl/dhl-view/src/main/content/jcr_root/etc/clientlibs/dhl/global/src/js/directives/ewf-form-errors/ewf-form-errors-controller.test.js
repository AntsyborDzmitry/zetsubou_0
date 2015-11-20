import EwfFormErrorsController from './ewf-form-errors-controller';
import 'angularMocks';

describe('EwfFormErrorsController', () => {
    let sut;

    beforeEach(module('ewf'));

    describe('#constructor', () => {
        it('event with server errors', () => {
            sut = new EwfFormErrorsController();

            expect(sut.errorMessages).toEqual([]);
            expect(sut.formCtrl).toEqual(null);
        });
    });
});
