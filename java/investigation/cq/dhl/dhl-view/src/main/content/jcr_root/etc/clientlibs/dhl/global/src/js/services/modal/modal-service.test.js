import ModalService from './modal-service';

describe('ModalService', () => {
    let sut;
    let $modal, $rootScope;
    let fakeModal;

    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;

        fakeModal = {
            result: {
                then: () => {},
                catch: () => {}
            },
            close: () => {},
            dismiss: () => {}
        };

        $modal = {
            open: jasmine.createSpy('open').and.returnValue(fakeModal)
        };

        sut = new ModalService($modal, $rootScope);
    }));

    describe('#showDialog', () => {
        let dialogInstance, TestDialogController, $scope;

        beforeEach(() => {
            TestDialogController = function() {};

            $scope = $rootScope.$new();

            dialogInstance = sut.showDialog({
                closeOnEscPress: true,
                controller: TestDialogController,
                controllerAs: 'testDialogCtrl',
                scope: $scope,
                template: '<div></div>'
            });
        });

        it('should call original $modal service', () => {
            expect($modal.open).toHaveBeenCalledWith(jasmine.objectContaining({
                backdrop: true,
                keyboard: true,
                controller: TestDialogController,
                controllerAs: 'testDialogCtrl',
                scope: $scope,
                template: '<div></div>'
            }));
        });

        it('should return dialog instance', () => {
            expect(dialogInstance).toEqual(fakeModal);
        });
    });

    describe('#showMessageDialog', () => {
        let options, result;

        beforeEach(() => {
            spyOn(sut, 'showDialog').and.callThrough();
            options = {
                title: 'Message dialog',
                message: 'Please, read the message.'
            };
            result = sut.showMessageDialog(options);
        });

        it('should call showDialog', () => {
            expect(sut.showDialog).toHaveBeenCalledWith(jasmine.objectContaining({
                closeOnEsc: true,
                scope: jasmine.objectContaining(options),
                template: jasmine.any(String)
            }));
        });

        it('should return result promise', () => {
            expect(result).toEqual(fakeModal.result);
        });
    });

    describe('#showConfirmationDialog', () => {
        let options, result;

        beforeEach(() => {
            spyOn(sut, 'showDialog').and.callThrough();
            options = {
                title: 'Confirmation dialog',
                message: 'Please, confirm!'
            };
            result = sut.showConfirmationDialog(options);
        });

        it('should call showDialog', () => {
            expect(sut.showDialog).toHaveBeenCalledWith(jasmine.objectContaining({
                closeOnEsc: true,
                scope: jasmine.objectContaining(options),
                template: jasmine.any(String)
            }));
        });

        it('should return result promise', () => {
            expect(result).toEqual(fakeModal.result);
        });
    });
});
