/**
 * Test suit for user service
 */
import loginService from './login-service';
import 'angularMocks';

describe('loginService', () => {
    let sut, localStorageService;

    beforeEach(() => {
        localStorageService = jasmine.createSpyObj('localStorageService', ['set', 'get', 'remove']);

        sut = new loginService(localStorageService);
    });

    describe('#saveNextFormTitle', () => {
        it('should store next title for form in localStorage', () => {
            const title = 'some_new_title';
            sut.saveNextFormTitle(title);
            expect(localStorageService.set).toHaveBeenCalledWith('login.next_form_title', title);
        });
    });

    describe('#getNextFormTitle', () => {
        it('should return title for form from localStorage', () => {
            const title = 'some_new_title';
            const key = 'login.next_form_title';
            localStorageService.get.and.returnValue(title);

            const result = sut.getNextFormTitle();

            expect(localStorageService.get).toHaveBeenCalledWith(key);
            expect(result).toBe(title);
        });

        it('should remove saved title from localStorage when it was returned once', () => {
            const key = 'login.next_form_title';
            sut.getNextFormTitle();
            expect(localStorageService.remove).toHaveBeenCalledWith(key);
        });
    });

    describe('#resolveFormTitle', () => {
        it('should return saved next title value', () => {
            const title = 'test';
            spyOn(sut, 'getNextFormTitle').and.returnValue(title);

            const result = sut.resolveFormTitle();

            expect(result).toBe(title);
        });

        it('should return default title value if there is no saved next title', () => {
            spyOn(sut, 'getNextFormTitle').and.returnValue(null);
            const result = sut.resolveFormTitle();
            expect(result).toBe('login.form_title_default');
        });
    });

    describe('Error processing', () => {
        let errors;
        let expiredError, userInactiveError, userInactiveAndActivationExpired;

        beforeEach(() => {
            expiredError = sut.errorKeys.PASSWORD_EXPIRED;
            userInactiveError = sut.errorKeys.PENDING_ACTIVATION;
            userInactiveAndActivationExpired = sut.errorKeys.PENDING_ACTIVATION_EXPIRED;

            errors = [];
        });

        it('should check if errors includes password expiration error', () => {
            let result = sut.isPasswordExpired(errors);
            expect(result).toBeFalsy();
            errors.push(expiredError);

            result = sut.isPasswordExpired(errors);
            expect(result).toBeTruthy();
        });

        it('should check if errors includes user inactive error', () => {
            let result = sut.isUserInactive(errors);
            expect(result).toBeFalsy();
            errors.push(userInactiveError);

            result = sut.isUserInactive(errors);
            expect(result).toBeTruthy();
        });

        it('should check if errors includes user inactive and activation expired error', () => {
            let result = sut.isUserInactiveAndActivationExpired(errors);
            expect(result).toBeFalsy();
            errors.push(userInactiveAndActivationExpired);

            result = sut.isUserInactiveAndActivationExpired(errors);
            expect(result).toBeTruthy();
        });
    });
});
