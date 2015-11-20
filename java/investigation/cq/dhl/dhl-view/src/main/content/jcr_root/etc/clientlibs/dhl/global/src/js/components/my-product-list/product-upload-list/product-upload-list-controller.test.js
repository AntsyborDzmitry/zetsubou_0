import ProductUploadListController from './product-upload-list-controller';
import AttrsService from './../../../services/attrs-service';
import CrudService from './../../../services/ewf-crud-service';
import SystemConstants from './../../../constants/system-settings-constants';
import 'angularMocks';

describe('#ProductUploadListController', () => {
    let sut;
    let scope;
    let attrsServiceMock;
    let crudServiceMock;
    let systemConstants;
    let crudDefer;
    let $attrsMock;
    let $timeout;

    beforeEach(inject((_$timeout_, _$rootScope_, _$q_) => {
        scope = _$rootScope_.$new();
        scope.ewfModalCtrl = jasmine.createSpyObj('ewfModalCtrl', ['close']);
        $timeout = _$timeout_;

        crudDefer = _$q_.defer();
        crudServiceMock = jasmine.mockComponent(new CrudService());
        crudServiceMock.updateElement.and.returnValue(crudDefer.promise);
        systemConstants = SystemConstants;

        attrsServiceMock = jasmine.mockComponent(new AttrsService());

        sut = new ProductUploadListController(
            scope,
            $attrsMock,
            $timeout,
            attrsServiceMock,
            crudServiceMock,
            systemConstants);
    }));

    it('should initialize file list collection', () => {
        expect(sut.uploadedFiles()).toEqual([]);
    });

    describe('#onUploadSuccessful', () => {
        it('should add files info to files collection', () => {
            const filesInfo = {ket: 'test'};
            sut.onUploadSuccessful(filesInfo);
            expect(sut.uploadedFiles()).toEqual([filesInfo]);
        });
    });

    describe('#onBeforeSelectFiles', () => {
        it('should clear files collection', () => {
            sut.onUploadSuccessful({});
            sut.onBeforeSelectFiles();
            expect(sut.uploadedFiles().length).toBe(0);
        });
    });

    describe('#removeFile', () => {
        it('should remove file info from collection by index', () => {
            const filesInfo = {ket: 'test'};
            sut.onUploadSuccessful(filesInfo);
            sut.removeFile(0);
            expect(sut.uploadedFiles().length).toBe(0);
        });
    });

    describe('#onUploadError', () => {

        it('should trigger error handler', () => {
            sut.onUploadError();
            expect(attrsServiceMock.trigger).toHaveBeenCalledWith(scope, $attrsMock, 'errorHandler');
        });

        it('should show errors', () => {
            const errors = ['error_string'];
            sut.alerts.errors = null;
            sut.onUploadError(errors);
            expect(sut.alerts.errors).toEqual(errors);
        });

        it('should show notification with errors', () => {
            sut.onUploadError();
            expect(sut.alerts.showCatalogError).toBe(true);
        });

        it('should hide notification with errors', () => {
            const $timeoutMock = jasmine.createSpy('$timeout');

            sut = new ProductUploadListController(
                scope,
                $attrsMock,
                $timeoutMock,
                attrsServiceMock,
                crudServiceMock,
                systemConstants);

            sut.onUploadError();
            expect($timeoutMock).toHaveBeenCalledWith(
                jasmine.any(Function),
                systemConstants.showInformationHintTimeout);
        });
    });

    describe('#addListOfProducts', () => {

        it('should close modal window on successful update of product catalog', () => {
            sut.addListOfProducts();
            crudDefer.resolve();
            $timeout.flush();
            expect(scope.ewfModalCtrl.close).toHaveBeenCalledWith();
        });

        it('should update product catalog', () => {
            const productSaveCatalogUrl = '/api/myprofile/customs/products/catalog/save';
            const someResponseData = {test: 'test'};
            sut.onUploadSuccessful(someResponseData);
            sut.addListOfProducts();
            crudDefer.resolve();
            $timeout.flush();
            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(productSaveCatalogUrl, someResponseData);
        });

        it('should trigger successful handler', () => {
            sut.addListOfProducts();
            crudDefer.resolve();
            $timeout.flush();
            expect(attrsServiceMock.trigger).toHaveBeenCalledWith(scope, $attrsMock, 'successfulHandler');
        });

        it('should trigger error handler', () => {
            const errors = ['error_string'];
            sut.addListOfProducts();
            crudDefer.reject({errors});
            $timeout.flush();
            expect(sut.alerts.errors).toEqual(errors);
        });
    });
});
