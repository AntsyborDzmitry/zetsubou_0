import DigitalCustomsInvoiceController from './digital-customs-invoice-controller';
import CrudService from './../../../../services/ewf-crud-service';
import ModalService from './../../../../services/modal/modal-service';
import 'angularMocks';

describe('DigitalCustomsInvoiceController', () => {
    let sut;
    let $q, $timeout;
    let $scope;
    let crudService, modalService;

    beforeEach(inject(($rootScope, _$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        modalService = jasmine.mockComponent(new ModalService());
        crudService = jasmine.mockComponent(new CrudService());

        $scope = Object.assign($rootScope.$new(), {
            digitalCustomsInvoice: {
                document: null,
                additionalDocuments: []
            }
        });
        sut = new DigitalCustomsInvoiceController($scope, crudService, modalService);
    }));

    describe('#getFormAction', () => {
        it('should return valid url', () => {
            const countryCode = 'UA';
            $scope.countryCode = countryCode;

            expect(sut.getFormAction()).toBe(`/api/shipment/customs-invoice/digital/${$scope.countryCode}`);
        });
    });

    describe('#showEnrollmentDialog', () => {
        it('should use modal service', () => {
            modalService.showDialog.and.returnValue({
                result: $q.when()
            });
            sut.showEnrollmentDialog();

            expect(modalService.showDialog).toHaveBeenCalledWith({
                template: jasmine.any(String)
            });
        });

        it('should enroll if resolved', () => {
            spyOn(sut, 'enroll');
            modalService.showDialog.and.returnValue({
                result: $q.when()
            });
            sut.showEnrollmentDialog();
            $timeout.flush();

            expect(sut.enroll).toHaveBeenCalled();
        });
    });

    describe('#handleCustomsInvoiceUploadSuccess', () => {
        const file = {
            key: 'key',
            fileName: 'name'
        };
        let successHandled;

        beforeEach(() => {
            successHandled = false;
            function onSuccessHandled() {
                successHandled = true;
            }

            sut.handleCustomsInvoiceUploadSuccess([file], onSuccessHandled);
        });

        it('should add customs invoice to shipment documents', () => {
            expect($scope.digitalCustomsInvoice.document).toEqual(file);
        });

        it('should execute callback', () => {
            expect(successHandled).toBe(true);
        });
    });

    describe('#handleCustomsInvoiceUploadError', () => {
        it('should handle error', () => {
            const errors = [
                'error_1',
                'error_2'
            ];
            sut.handleCustomsInvoiceUploadError(errors);

            expect(sut.customsInvoiceUploadErrors).toEqual(errors);
        });
    });

    describe('#clearCustomsInvoiceUploadErrors', () => {
        const errors = [
            'error_1',
            'error_2'
        ];
        let errorsCleared;

        beforeEach(() => {
            sut.handleCustomsInvoiceUploadError(errors);

            errorsCleared = false;
            function onErrorsCleared() {
                errorsCleared = true;
            }
            sut.clearCustomsInvoiceUploadErrors(onErrorsCleared);
        });

        it('should clear errors', () => {
            expect(sut.customsInvoiceUploadErrors).toBeFalsy();
        });

        it('should execute callback', () => {
            expect(errorsCleared).toBe(true);
        });
    });

    describe('#deleteCustomsInvoice', () => {
        const file = {
            key: 'key',
            fileName: 'name'
        };

        beforeEach(() => {
            sut.handleCustomsInvoiceUploadSuccess([file], angular.noop);

            crudService.deleteElement.and.returnValue($q.when());
            sut.deleteCustomsInvoice();
            $timeout.flush();
        });

        it('should delete invoice from shipment documents', () => {
            expect($scope.digitalCustomsInvoice.document).toBe(null);
        });

        it('should send delete request to server', () => {
            expect(crudService.deleteElement)
                .toHaveBeenCalledWith(`/api/shipment/customs-invoice/digital/${file.key}`);
        });
    });

    describe('#handleAdditionalDocumentsUploadSuccess', () => {
        const file = {
            key: 'key',
            fileName: 'name'
        };
        let successHandled;

        beforeEach(() => {
            successHandled = false;
            function onSuccessHandled() {
                successHandled = true;
            }

            sut.handleAdditionalDocumentsUploadSuccess([file], onSuccessHandled);
        });

        it('should add additional document to shipment documents', () => {
            expect($scope.digitalCustomsInvoice.additionalDocuments).toEqual([file]);
        });

        it('should execute callback', () => {
            expect(successHandled).toBe(true);
        });
    });

    describe('#handleAdditionalDocumentsUploadError', () => {
        it('should handle error', () => {
            const errors = [
                'error_1',
                'error_2'
            ];
            sut.handleAdditionalDocumentsUploadError(errors);

            expect(sut.additionalDocumentsUploadErrors).toEqual(errors);
        });
    });

    describe('#clearAdditionalDocumentsUploadErrors', () => {
        const errors = [
            'error_1',
            'error_2'
        ];
        let errorsCleared;

        beforeEach(() => {
            sut.handleAdditionalDocumentsUploadError(errors);

            errorsCleared = false;
            function onErrorsCleared() {
                errorsCleared = true;
            }
            sut.clearAdditionalDocumentsUploadErrors(onErrorsCleared);
        });

        it('should clear errors', () => {
            expect(sut.additionalDocumentsUploadErrors).toBeFalsy();
        });

        it('should execute callback', () => {
            expect(errorsCleared).toBe(true);
        });
    });

    describe('#deleteAdditionalDocument', () => {
        const file = {
            key: 'key',
            fileName: 'name'
        };

        beforeEach(() => {
            sut.handleAdditionalDocumentsUploadSuccess([file], angular.noop);

            crudService.deleteElement.and.returnValue($q.when());
            sut.deleteAdditionalDocument(0);
            $timeout.flush();
        });

        it('should delete additional document from shipment documents', () => {
            expect($scope.digitalCustomsInvoice.additionalDocuments).toEqual([]);
        });

        it('should send delete request to server', () => {
            expect(crudService.deleteElement)
                .toHaveBeenCalledWith(`/api/shipment/customs-invoice/digital/${file.key}`);
        });
    });

    describe('#isEnrolled', () => {
        it('should not be enrolled at start', () => {
            expect(sut.isEnrolled()).toBe(false);
        });

        it('should be enrolled after enrollment', () => {
            sut.enroll();
            expect(sut.isEnrolled()).toBe(true);
        });
    });

    describe('#isDismissed', () => {
        it('should not be dismissed at start', () => {
            expect(sut.isDismissed()).toBe(false);
        });

        it('should be dismissed after dismissal', () => {
            sut.dismiss();
            expect(sut.isDismissed()).toBe(true);
        });
    });
});
