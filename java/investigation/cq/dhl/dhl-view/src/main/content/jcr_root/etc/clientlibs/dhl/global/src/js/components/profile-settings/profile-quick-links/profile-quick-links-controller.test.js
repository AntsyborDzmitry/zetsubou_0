import ProfileQuickLinksController from './profile-quick-links-controller';
import EwfCrudService from './../../../services/ewf-crud-service';
import EwfGridController from './../../../directives/ewf-grid/ewf-grid-controller';
import ProfileEditQuickLinkDialogService from './profile-edit-quick-link-dialog-service';
import ProfileSettingsService from './../profile-settings-service';
import AttrsService from './../../../services/attrs-service';
import EwfSpinnerService from './../../../services/ewf-spinner-service';
import 'angularMocks';

describe('ProfileQuickLinksController', () => {
    const quickLinksResponse = [
        {
            key: 'c68ce7d8-364f-4eeb-9026-720d629ab1e9',
            name: 'ddf44',
            url: 'http://google.com'
        },
        {
            key: '7dcdff5c-9873-476d-8ee6-16bdd6842700',
            name: 'ddddd',
            url: 'http://dddd'
        }
    ];
    let sut, $q, $timeout, $controller, $scope, deferedGet, $sce;
    let ewfCrudServiceMock, ewfGridControllerMock, profileEditQuickLinkDialogServiceMock, nlsService;
    let profileSettingsServiceMock, attrsServiceMock, ewfSpinnerServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$controller_, _$rootScope_, _$sce_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        $sce = _$sce_;
        deferedGet = $q.defer();

        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());
        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());
        ewfGridControllerMock = jasmine.mockComponent(
            new EwfGridController(
                $scope,
                {},
                $timeout,
                $q,
                nlsService,
                ewfCrudServiceMock,
                attrsServiceMock)
        );

        ewfGridControllerMock.updateElement.and.returnValue(deferedGet.promise);
        ewfGridControllerMock.attributes = {
            gridData: quickLinksResponse
        };
        ewfCrudServiceMock.addElement.and.returnValue(deferedGet.promise);
        ewfCrudServiceMock.getElementDetails.and.returnValue(deferedGet.promise);
        ewfCrudServiceMock.updateElement.and.returnValue(deferedGet.promise);

        profileEditQuickLinkDialogServiceMock = jasmine.mockComponent(
            new ProfileEditQuickLinkDialogService($controller)
        );
        profileSettingsServiceMock = jasmine.mockComponent(new ProfileSettingsService());
        profileSettingsServiceMock.getQuickLinks.and.returnValue(deferedGet.promise);

        profileEditQuickLinkDialogServiceMock.showSaveDialog.and.returnValue(deferedGet.promise);
        sut = new ProfileQuickLinksController(
            $timeout,
            $sce,
            ewfCrudServiceMock,
            profileEditQuickLinkDialogServiceMock,
            profileSettingsServiceMock,
            {},
            ewfSpinnerServiceMock);
        sut.gridCtrl = ewfGridControllerMock;
        spyOn(sut, 'toggleNotificationAlert').and.callThrough();
        spyOn(sut, 'rebuildGrid').and.callThrough();
    }));

    describe('#init', () => {

        it('should check that spinner handler called on initialize', () => {
            sut.init();
            expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
        });

        it('should set correct columns to display', () => {
            expect(sut.columnsToDisplay[0].alias).toEqual('name');
            expect(sut.columnsToDisplay[1].alias).toEqual('link');
        });

        it('should set edit callback', () => {
            sut.init();

            expect(sut.gridCtrl.editCallback).toBe(sut.editQuickLink);
        });

        it('should get data with service', () => {
            const key = '0d3b681c-4104-4b15-ad44-4d45549b18a6';
            const serverResponse = [{
                key,
                name: 'asdasd',
                url: 'http://cdscsr.csd'
            }];
            const expectedData = [{
                key,
                name: 'asdasd',
                url: 'http://cdscsr.csd'
            }];
            sut.gridData = {};

            expectedData[0].link = sut.getLinkHtml(expectedData[0].url);
            sut.init();

            deferedGet.resolve(serverResponse);
            $timeout.flush();

            const gridCtrlRebuildGridFunctionParameter = sut.gridCtrl.rebuildGrid.calls.mostRecent().args[0][0];
            expect(gridCtrlRebuildGridFunctionParameter.key).toEqual(expectedData[0].key);
            expect(gridCtrlRebuildGridFunctionParameter.name).toEqual(expectedData[0].name);

            expect(gridCtrlRebuildGridFunctionParameter.link.$$unwrapTrustedValue())
                .toEqual(expectedData[0].link.$$unwrapTrustedValue());
        });
    });

    describe('#getLinkHtml', () => {
        it('should convert link string to a href', () => {
            const link = 'http://dhl.com';
            const linkElement = $sce.trustAsHtml('<a href="http://dhl.com" target="_blank">http://dhl.com</a>');
            const result = sut.getLinkHtml(link);

            expect(result.$$unwrapTrustedValue()).toEqual(linkElement.$$unwrapTrustedValue());
        });
    });

    describe('#addQuickLink', () => {

        const validForm = {$valid: true};
        const addUrl = '/api/myprofile/links/add';

        beforeEach(() => {
            sut.quickLinkName = quickLinksResponse[0].name;
            sut.quickLinkUrl = quickLinksResponse[0].url;
            sut.addQuickLink(validForm);
            deferedGet.resolve([]);
            $timeout.flush();
        });

        it('should use crud service for adding', () => {
            expect(ewfCrudServiceMock.addElement).toHaveBeenCalledWith(addUrl, {
                name: quickLinksResponse[0].name,
                url: quickLinksResponse[0].url
            });
        });
        it('should call toggle alert with correct params on succeed', () => {
            expect(sut.toggleNotificationAlert).toHaveBeenCalledWith('added');
        });
        it('should rebuild grid on succeed', () => {
            expect(sut.rebuildGrid).toHaveBeenCalled();
        });
    });

    describe('#toggleNotificationAlert', () => {
        it('should set alerts type value to true, and false by timeout', () => {
            sut.alertTypes = {};
            sut.toggleNotificationAlert('key');
            expect(sut.alertTypes.key).toBeTruthy();
            $timeout.flush();
            expect(sut.alertTypes.key).toBeFalsy();
        });
    });

    describe('#rebuildGrid', () => {
        it('should map data from service with link value', () => {
            sut.rebuildGrid();
            expect(quickLinksResponse[0].link).not.toBeDefined();
            deferedGet.resolve(quickLinksResponse);
            $timeout.flush();
            const args = sut.gridCtrl.rebuildGrid.calls.mostRecent().args[0];
            expect(args[0].link).toBeDefined();
        });
    });

    describe('#updateQuickLink', () => {

        const params = {
            key: quickLinksResponse[0].key
        };

        beforeEach(() => {
            sut.updateQuickLink(params);
        });
        it('should update element via grid controller', () => {
            expect(sut.gridCtrl.updateElement).toHaveBeenCalledWith(params);
        });
        it('should show updated status', () => {
            deferedGet.resolve();
            $timeout.flush();
            expect(sut.toggleNotificationAlert).toHaveBeenCalledWith('updated');
        });
    });

    describe('#updateLinkHtml', () => {
        it('should add link key with html trasted value', () => {
            const linkInfo = {
                key: quickLinksResponse[0].key,
                url: 'newUrl'
            };
            const linkElement = $sce.trustAsHtml(`<a href="${linkInfo.url}" target="_blank">${linkInfo.url}</a>`);
            const expectedResult = linkElement.$$unwrapTrustedValue();
            sut.updateLinkHtml(linkInfo);
            expect(quickLinksResponse[0].link.$$unwrapTrustedValue()).toEqual(expectedResult);
        });
    });
});
