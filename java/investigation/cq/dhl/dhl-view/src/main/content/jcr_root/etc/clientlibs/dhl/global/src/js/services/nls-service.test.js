/**
 * Test suit for user service
 */
import NlsService from './nls-service';
import ThrottleService from './throttle-service';

import 'angularMocks';

describe('nlsService', () => {
    let sut, $q, $http, $timeout, logService, navigationService;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        $http = jasmine.createSpyObj('$http', ['get']);

        navigationService = jasmine.createSpyObj('navigationService', ['getCountryLang']);
        navigationService.getCountryLang.and.returnValue({countryId: 1, langId: 2});
        logService = jasmine.createSpyObj('logService', ['error', 'warn']);

        sut = new NlsService($http, $q, logService, navigationService, new ThrottleService($q, $timeout));
    }));

    describe('#getTranslation', () => {
        it('should check that key format is correct', () => {
            const fullKey = 'nls.nls';
            const onRejectSpy = jasmine.createSpy('onRejectSpy');

            $http.get.and.returnValue($q.when({data: {nls: {nls: 'Translation'}}}));

            sut.getTranslation(fullKey).catch(onRejectSpy);

            $timeout.flush();

            expect(onRejectSpy).not.toHaveBeenCalled();
        });

        it('should check that key format is incorrect', () => {
            const fullKey = 'nlsnls';
            const onRejectSpy = jasmine.createSpy('onRejectSpy');

            sut.getTranslation(fullKey).catch(onRejectSpy);

            $timeout.flush();

            expect($http.get).not.toHaveBeenCalled();
            expect(onRejectSpy).toHaveBeenCalledWith(`Wrong format "${fullKey}"`);
        });

        it('should get dictionary data', () => {
            const fullKey = 'nls.nls';
            const translatedString = 'test translation';
            const onSuccessSpy = jasmine.createSpy('onSuccessSpy');

            $http.get.and.returnValue($q.when({data: {nls: {nls: translatedString}}}));

            sut.getTranslation(fullKey).then(onSuccessSpy);

            $timeout.flush();

            expect(onSuccessSpy).toHaveBeenCalledWith(translatedString);
        });

        it('should warn when non-requested dictionary was returned from server', () => {
            const fullKey1 = 'nls.nls1';
            const fullKey2 = 'nls.nls2';
            const translatedString1 = 'test translation 1';
            const translatedString2 = 'test translation 2';

            const onSuccessSpy1 = jasmine.createSpy('onSuccessSpy');
            const onSuccessSpy2 = jasmine.createSpy('onSuccessSpy');

            $http.get.and.returnValue($q.when().then(() => ({
                    data: {
                        nls: {
                            nls1: translatedString1,
                            nls2: translatedString2
                        },
                        nlsNonRequested: {
                            nls1: translatedString1,
                            nls2: translatedString2
                        }
                    }
                })
            ));

            sut.getTranslation(fullKey1).then(onSuccessSpy1);
            sut.getTranslation(fullKey2).then(onSuccessSpy2);

            $timeout.flush();

            expect(logService.warn)
                .toHaveBeenCalledWith(`Received dictionary "nlsNonRequested", which wasn't requested!`);
        });

        it('should process multiple request for a single dictionary appropriately', () => {
            const fullKey1 = 'nls.nls1';
            const fullKey2 = 'nls.nls2';
            const translatedString1 = 'test translation 1';
            const translatedString2 = 'test translation 2';

            const onSuccessSpy1 = jasmine.createSpy('onSuccessSpy');
            const onSuccessSpy2 = jasmine.createSpy('onSuccessSpy');

            $http.get.and.returnValue($q.when().then(() => ({
                    data: {
                        nls: {
                            nls1: translatedString1,
                            nls2: translatedString2
                        }
                    }
                })
            ));

            sut.getTranslation(fullKey1).then(onSuccessSpy1);
            sut.getTranslation(fullKey2).then(onSuccessSpy2);

            $timeout.flush();

            let calls = $http.get.calls.all();
            expect(calls).toBeDefined();
            expect(calls.length).toBe(1);

            let args = calls[0].args;
            expect(args.length).toBe(2);

            let params = args[1].params;
            expect(params).toBeDefined();

            let dictionaries = params.dictionaries;
            expect(dictionaries).toBeDefined();

            expect(dictionaries.length).toBe(1);
            expect(dictionaries[0]).toBe('nls');
            expect(onSuccessSpy1).toHaveBeenCalledWith(translatedString1);
            expect(onSuccessSpy2).toHaveBeenCalledWith(translatedString2);
        });

        it('should process multiple concurrent dictionary requests appropriately', () => {
            const fullKey1 = 'nls1.nls1';
            const fullKey2 = 'nls2.nls2';
            const translatedString1 = 'test translation 1';
            const translatedString2 = 'test translation 2';

            const onSuccessSpy1 = jasmine.createSpy('onSuccessSpy');
            const onSuccessSpy2 = jasmine.createSpy('onSuccessSpy');

            $http.get.and.returnValue($q.when().then(function() {
                return {
                    data: {
                        nls1: {
                            nls1: translatedString1
                        },
                        nls2: {
                            nls2: translatedString2
                        }
                    }
                };
            }));

            sut.getTranslation(fullKey1).then(onSuccessSpy1);
            sut.getTranslation(fullKey2).then(onSuccessSpy2);

            $timeout.flush();

            let calls = $http.get.calls.all();

            expect(calls).toBeDefined();
            expect(calls.length).toBe(1);

            let args = calls[0].args;

            expect(args.length).toBe(2);

            let params = args[1].params;
            expect(params).toBeDefined();

            let dictionaries = params.dictionaries;
            expect(dictionaries).toBeDefined();

            expect(dictionaries.length).toBe(2);
            expect(dictionaries[0]).toBe('nls1');
            expect(dictionaries[1]).toBe('nls2');
            expect(onSuccessSpy1).toHaveBeenCalledWith(translatedString1);
            expect(onSuccessSpy2).toHaveBeenCalledWith(translatedString2);
        });

        it('should process multiple sequential requests appropriately', () => {
            const fullKey1 = 'nls1.nls1';
            const fullKey2 = 'nls2.nls2';
            const translatedString1 = 'test translation 1';
            const translatedString2 = 'test translation 2';

            const onSuccessSpy1 = jasmine.createSpy('onSuccessSpy');
            const onSuccessSpy2 = jasmine.createSpy('onSuccessSpy');

            const $httpCallSpy1 = jasmine.createSpy('$httpCallSpy1').and.returnValue($q.when().then(function() {
                return {
                    data: {
                        nls1: {
                            nls1: translatedString1
                        }
                    }
                };
            }));

            $http.get = $httpCallSpy1;

            sut.getTranslation(fullKey1).then(onSuccessSpy1);

            $timeout.flush();

            const $httpCallSpy2 = jasmine.createSpy('$httpCallSpy2').and.returnValue($q.when().then(function() {
                return {
                    data: {
                        nls2: {
                            nls2: translatedString2
                        }
                    }
                };
            }));

            $http.get = $httpCallSpy2;

            sut.getTranslation(fullKey2).then(onSuccessSpy2);

            $timeout.flush();

            let calls1 = $httpCallSpy1.calls.all();

            expect(calls1).toBeDefined();
            expect(calls1.length).toBe(1);

            let args1 = calls1[0].args;
            expect(args1.length).toBe(2);

            let params1 = args1[1].params;
            expect(params1).toBeDefined();

            let dictionaries1 = params1.dictionaries;
            expect(dictionaries1).toBeDefined();

            expect(dictionaries1.length).toBe(1);
            expect(dictionaries1[0]).toBe('nls1');
            expect(onSuccessSpy1).toHaveBeenCalledWith(translatedString1);

            let calls2 = $httpCallSpy2.calls.all();
            expect(calls2).toBeDefined();
            expect(calls2.length).toBe(1);

            let args2 = calls2[0].args;
            expect(args2.length).toBe(2);

            let params2 = args2[1].params;
            expect(params2).toBeDefined();

            let dictionaries2 = params2.dictionaries;
            expect(dictionaries2).toBeDefined();

            expect(dictionaries2.length).toBe(1);
            expect(dictionaries2[0]).toBe('nls2');
            expect(onSuccessSpy2).toHaveBeenCalledWith(translatedString2);
        });

        it('should reject if dictionary data unavailable', () => {
            const fullKey = 'nls.nls';
            const onCatchSpy = jasmine.createSpy('onCatchSpy');

            $http.get.and.returnValue($q.reject());

            sut.getTranslation(fullKey).catch(onCatchSpy);

            $timeout.flush();

            expect(onCatchSpy).toHaveBeenCalled();
        });
    });
});
