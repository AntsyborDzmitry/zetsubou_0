import EnhancedInvoiceController from './enhanced-invoice-address-controller';
import ModalService from './../../../services/modal/modal-service';
import EnhancedInvoiceModel from './enhanced-invoice-model';
import EwfCrudService from '../../../services/ewf-crud-service';

describe('EnhancedInvoiceAddressController', () => {
    let sut;
    let modalService, enhancedInvoiceModel, ewfCrudService;
    let $scope, $timeout, $q;

    beforeEach(module('ewf'));
    beforeEach(inject((_$rootScope_, _$timeout_, _$q_) => {
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        $q = _$q_;

        ewfCrudService = jasmine.mockComponent(new EwfCrudService());
        modalService = jasmine.mockComponent(new ModalService());
        enhancedInvoiceModel = jasmine.mockComponent(new EnhancedInvoiceModel());
        enhancedInvoiceModel.invoice = {};

        sut = new EnhancedInvoiceController($scope,
                                            $timeout,
                                            modalService,
                                            enhancedInvoiceModel,
                                            ewfCrudService);
    }));

    describe('#init', () => {
        beforeEach(() => {
            spyOn($scope, '$watch');
            sut.init();
        });

        it('should set invoice data to view model', () => {
            expect(sut.invoice).toBe(enhancedInvoiceModel);
        });

        describe('watch contact details', () => {
            let watchHandlerFunction;

            beforeEach(() => {
                watchHandlerFunction = $scope.$watch.calls.mostRecent().args[1];
            });

            it('should watch changes on contact details', () => {
                const watchTargetFunction = $scope.$watch.calls.mostRecent().args[0];
                expect(watchTargetFunction()).toEqual(enhancedInvoiceModel.contactDetails);
            });

            it('should hide confirmation checkmarks', () => {
                watchHandlerFunction();
                $timeout.flush();
                sut.saveConfirmed = true;
                sut.updateConfirmed = true;

                watchHandlerFunction();

                expect(sut.saveConfirmed).toEqual(false);
                expect(sut.updateConfirmed).toEqual(false);
            });

            it('should show Save and Update buttons', () => {
                watchHandlerFunction();
                $timeout.flush();

                watchHandlerFunction();
                expect(sut.showButtons).toEqual(true);
            });

            it('should hide Save and Update buttons when form is cleared', () => {
                watchHandlerFunction();
                expect(sut.showButtons).toEqual(false);
            });
        });

    });

    describe('#addressBookSelected', () => {
        it('should set selected contact details to model', () => {
            const contact = {nickname: 'John Doe'};
            sut.addressBookSelected(contact);
            expect(enhancedInvoiceModel.setContactDetails).toHaveBeenCalledWith(contact);
        });
    });

    describe('#showSaveContactDialog', () => {
        it('should show dialog to save contact', () => {
            sut.showSaveContactDialog();
            expect(modalService.showDialog).toHaveBeenCalledWith(jasmine.any(Object));
        });
    });

    describe('#clearAddress', () => {
        it('should clear contact address form', () => {
            sut.clearAddress();
            expect(enhancedInvoiceModel.clearAddress).toHaveBeenCalledWith();
        });
    });

    describe('Send Contact', () => {
        const nickname = 'John Doe';
        const contactDetails = {
            name: 'John',
            company: 'Some Company',
            email: 'some@email.com',
            addressDetails: {key: 'some key'},
            phone: {
                phoneDetails: {}
            },
            nickName: nickname
        };
        let modalWindow;

        beforeEach(() => {
            spyOn($scope, '$watch');
            sut.init();
            sut.invoice = {
                nickName: nickname,
                contactDetails
            };

            modalWindow = jasmine.createSpyObj('modalWindow', ['close']);
            modalService.showDialog.and.returnValue(modalWindow);
            ewfCrudService.addElement.and.returnValue($q.when());

            sut.showSaveContactDialog();
        });

        describe('#saveContact', () => {
            beforeEach(() => {
                $scope.saveContact(nickname);
                $timeout.flush();
            });

            it('should set nickname', () => {
                expect(sut.nickName).toEqual(nickname);
            });

            it('should save contact using crud service', () => {
                expect(ewfCrudService.addElement).toHaveBeenCalledWith(`/api/addressbook/contact/add`,
                    jasmine.objectContaining({
                        contactDetails: {
                            name: 'John',
                            company: 'Some Company',
                            email: 'some@email.com',
                            addressDetails: {key: 'some key'},
                            phoneDetails: {},
                            nickname
                        }
                    }));
            });

            it('should set flag to show SAVE confirmation', () => {
                expect(sut.saveConfirmed).toEqual(true);
            });

            it('should close modal window', () => {
                expect(modalWindow.close).toHaveBeenCalledWith();
            });
        });

        describe('#updateContact', () => {
            beforeEach(() => {
                sut.updateContact(nickname);
                $timeout.flush();
            });

            it('should set nickname', () => {
                expect(sut.nickName).toEqual(sut.invoice.contactDetails.nickName);
            });

            it('should save contact using crud service', () => {
                expect(ewfCrudService.addElement).toHaveBeenCalledWith(`/api/addressbook/contact/modify`,
                    jasmine.objectContaining({
                        contactDetails: {
                            name: 'John',
                            company: 'Some Company',
                            email: 'some@email.com',
                            addressDetails: {key: 'some key'},
                            phoneDetails: {},
                            nickname
                        },
                        key: sut.invoice.contactDetails.addressDetails.key
                    }));
            });

            it('should set flag to show MODIFY confirmation', () => {
                expect(sut.updateConfirmed).toEqual(true);
            });

            it('should close modal window', () => {
                expect(modalWindow.close).toHaveBeenCalledWith();
            });
        });

        describe('#anyActionConfirmed', () => {
            it('should faild check if any action confirmed', () => {
                sut.saveConfirmed = false;
                sut.updateConfirmed = false;
                expect(sut.anyActionConfirmed()).toEqual(false);
            });

            it('should pass check if any action confirmed', () => {
                sut.saveConfirmed = true;
                sut.updateConfirmed = false;
                expect(sut.anyActionConfirmed()).toEqual(true);
            });
        });
    });
});
