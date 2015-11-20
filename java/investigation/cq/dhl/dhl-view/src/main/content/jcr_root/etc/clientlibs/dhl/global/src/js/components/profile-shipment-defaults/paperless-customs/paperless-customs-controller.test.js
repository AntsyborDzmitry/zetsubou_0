import 'angularMocks';
import systemSettings from './../../../constants/system-settings-constants';
import ModalService from './../../../services/modal/modal-service';
import EwfCrudService from './../../../services/ewf-crud-service';
import EwfFormController from './../../../directives/ewf-form/ewf-form-controller';

import PaperlessCustomsController from './paperless-customs-controller';

describe('PaperlessCustomsController', () => {
    const CUSTOMS_ENDPOINT = '/api/myprofile/customs';
    const PAPERLESS_SETTINGS_ENDPOINT = `${CUSTOMS_ENDPOINT}/paperless`;
    const PAPERLESS_STATUS_ENDPOINT = `${PAPERLESS_SETTINGS_ENDPOINT}/status`;

    let sut;
    let $timeout;
    let $rootScope;
    let deferred;
    let mockEwfCrudService;
    let mockModalService;
    let ewfFormController;

    beforeEach(inject((_$timeout_, _$q_, _$rootScope_) => {
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        deferred = _$q_.defer();
        mockEwfCrudService = jasmine.mockComponent(new EwfCrudService());
        mockEwfCrudService.getElementList.and.returnValue(deferred.promise);
        mockEwfCrudService.updateElement.and.returnValue(deferred.promise);
        mockEwfCrudService.changeElement.and.returnValue(deferred.promise);
        mockEwfCrudService.deleteElement.and.returnValue(deferred.promise);
        mockModalService = jasmine.mockComponent(new ModalService());
        ewfFormController = jasmine.mockComponent(new EwfFormController());
        ewfFormController.ewfValidation.and.returnValue(deferred.promise);
        sut = new PaperlessCustomsController(
            _$q_,
            $timeout,
            systemSettings,
            mockEwfCrudService,
            mockModalService
        );
    }));

    describe('#loadSettings', () => {
        it('should use EwfCrudService to get settings from the server', () => {
            sut.loadSettings();
            expect(mockEwfCrudService.getElementList).toHaveBeenCalledWith(PAPERLESS_SETTINGS_ENDPOINT);
        });

        it('should extend default settings with server response data', () => {
            const serverResponseField = 'server response field';
            sut.settings = {};
            sut.loadSettings();
            deferred.resolve({name: serverResponseField});
            $timeout.flush();
            expect(sut.settings.name).toBe(serverResponseField);
        });
    });

    describe('#updateSettings', () => {
        it('should not make request to the server if DHL generation and form is invalid', () => {
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.signature = {};
            sut.signerForm = {$valid: false};

            sut.updateSettings(ewfFormController);
            expect(mockEwfCrudService.updateElement).not.toHaveBeenCalled();
        });

        it('should not make request to the server if DHL generation and no signature uploaded', () => {
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.signature = null;
            sut.signerForm = {};

            sut.updateSettings(ewfFormController);
            expect(mockEwfCrudService.updateElement).not.toHaveBeenCalled();
        });

        it('should use EwfCrudService to update settings data on the server if OWN generation', () => {
            const params = sut.settings = {name: 'some settings data', generatedBy: sut.generated.OWN};
            sut.updateSettings(ewfFormController);
            expect(mockEwfCrudService.updateElement).toHaveBeenCalledWith(PAPERLESS_SETTINGS_ENDPOINT, params);
        });

        it('should receive proper arguments', () => {
            sut.settings = {name: 'some settings data'};
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.logo = {key: 'abc', src: '/signature.jpg'};
            sut.settings.signature = {key: 'bcd', src: '/signature.jpg'};
            sut.signerForm = {$valid: true};

            const expectedSettings = {
                logo: sut.settings.logo.key,
                signature: sut.settings.signature.key,
                name: sut.settings.name,
                generatedBy: sut.settings.generatedBy
            };

            sut.updateSettings(ewfFormController);

            expect(mockEwfCrudService.updateElement)
                .toHaveBeenCalledWith(PAPERLESS_SETTINGS_ENDPOINT, jasmine.any(Object));

            expect(mockEwfCrudService.updateElement.calls.all()[0].args[1])
                .toEqual(jasmine.objectContaining(expectedSettings));
        });
    });

    describe('#togglePaperlessHelp', () => {
       it('should toggle showing paperless help tooltip', () => {
           sut.isPaperlessHelpShown = false;
           sut.togglePaperlessHelp();
           expect(sut.isPaperlessHelpShown).toBe(true);
       });
    });

    describe('#isEnrollmentDisplayed', () => {
        it('should display enrollment section during enrollmentRequest phase', () => {
            sut.settings.enrolled = false;
            sut.enrollmentRequest = true;
            expect(sut.isEnrollmentDisplayed()).toBe(true);
        });

        it('should display enrollment section when enrollment is active', () => {
            sut.settings.enrolled = true;
            sut.enrollmentRequest = false;
            expect(sut.isEnrollmentDisplayed()).toBe(true);
        });

        it('should not display enrollment section when enrollment is not active and not in enrollmentRequest', () => {
            sut.settings.enrolled = false;
            sut.enrollmentRequest = false;
            expect(sut.isEnrollmentDisplayed()).toBe(false);
        });
    });

    describe('#isTermsAgreementDisplayed', () => {
        it('should display Terms and Conditions when user is not enrolled and generation is chosen', () => {
            sut.settings.enrolled = false;
            sut.settings.generatedBy = sut.generated.OWN;

            expect(sut.isTermsAgreementDisplayed()).toBe(true);
        });

        it('should not display Terms and Conditions when user is not enrolled and not generation is chosen', () => {
            sut.settings.enrolled = false;
            sut.settings.generatedBy = undefined;
            expect(sut.isTermsAgreementDisplayed()).toBe(false);
        });

        it('should not display Terms and Conditions when user is  enrolled', () => {
            sut.settings.enrolled = true;
            expect(sut.isTermsAgreementDisplayed()).toBe(false);
        });
    });

    describe('#isSignatureRequiredError', () => {
        it('should display signature required error when DHL generation and no signature uploaded', () => {
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.signature = null;
            sut.actionStatus.displayErrors = true;
            expect(sut.isSignatureRequiredError()).toBe(true);
        });

        it('should not display signature required error when DHL generation and signature uploaded', () => {
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.signature = {src: 'signature.jpg'};
            sut.actionStatus.displayErrors = true;
            expect(sut.isSignatureRequiredError()).toBe(false);
        });

        it('should not display signature required error when displayErrors flag is not set', () => {
            sut.settings.generatedBy = sut.generated.DHL;
            sut.settings.signature = null;
            sut.actionStatus.displayErrors = false;
            expect(sut.isSignatureRequiredError()).toBe(false);
        });

        it('should not display signature required error when OWN generation', () => {
            sut.settings.generatedBy = sut.generated.OWN;
            sut.settings.signature = null;
            sut.actionStatus.displayErrors = false;
            expect(sut.isSignatureRequiredError()).toBe(false);
        });


    });

    describe('#acceptTermsConditions', () => {
        beforeEach(() => {
            sut.settings.enabled = false;
            spyOn(sut, 'updateSettings').and.returnValue(deferred.promise);
            sut.acceptTermsConditions(ewfFormController);
        });

        it('should enable paperless customs by default', () => {
            expect(sut.settings.enabled).toBe(true);
            expect(sut.updateSettings).toHaveBeenCalledWith(ewfFormController);
        });

        describe('on successful response', () => {
            beforeEach(() => {
                sut.enrollmentRequest = true;
                sut.settings.enrolled = false;
                deferred.resolve({result: 'OK'});
                $rootScope.$apply();
            });

            it('should unset enrollment request', () => {
                expect(sut.enrollmentRequest).toBe(false);
            });

            it('should set enrolled setting', () => {
                expect(sut.settings.enrolled).toBe(true);
            });

            it('should show success message', () => {
                expect(sut.actionStatus.enrolled).toBe(true);
            });

            it('should hide success message after timeout', () => {
                $timeout.flush();
                expect(sut.actionStatus.enrolled).toBe(false);
            });
        });
    });

    describe('#enablePaperless', () => {
        beforeEach(() => {
            sut.enablePaperless();
        });

        it('should save "enabled" status to the server', () => {
            expect(mockEwfCrudService.changeElement).toHaveBeenCalledWith(PAPERLESS_STATUS_ENDPOINT, {enabled: true});
        });

        it('should save "enabled" status after successful response from the server', () => {
            sut.settings.enabled = false;
            deferred.resolve({status: 'OK'});
            $rootScope.$apply();
            expect(sut.settings.enabled).toBe(true);
        });
    });

    describe('#pausePaperless', () => {
        beforeEach(() => {
            sut.pausePaperless();
        });

        it('should unset "enabled" status on the server', () => {
            expect(mockEwfCrudService.changeElement).toHaveBeenCalledWith(PAPERLESS_STATUS_ENDPOINT, {enabled: false});
        });

        it('should unset "enabled" status after successful response from the server', () => {
            sut.settings.enabled = true;
            deferred.resolve({status: 'OK'});
            $rootScope.$apply();
            expect(sut.settings.enabled).toBe(false);
        });
    });

    describe('#termsConditionsPopup', () => {
       it('should call modal service with correct params', () => {
           sut.termsConditionsPopup();
           expect(mockModalService.showDialog).toHaveBeenCalledWith({
               closeOnEsc: true,
               windowClass: 'ngdialog-theme-default',
               template: jasmine.any(String) //templateUrl is inlined as template by gulp
           });
       });
    });

    describe('#signatureUploaded', () => {
        const uploadedSignature = {name: 'signature.jpg', src: 'images/signature.jpg'};

        beforeEach(() => {
            sut.errors.signature = ['errors.uploaded_file_has_wrong_dimensions'];
            sut.settings.signature = null;
            sut.signatureUploaded(uploadedSignature);
        });

        it('should clear upload signature errors', () => {
            expect(sut.errors.logo).toEqual([]);
        });

        it('should point uploaded signature to setting', () => {
            expect(sut.settings.signature).toBe(uploadedSignature);
        });
    });

    describe('#logoUploaded', () => {
        const uploadedLogo = {name: 'logo.jpg', src: 'images/logo.jpg'};

        beforeEach(() => {
            sut.errors.logo = ['errors.uploaded_file_has_wrong_dimensions'];
            sut.settings.logo = null;
            sut.logoUploaded(uploadedLogo);
        });

        it('should clear upload logo errors', () => {
            expect(sut.errors.logo).toEqual([]);
        });

        it('should point uploaded logo to setting', () => {
            expect(sut.settings.logo).toBe(uploadedLogo);
        });
    });

    describe('#fileUploadError', () => {
        const type = 'logo';
        const errors = ['errors.uploaded_file_has_wrong_dimensions'];

        beforeEach(() => {
            sut.errors[type] = [];
            sut.fileUploadError({errors, type: 'logo'});
        });

        it('should display server error according to type', () => {
            expect(sut.errors[type]).toBe(errors);
        });

        it('should hide server error after timeout', () => {
            $timeout.flush();
            expect(sut.errors[type]).toEqual([]);
        });

        it('should display generic error if server did not return any errors', () => {
            sut.fileUploadError({errors: [], type: 'logo'});
            expect(sut.errors[type]).toEqual(['errors.uploaded_file_failed']);
        });
    });

    describe('#removeImage', () => {
        const type = 'signature';
        const key = 'some-image-db-key';

        beforeEach(() => {
            sut.settings[type] = {key};
            sut.removeImage(type);
        });

        it('should remove image object from setting', () => {
            $rootScope.$apply();
            expect(sut.settings[type]).toBe(null);
        });
    });
});
