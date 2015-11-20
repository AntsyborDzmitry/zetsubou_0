import EwfcValueController from './ewfc-value-controller';
import ConfigService from './../../../services/config-service';
import 'angularMocks';

describe('EwfcValueController', () => {
    let sut;
    let $timeout;
    let configService;
    let renderFunctionSpy;

    const testValue = 'some test value';

    beforeEach(inject(($q, _$timeout_) => {
        $timeout = _$timeout_;
        configService = jasmine.mockComponent(new ConfigService());
        configService.getValue.and.returnValue($q.when({data: {value: 'some value'}}));

        renderFunctionSpy = jasmine.createSpy();

        sut = new EwfcValueController($q, configService);
    }));

    describe('#setValue', () => {
        it('should get value from config service', () => {
            sut.setValue(testValue);
            expect(configService.getValue).toHaveBeenCalledWith(testValue);
        });

        it('should call render function after getting value', () => {
            sut.setRenderFunction(renderFunctionSpy);

            sut.setValue(testValue);
            $timeout.flush();

            expect(renderFunctionSpy).toHaveBeenCalledWith(jasmine.objectContaining({data: {value: 'some value'}}));
        });
    });

});
