import EwfShipmentStepBaseController from './ewf-shipment-step-base-controller';
import 'angularMocks';

describe('EwfShipmentStepBaseController', () => {
    let sut;
    beforeEach(() => {
        sut = new EwfShipmentStepBaseController();
    });

    describe('#constructor', () => {
        it('should define public interface', () => {
            expect(sut.getName).toEqual(jasmine.any(Function));
            expect(sut.init).toEqual(jasmine.any(Function));
            expect(sut.edit).toEqual(jasmine.any(Function));
            expect(sut.preview).toEqual(jasmine.any(Function));
            expect(sut.isValid).toEqual(jasmine.any(Function));
            expect(sut.setNextCallback).toEqual(jasmine.any(Function));
            expect(sut.setEditCallback).toEqual(jasmine.any(Function));
            expect(sut.onNextClick).toEqual(jasmine.any(Function));
            expect(sut.onEditClick).toEqual(jasmine.any(Function));
        });
    });

    describe('#init', () => {
        it('should mark controller as initialized', () => {
            spyOn(sut, 'onInit');
            sut.initialized = false;
            sut.init();
            expect(sut.initialized).toBe(true);
            expect(sut.onInit).toHaveBeenCalled();
        });
    });

    describe('#onNextClick', () => {
        it('should handle move to next', () => {
            spyOn(sut, 'nextCallback');
            sut.onNextClick();
            expect(sut.nextCallback).toHaveBeenCalled();
        });
    });

    describe('#onEditClick', () => {
        it('should handle edit event', () => {
            spyOn(sut, 'editCallback');
            sut.onEditClick();
            expect(sut.editCallback).toHaveBeenCalled();
        });
    });

    describe('#edit', () => {
        it('should set editModeActive to true', () => {
            sut.editModeActive = false;

            sut.onEdit = jasmine.createSpy('onEdit');
            sut.edit();

            expect(sut.onEdit).toHaveBeenCalled();
            expect(sut.editModeActive).toBe(true);
        });
    });

    describe('#preview', () => {
        it('should set editModeActive to true', () => {
            sut.editModeActive = true;

            sut.preview();

            expect(sut.editModeActive).toBe(false);
        });
    });

    describe('#setNextCallback', () => {
        it('should set next callback function', () => {
            sut.nextCallback = null;

            const nextCallback = jasmine.createSpy('nextCallback');

            sut.setNextCallback(nextCallback);

            expect(sut.nextCallback).toBe(nextCallback);

        });
    });

    describe('#setEditCallback', () => {
        it('should set edit callback function', () => {
            sut.editCallback = null;

            const editCallback = jasmine.createSpy('editCallback');

            sut.setEditCallback(editCallback);

            expect(sut.editCallback).toBe(editCallback);
        });
    });
});
