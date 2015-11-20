import SaveAsFavoriteService from './save-as-favorite-service';
import 'angularMocks';

describe('saveAsFavoriteService', () => {

    let sut;
    let $q;
    let $http;
    let $timeout;
    let logService;

    const shipmentName = 'shipment_name';
    const shipmentId = 'shipment_id';

    beforeEach(inject((_$q_, _$http_, _$timeout_) => {
        $q = _$q_;
        $http = _$http_;
        $timeout = _$timeout_;

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new SaveAsFavoriteService($http, $q, logService);
    }));

    describe('#saveAsFavorite', () => {
        it('should send shipment name to back-end', () => {
            spyOn($http, 'put').and.returnValue($q.when());
            sut.saveAsFavorite(shipmentId, shipmentName);

            expect($http.put).toHaveBeenCalledWith(`/api/shipment/${shipmentId}/favorite`, {shipmentName});
        });

        it('should log error if marking shipment as favorite failed', () => {
            const errorResponse = {
                data: {
                    errors: ['dictionary.message_key']
                }
            };
            spyOn($http, 'put').and.returnValue($q.reject(errorResponse));
            sut.saveAsFavorite(shipmentId, shipmentName);
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(errorResponse);
        });
    });
});
