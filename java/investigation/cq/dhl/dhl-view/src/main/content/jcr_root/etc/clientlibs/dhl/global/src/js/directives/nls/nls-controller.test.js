/**
 * Test suit for user service
 */
import NLSController from './nls-controller';
import NlsService from './../../services/nls-service';
import 'angularMocks';

describe('NLSController', () => {
    let sut, $q, $timeout, nlsService, renderFunction;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        nlsService = jasmine.mockComponent(new NlsService());

        sut = new NLSController($q, nlsService);
        renderFunction = jasmine.createSpy('renderFunction');
        sut.setRenderFunction(renderFunction);
    }));


    describe('#translate', () => {
        it('should set render function to display error about wrang format in case of invalid nls key', () => {
            const fullKey = 'nls.nls';
            const renderFunctionFake = jasmine.createSpy();
            sut.setRenderFunction(renderFunctionFake);
            nlsService.isValidKey.and.returnValue(false);

            sut.translate(fullKey);
            expect(renderFunctionFake).toHaveBeenCalledWith({text: 'wrong format "' + fullKey + '"'});
        });

        it('should check that format of key is correct', () => {
            const dicDefer = $q.defer();
            const fullKey = 'nls.nls';

            nlsService.isValidKey.and.returnValue(true);
            nlsService.getDictionary.and.returnValue(dicDefer.promise);

            sut.translate(fullKey);

            expect(nlsService.getDictionary).toHaveBeenCalledWith('nls');
        });

        it('should check that format of key is incorrect', () => {
            const dicDefer = $q.defer();
            const wrongFullKey = 'nlsnls';

            nlsService.getDictionary.and.returnValue(dicDefer.promise);

            sut.translate(wrongFullKey);

            expect(nlsService.getDictionary).not.toHaveBeenCalledWith('nls');
        });

        it('should get dictionary data', () => {
            const dicDefer = $q.defer();
            const fullKey = 'nls.nls';
            const dictionary = {
                nls: 'test translation'
            };

            nlsService.isValidKey.and.returnValue(true);
            nlsService.getDictionary.and.returnValue(dicDefer.promise);

            sut.translate(fullKey);
            dicDefer.resolve(dictionary);
            $timeout.flush();

            expect(renderFunction).toHaveBeenCalledWith({text: 'test translation'});
        });

        it('should reject if dictionary data unavailable', () => {
            const dicDefer = $q.defer();
            const fullKey = 'nls.nls';

            nlsService.isValidKey.and.returnValue(true);
            nlsService.getDictionary.and.returnValue(dicDefer.promise);

            sut.translate(fullKey);
            dicDefer.reject();
            $timeout.flush();
            expect(renderFunction).toHaveBeenCalledWith({text: 'can\'t obtain dictionary "' + 'nls' + '"'});
        });
    });

});
