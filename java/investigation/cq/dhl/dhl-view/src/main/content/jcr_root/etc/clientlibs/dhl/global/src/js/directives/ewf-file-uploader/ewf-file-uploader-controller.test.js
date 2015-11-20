import EwfFileUploaderController from './ewf-file-uploader-controller';
import EwfFileUploaderService from './ewf-file-uploader-service';
import AttrsService from './../../services/attrs-service';
import 'angularMocks';

describe('EwfFileUploaderController', () => {
    let sut, $scope, $attrs, attrsServiceMock, ewfFileUploaderServiceMock;

    const fileList = {
        0: {
            name: 'test.jpg'
        },
        1: {
            name: 'test1.jpg'
        },
        2: {
            name: 'test2.jpg'
        },
        length: 3
    };

    const windowsFileName = {name: 'format.com'};
    const windowsFilePath = `c:\\Windows\\system32\\${windowsFileName.name}`;
    const posixFileName = {name: 'null'};
    const posixFilePath = `/usr/home/${posixFileName.name}`;

    beforeEach(inject((_$q_, _$timeout_) => {
        $scope = {};
        $attrs = {};
        const $q = _$q_;
        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        ewfFileUploaderServiceMock = jasmine.mockComponent(new EwfFileUploaderService());
        ewfFileUploaderServiceMock.uploadFiles.and.returnValue($q.when());
        ewfFileUploaderServiceMock.submitForm.and.returnValue($q.when());
        _$timeout_.flush();

        sut = new EwfFileUploaderController($scope, $attrs, attrsServiceMock, ewfFileUploaderServiceMock);
    }));

    describe('in multi file mode', () => {
        beforeEach(() => {
            $attrs.multiFileMode = null;
            sut = new EwfFileUploaderController($scope, $attrs, attrsServiceMock, ewfFileUploaderServiceMock);
        });

        it('should append files list', () => {
            sut.onFilesReadyToUpload(fileList);
            expect(sut.getFilesList().length).toBe(fileList.length);
        });

        it('should clear filesUploaded flag and display fileList', () => {
            sut.onFilesReadyToUpload(fileList);
            expect(sut.filesUploaded).toBe(false);
        });

        it('should append single file to list from windows system', () => {
            sut.onFilesReadyToUpload(windowsFilePath);
            expect(sut.getFilesList().length).toEqual(1);
            expect(sut.getFilesList()[0]).toEqual(windowsFileName);
        });

        it('should append single file to list from posix file naming system', () => {
            sut.onFilesReadyToUpload(posixFilePath);
            expect(sut.getFilesList().length).toEqual(1);
            expect(sut.getFilesList()[0]).toEqual(posixFileName);
        });
    });

    describe('in single file mode', () => {
        beforeEach(() => {
            sut = new EwfFileUploaderController($scope, $attrs, attrsServiceMock, ewfFileUploaderServiceMock);
        });

        it('should append files list', () => {
            sut.onFilesReadyToUpload(fileList);
            expect(sut.getFilesList().length).toEqual(1);
        });

        it('should append single file to list from windows system', () => {
            sut.onFilesReadyToUpload(windowsFilePath);
            sut.onFilesReadyToUpload(windowsFilePath);
            expect(sut.getFilesList().length).toEqual(1);
            expect(sut.getFilesList()[0]).toEqual(windowsFileName);
        });

        it('should append single file to list from posix file naming system', () => {
            sut.onFilesReadyToUpload(posixFilePath);
            sut.onFilesReadyToUpload(posixFilePath);
            expect(sut.getFilesList().length).toEqual(1);
            expect(sut.getFilesList()[0]).toEqual(posixFileName);
        });
    });

    it('should clear files list', () => {
        sut.clearFilesList();
        expect(sut.getFilesList().length).toEqual(0);
    });

    it('should allow showing of files list', () => {
        sut.onFilesReadyToUpload(fileList);
        expect(sut.canShowFileList()).toEqual(true);
    });

    it('should disallow showing of files list', () => {
        sut.clearFilesList();
        expect(sut.canShowFileList()).toEqual(false);
    });

    it('should set files uploaded mark and trigger callback', () => {
        const response = {src: 'asdasd'};

        sut.filesUploaded = false;
        sut.onFilesUploaded(response);
        expect(sut.filesUploaded).toEqual(true);
        expect(attrsServiceMock.trigger).toHaveBeenCalledWith($scope, $attrs, 'filesUploaded', response);
    });

    xit('should unset files uploaded mark and trigger callback', () => {
        const response = {errors: 'asdasd'};

        sut.filesUploaded = true;
        sut.onUploadError(response);
        expect(sut.filesUploaded).toEqual(false);
        expect(attrsServiceMock.trigger).toHaveBeenCalledWith($scope, $attrs, 'filesUploadError', response);
    });

    xit('should trigger upload error callback with empty errors on empty response', () => {
        const response = null;

        sut.filesUploaded = true;
        sut.onUploadError(response);
        expect(attrsServiceMock.trigger).toHaveBeenCalledWith($scope, $attrs, 'filesUploadError', {errors: []});
    });

    it('should set upload progress', () => {
        const progress = 54;

        sut.filesUploaded = true;
        sut.onProgress(progress);
        expect(sut.uploadProgress).toEqual(progress);
    });

    it('should upload files using HTML5 approach with correct parameters', () => {
        ewfFileUploaderServiceMock.uploadAvailable.and.returnValue(true);
        const formReadyData = {form: {}, frame: {}, url: '/api/test_api', urlParameters: 'asdasda'};

        sut.onFormReady(formReadyData);
        sut.uploadFiles();
        expect(ewfFileUploaderServiceMock.uploadFiles)
            .toHaveBeenCalledWith(sut.getFilesList(), formReadyData.url, formReadyData.urlParameters);
    });

    it('should upload files using iframe approach with correct parameters', () => {
        ewfFileUploaderServiceMock.uploadAvailable.and.returnValue(false);
        const formReadyData = {form: {}, frame: {}, url: '/api/test_api', urlParameters: 'asdasda'};

        sut.onFormReady(formReadyData);
        sut.uploadFiles();
        expect(ewfFileUploaderServiceMock.submitForm)
            .toHaveBeenCalledWith(formReadyData);
    });

});
