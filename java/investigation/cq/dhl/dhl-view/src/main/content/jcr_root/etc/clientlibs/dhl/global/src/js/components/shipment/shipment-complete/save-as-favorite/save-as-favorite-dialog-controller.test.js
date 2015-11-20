import SaveAsFavoriteController from './save-as-favorite-dialog-controller';
import SaveAsFavoriteService from './save-as-favorite-service';
import NavigationService from './../../../../services/navigation-service';
import 'angularMocks';

describe('SaveAsFavoriteController', () => {
    const shipmentId = 2;

    let sut;
    let $scope;
    let navigationService;
    let saveAsFavoriteDefer;
    let saveAsFavoriteService;
    let saveAsFavoriteForm;
    let saveAsFavoriteEwfFormCtrl;

    beforeEach(inject(($http, $q, _$rootScope_) => {

        $scope = _$rootScope_.$new();

        saveAsFavoriteDefer = $q.defer();

        saveAsFavoriteService = jasmine.mockComponent(new SaveAsFavoriteService());
        saveAsFavoriteService.saveAsFavorite.and.returnValue(saveAsFavoriteDefer.promise);

        navigationService = jasmine.mockComponent(new NavigationService());
        navigationService.getParamFromUrl.and.returnValue(shipmentId);

        $scope.ewfModalCtrl = jasmine.createSpyObj('ewfModalCtrl', ['close']);

        saveAsFavoriteEwfFormCtrl = jasmine.createSpyObj('ewfFormCtrl', ['ewfValidation']);
        saveAsFavoriteEwfFormCtrl.ewfValidation.and.returnValue(true);

        saveAsFavoriteForm = {
            $invalid: false
        };

        sut = new SaveAsFavoriteController($scope, navigationService, saveAsFavoriteService);

        sut.shipmentName = 'shipment_name';
    }));

    describe('#saveShipmentAsFavorite', () => {
        it('should run the process of marking shipment as favorite', () => {
            sut.saveAsFavorite(saveAsFavoriteForm, saveAsFavoriteEwfFormCtrl);

            expect(saveAsFavoriteService.saveAsFavorite).toHaveBeenCalledWith(shipmentId, sut.shipmentName);
        });

        it('should close modal dialog when saved successfully', () => {
            sut.saveAsFavorite(saveAsFavoriteForm, saveAsFavoriteEwfFormCtrl);
            saveAsFavoriteDefer.resolve();
            $scope.$apply();

            expect($scope.ewfModalCtrl.close).toHaveBeenCalled();
        });

        it('should not run the process of marking shipment as favorite if form is not valid', () => {
            saveAsFavoriteForm.$invalid = true;

            sut.saveAsFavorite(saveAsFavoriteForm, saveAsFavoriteEwfFormCtrl);

            expect(saveAsFavoriteService.saveAsFavorite).not.toHaveBeenCalled();
        });

        it('should handle saving error', () => {
            sut.saveAsFavorite(saveAsFavoriteForm, saveAsFavoriteEwfFormCtrl);

            const errorResponse = {
                errors: ['dictionary.message_key']
            };
            saveAsFavoriteDefer.reject(errorResponse);

            $scope.$apply();
            expect(sut.errors).toBe(errorResponse.errors);
        });
    });
});
