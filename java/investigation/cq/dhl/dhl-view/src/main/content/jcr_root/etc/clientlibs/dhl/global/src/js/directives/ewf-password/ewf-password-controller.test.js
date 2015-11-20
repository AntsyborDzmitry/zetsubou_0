import EwfPasswordController from './ewf-password-controller';
import InputPasswordController from './../ewf-input-password/ewf-input-password-controller';

describe('EwfPasswordController', () => {
    let sut, ewfInputPasswordCtrl;

    beforeEach(module('ewf'));
    beforeEach(inject(() => {
        ewfInputPasswordCtrl = jasmine.mockComponent(new InputPasswordController());
        sut = new EwfPasswordController();
    }));

    describe('#showErrorIfPasswordIsEmpty', () => {
        it('should not show error if validation is visible', () => {
            ewfInputPasswordCtrl.validationIsVisible = true;
            sut.parentForm = {
                pswd: {
                    $dirty: true
                }
            };

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(false);
        });

        it('should not show error if parent form is not dirty', () => {
            ewfInputPasswordCtrl.validationIsVisible = false;
            sut.parentForm = {
                pswd: {
                    $dirty: false
                }
            };

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(false);
        });

        it('should not show error if password is not empty', () => {
            ewfInputPasswordCtrl.validationIsVisible = false;
            sut.parentForm = {
                pswd: {
                    $dirty: true
                }
            };
            sut.password = 'password';

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(false);
        });

        it('should show error if validation is not visible', () => {
            ewfInputPasswordCtrl.validationIsVisible = false;
            sut.parentForm = {
                pswd: {
                    $dirty: true
                }
            };

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(true);
        });

        it('should show error if parent form is dirty', () => {
            ewfInputPasswordCtrl.validationIsVisible = false;
            sut.parentForm = {
                pswd: {
                    $dirty: true
                }
            };

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(true);
        });

        it('should show error if password is empty', () => {
            ewfInputPasswordCtrl.validationIsVisible = false;
            sut.parentForm = {
                pswd: {
                    $dirty: true
                }
            };
            sut.password = '';

            const result = sut.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl);

            expect(result).toEqual(true);
        });
    });
});
