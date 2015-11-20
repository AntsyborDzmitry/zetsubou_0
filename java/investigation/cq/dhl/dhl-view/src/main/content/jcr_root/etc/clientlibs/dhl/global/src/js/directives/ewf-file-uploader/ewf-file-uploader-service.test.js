import EwfFileUploaderService from './ewf-file-uploader-service';
import 'angularMocks';

describe('#EwfFileUploaderService', () => {

    let sut, xMLHttpRequestMethods, uploadMethods, xmlHttpRequestObject, formMethods;
    let $window, $q, $timeout;
    let logServiceMock;

    beforeEach(inject((_$q_, _$window_, _$timeout_) => {
        $window = _$window_;
        $q = _$q_;
        $timeout = _$timeout_;
        xMLHttpRequestMethods = jasmine.createSpyObj('xMLHttpRequestMethods', ['send', 'open']);
        uploadMethods = jasmine.createSpyObj('uploadMethods', ['addEventListener']);

        const windowXMLHttpRequest = jasmine.createSpyObj('XMLHttpRequest', ['XMLHttpRequest']);
        $window.XMLHttpRequest = windowXMLHttpRequest.XMLHttpRequest;

        formMethods = jasmine.createSpyObj('form', ['submit']);

        logServiceMock = jasmine.createSpyObj('logService', ['error']);

        xmlHttpRequestObject = {
            upload: {
                addEventListener: uploadMethods.addEventListener
            },
            onload: null,
            onerror: null,
            send: xMLHttpRequestMethods.send,
            open: xMLHttpRequestMethods.open
        };
        windowXMLHttpRequest.XMLHttpRequest.and.returnValue(xmlHttpRequestObject);

        sut = new EwfFileUploaderService($q, $window, $timeout, logServiceMock);
    }));

    it('should test for using HTML5 approach for uploading files', () => {
        expect(sut.uploadAvailable()).toEqual(true);
    });

    it('should upload files using HTML5 approach', () => {
        const url = '/api/test_api';
        const params = '?someParam=someValue';
        sut.uploadFiles([{name: 'test.jpg'}], url, params);
        expect($window.XMLHttpRequest).toHaveBeenCalledWith();
        expect(xMLHttpRequestMethods.open).toHaveBeenCalledWith('POST', `${url}${params}`);
        expect(uploadMethods.addEventListener).toHaveBeenCalledWith('uploadProgress', jasmine.any(Function), true);
        expect(xMLHttpRequestMethods.send).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('should add onload and onerror callbacks', () => {
        sut.uploadFiles([{name: 'test.jpg'}], '?someParam=someValue');
        expect(xmlHttpRequestObject.onload).toEqual(jasmine.any(Function));
        expect(xmlHttpRequestObject.onerror).toEqual(jasmine.any(Function));
    });

    describe('onload callback', () => {
        let uploadPromise;
        let resolveCb;
        let rejectCb;
        let event;

        beforeEach(() => {
            uploadPromise = sut.uploadFiles([{name: 'test.jpg'}], '?someParam=someValue');
            resolveCb = jasmine.createSpy();
            rejectCb = jasmine.createSpy();
            uploadPromise.then(resolveCb).catch(rejectCb);
            event = {
                target: {}
            };
        });

        it('should resolve promise with server response on successful request', () => {
            const responseJSON = {src: '/images/signature.jpg'};
            event.target.status = 200;
            event.target.response = JSON.stringify(responseJSON);

            xmlHttpRequestObject.onload(event);
            $timeout.flush();

            expect(resolveCb).toHaveBeenCalledWith(responseJSON);
            expect(rejectCb).not.toHaveBeenCalled();
        });

        it('should reject promise with server response when request is failed', () => {
            const responseJSON = {errors: ['errors.upload_error']};
            event.target.status = 500;
            event.target.response = JSON.stringify(responseJSON);

            xmlHttpRequestObject.onload(event);
            $timeout.flush();

            expect(resolveCb).not.toHaveBeenCalled();
            expect(rejectCb).toHaveBeenCalledWith(responseJSON);
        });

        it('should handle non JSON server response', () => {
            event.target.status = 413;
            event.target.response = '<html><head><title>413 Request Entity Too Large</title></head></html>';

            xmlHttpRequestObject.onload(event);
            $timeout.flush();

            expect(resolveCb).not.toHaveBeenCalled();
            expect(rejectCb).toHaveBeenCalledWith(jasmine.any(Object));
        });

        it('should handle non JSON server response for successful request', () => {
            event.target.status = 200;
            event.target.response = '<html><head><title>200 File uploaded</title></head></html>';

            xmlHttpRequestObject.onload(event);
            $timeout.flush();

            expect(resolveCb).toHaveBeenCalledWith(jasmine.any(Object));
            expect(rejectCb).not.toHaveBeenCalled();
        });
    });

    it('should upload files using iframe approach', () => {
        sut.submitForm({form: formMethods, frame: {}});
        expect(formMethods.submit).toHaveBeenCalledWith();
    });

    it('should test for using iframe approach for uploading files', () => {
        $window.FormData = null;
        expect(sut.uploadAvailable()).toEqual(false);
    });

});
