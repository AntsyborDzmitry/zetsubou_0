import 'angularMocks';
import ManageShipmentsController from './manage-shipments-controller';
import ManageShipmentsService from './manage-shipments-service';
import NavigationService from './../../../services/navigation-service';

describe('ManageShipmentsController', () => {
    let sut;
    let $q;
    let $timeout;
    let getShipmentsDeferred;
    let manageShipmentsService;
    let navigationService;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        getShipmentsDeferred = $q.defer();
        manageShipmentsService = jasmine.mockComponent(new ManageShipmentsService());
        manageShipmentsService.getShipments.and.returnValue(getShipmentsDeferred.promise);

        navigationService = jasmine.mockComponent(new NavigationService());

        sut = new ManageShipmentsController(manageShipmentsService, navigationService);
    }));

    describe('#constructor', () => {
        const shipments = [
            {
                id: 1,
                airWayBillNumber: 'Package for John',
                name: 'Package for John',
                savedDate: '11/22/2014',
                manifested: false,
                fromAddress: {
                    cityName: 'Wellesley',
                    postCode: '02482',
                    addressLine1: '1260 Grove St'
                },
                toAddress: {
                    cityName: 'York',
                    postCode: '073-0134',
                    addressLine1: '366-1193 Higashi 4-jominami'
                },
                fromName: 'Adriaan Adelheid',
                toName: 'John Takekoshi',
                fromCompany: 'Acme Inc.',
                toCompany: 'Zaamdoway'
            }
        ];

        beforeEach(() => {
            getShipmentsDeferred.resolve(shipments);
            $timeout.flush();
        });

        it('should load shipments from server', () => {
            expect(manageShipmentsService.getShipments).toHaveBeenCalled();
        });

        it('should set shipments to controller property', () => {
            expect(sut.filteredShipments).toEqual(shipments);
        });
    });

    describe('#filterShipments', () => {
        it('should set all shipments to controller if searchQuery is empty', () => {
            const shipments = [
                {
                    airWayBillNumber: 'Way bill 1 identifier'
                },
                {
                    name: 'Way bill 2 identifier'
                }
            ];
            getShipmentsDeferred.resolve(shipments);
            $timeout.flush();

            sut.searchQuery = '';
            sut.filterShipments();

            expect(sut.filteredShipments).toEqual(shipments);
        });

        it('should filter shipments by searchQuery string', () => {
            const initialShipments = [
                {
                    airWayBillNumber: 'Way bill 1 identifier'
                },
                {
                    name: 'Way bill 2 identifier'
                },
                {
                    airWayBillNumber: '#3'
                }
            ];
            getShipmentsDeferred.resolve(initialShipments);
            $timeout.flush();

            sut.searchQuery = 'bill';
            sut.filterShipments();

            const expectedShipments = [
                {
                    airWayBillNumber: 'Way bill 1 identifier'
                },
                {
                    name: 'Way bill 2 identifier'
                }
            ];
            expect(sut.filteredShipments).toEqual(expectedShipments);
        });
    });

    describe('#openShipmentPage', () => {
        it('should open shipment page', () => {
            const shipment = {
                id: 1
            };
            sut.openShipmentPage(shipment);

            expect(navigationService.location).toHaveBeenCalledWith('shipment.html?shipmentId=1');
        });
    });
});
