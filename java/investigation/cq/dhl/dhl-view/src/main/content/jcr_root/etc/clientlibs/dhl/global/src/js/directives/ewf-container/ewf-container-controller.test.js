import ewfContainerController from './ewf-container-controller';

describe('ewfContainerController', () => {
    const CONTROLLER_1_NAME = 'controller1';

    let sut;
    let logService;
    let controllerInstanceDummy;

    beforeEach(() => {
        controllerInstanceDummy = {proper: 'val'};
        logService = jasmine.createSpyObj('logService', ['log', 'error']);
        sut = new ewfContainerController(logService);
    });

    it('should register controller in service using name and returns is by same name', () => {
        sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);

        expect(logService.log).toHaveBeenCalledWith(CONTROLLER_1_NAME + ' controller successfully registered');
        expect(sut.getRegisteredControllerInstance(CONTROLLER_1_NAME)).toBe(controllerInstanceDummy);
    });

    it('should register controller in service using name twice and log appropriate message', () => {
        sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);
        logService.log.calls.reset();
        sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);

        expect(logService.log).toHaveBeenCalledWith(`Trying to register controller ${CONTROLLER_1_NAME} again.`);
        expect(sut.getRegisteredControllerInstance(CONTROLLER_1_NAME)).toBe(controllerInstanceDummy);
    });

    it('should return the new controller if it was registered again', () => {
        const otherControllerInstanceDummy = {someProper: 'test'};

        sut.registerControllerInstance(CONTROLLER_1_NAME, otherControllerInstanceDummy);
        logService.log.calls.reset();
        sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);

        expect(logService.log).toHaveBeenCalledWith(`Trying to register controller ${CONTROLLER_1_NAME} again.`);
        expect(sut.getRegisteredControllerInstance(CONTROLLER_1_NAME)).toBe(controllerInstanceDummy);
    });

    it('should log error if there is no suitable controller instance found', () => {
        sut.getRegisteredControllerInstance(CONTROLLER_1_NAME);

        expect(logService.error).toHaveBeenCalledWith(`No ${CONTROLLER_1_NAME} controller found!`);
    });

    describe('#registerCallback', () => {
        let callback;

        beforeEach(() => {
            callback = jasmine.createSpy('callback');
        });

        it('should log an error when trying to register callback second time', () => {
            sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);
            sut.registerCallback(CONTROLLER_1_NAME, callback);

            const error = `${CONTROLLER_1_NAME} controller already registered, callback does not make any sense`;
            expect(logService.error).toHaveBeenCalledWith(error);
            expect(callback).not.toHaveBeenCalled();
        });

        it('should perform callback if it was registered', () => {
            sut.registerCallback(CONTROLLER_1_NAME, callback);
            sut.registerControllerInstance(CONTROLLER_1_NAME, controllerInstanceDummy);

            expect(callback).toHaveBeenCalledWith();
        });
    });
});
