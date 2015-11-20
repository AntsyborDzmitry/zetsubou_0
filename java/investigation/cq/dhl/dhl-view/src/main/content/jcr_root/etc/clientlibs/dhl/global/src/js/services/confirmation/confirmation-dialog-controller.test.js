import ConfirmationDialogController from './confirmation-dialog-controller';
import 'angularMocks';

describe('ConfirmationDialogController', () => {
    let $q, $rootScope, sut;
    let ngDialog;
    let deferedObject;
    let showedPopUp;

    beforeEach(inject((_$q_) => {
        $q = _$q_;
        deferedObject = $q.defer();
        $rootScope = jasmine.createSpyObj('$rootScope', ['closeThisDialog']);

        ngDialog = jasmine.createSpyObj('ngDialog', ['open']);
        sut = new ConfirmationDialogController($q, $rootScope, ngDialog);

        showedPopUp = true;
    }));

    function closeThisDialog() {
        showedPopUp = false;
    }

    it('Controller is in scope', () => {

        expect($rootScope.confirmationDialogCtrl).not.toBe(undefined);
    });

    describe('#ConfirmationDialogController', () => {

        it('Message goes to html', () => {
            const message = 'mm';
            sut.showConfirmationDialog(message);

            expect(sut.message).toBe(message);
        });

        it('clears old references to defer object with new reference', () => {
            spyOn(deferedObject, 'resolve');
            sut.deferedAction = deferedObject;
            sut.showConfirmationDialog('');

            expect(sut.deferedAction).not.toBe(deferedObject);
        });

        it('close with Yes resolves defered object', () => {
            sut.showConfirmationDialog('');
            spyOn(sut.deferedAction, 'resolve');
            sut.confirmAction(closeThisDialog);
            expect(sut.deferedAction.resolve).toHaveBeenCalled();
            expect(showedPopUp).toBe(false);
        });

        it('close with No rejects defered object', () => {
            sut.showConfirmationDialog('');
            spyOn(sut.deferedAction, 'reject');
            sut.rejectAction(closeThisDialog);
            expect(sut.deferedAction.reject).toHaveBeenCalled();
            expect(showedPopUp).toBe(false);
        });
    });
});
