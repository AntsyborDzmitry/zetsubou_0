import PromoCodeService from './promo-code-service';
import 'angularMocks';

describe('PromoCodeService', () => {
    let sut;
    let logService;
    let $q;
    let $http;
    let $httpBackend;
    let $timeout;
    let defer;

    beforeEach(inject((_$http_, _$q_, _$httpBackend_, _$timeout_) => {
        $http = _$http_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        logService = jasmine.createSpyObj('logService', ['log', 'error']);

        sut = new PromoCodeService($http, $q, logService);

        defer = $q.defer();
        spyOn($http, 'post').and.returnValue(defer.promise);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#validatePromoCode', () => {
        const promoCode = 'testPromoCode';
        const accountNo = 'CREDUSA';
        const paymentTypeMethod = 'CRC';
        const shipperCountryCode = 'US';
        const destinationCountryCode = 'GB';

        it('should send proper request to promo code validation endpoint', () => {
            const expectedRequestData = {
                promoCode,
                accountNo,
                paymentTypeMethod,
                shipperCountryCode,
                destinationCountryCode
            };
            sut.validatePromoCode(promoCode, accountNo, paymentTypeMethod, shipperCountryCode, destinationCountryCode);
            expect($http.post).toHaveBeenCalledWith('/api/shipment/promocode/validate', expectedRequestData);
        });

        it('should return error if there is no account number for promocode on success', () => {
            const data = {};
            sut.validatePromoCode(promoCode, accountNo, paymentTypeMethod, shipperCountryCode, destinationCountryCode);
            defer.resolve({data});
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(`PromoCodeService#validatePromoCode: response error`, data);
        });
    });

    describe('#validateRewardCard', () => {
        const rewardCard = {
            rewardCard: '123445556566',
            promoCode: '123456787899'
        };

        it('should send request to proper endpoint', () => {
            const rewardCardExpected = {
                rewardCard: '98263000123445556566',
                promoCode: '123456787899'
            };
            sut.validateRewardCard(rewardCard);
            expect($http.post)
                .toHaveBeenCalledWith('/api/shipment/reward/validate', rewardCardExpected);
        });

        it('should return array of errors on fields failed validation', () => {
            const data = {
                fieldErrors: {
                    'rewardCard.number': true,
                    'rewardCard.promoCode': true
                }
            };
            const errors = ['rewardCard.number', 'rewardCard.promoCode'];
            let promise = sut.validateRewardCard(rewardCard);
            defer.reject({data});
            $timeout.flush();
            promise.then((result) => {
                expect(result).toBe(errors);
            });
        });
    });

    describe('#getSavedRewardCardNumber', () => {
        beforeEach(() => {
            spyOn($http, 'get').and.returnValue(defer.promise);
        });

        it('should send request to proper endpoint', () => {
            sut.getSavedRewardCardNumber();
            expect($http.get).toHaveBeenCalledWith('/api/myprofile/rewards');
        });

        it('should return 11 last numbers of rewardsCardNumber on success', () => {
            const data = {rewardsCardNumber: '9826300051234567897'};
            let promise = sut.getSavedRewardCardNumber();
            defer.resolve({data});
            $timeout.flush();

            promise.then((result) => {
                expect(result).toBe('51234567897');
            });
        });

        it('should log error on fail', () => {
            const data = 'Validation error';
            const resultExpected = `PromoCodeService#getSavedRewardCard: response error ${data}`;
            sut.getSavedRewardCardNumber();
            defer.reject({data});
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(resultExpected);
        });
    });

    describe('#saveRewardCardNumber', () => {
        const rewardsCardNumber = '98263000123445556566';
        const number = '123445556566';

        it('should save reward card number to user profile', () => {
            sut.saveRewardCardNumber(number);
            expect($http.post).toHaveBeenCalledWith('/api/myprofile/rewards', {rewardsCardNumber});
        });

        it('should log error on fail', () => {
            const data = 'Validation error';
            const resultExpected = `PromoCodeService#saveRewardCardNumber: response error ${data}`;
            sut.saveRewardCardNumber(number);
            defer.reject({data});
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(resultExpected);
        });
    });

    describe('#validateByLuhnFormula', () => {
        it('should return true on validation success', () => {
           const number = '51234567897';
            expect(sut.validateByLuhnFormula(number)).toBe(true);
        });

        it('should return false on validation fail', () => {
            const number = '12345678911';
            expect(sut.validateByLuhnFormula(number)).toBe(false);
        });
    });
});
