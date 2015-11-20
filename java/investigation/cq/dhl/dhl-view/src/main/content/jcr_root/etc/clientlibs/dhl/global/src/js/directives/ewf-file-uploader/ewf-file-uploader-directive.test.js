import EwfFileUploader from './ewf-file-uploader-directive';
import EwfFileUploaderController from './ewf-file-uploader-controller';
import EwfFileUploaderService from './ewf-file-uploader-service';
import AttrsService from './../../services/attrs-service';
import 'angularMocks';

describe('#EwfFileUploader', () => {
    let sut;
    let controllers;
    let element;
    let $scope;
    let $attrs;
    let attrsServiceMock;
    let ewfFileUploaderControllerMock;
    let ewfFileUploaderServiceMock;
    let setGetAttributeMethods;
    let onMethod;
    let onClickEventCallback;
    let onChangeEventCallback;

    function callPostLink() {
        sut.link.post($scope, element, $attrs, controllers);
    }

    beforeEach(inject((_$rootScope_, _$window_) => {
        $scope = _$rootScope_.$new();
        $attrs = {
            $observe: jasmine.createSpy('$observe').and.callFake((attrName, callback) => {
                callback();
            })
        };

        element = jasmine.createSpyObj('element', ['find', 'parents']);
        onMethod = jasmine.createSpyObj('on', ['on']);
        setGetAttributeMethods = jasmine.createSpyObj('setAttribute', ['setAttribute', 'getAttribute']);

        onMethod.on.and.callFake((eventType, callback) => {
            if (eventType === 'click') {
                onClickEventCallback = callback;
            } else if (eventType === 'change') {
                onChangeEventCallback = callback;
            }
        });
        element.find.and.returnValue(onMethod);
        element.parents.and.returnValue([setGetAttributeMethods]);
        setGetAttributeMethods.getAttribute.and.returnValue('/api/customs/paperless/image?someParam=someValue');

        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        ewfFileUploaderServiceMock = jasmine.mockComponent(new EwfFileUploaderService());

        ewfFileUploaderControllerMock = jasmine
            .mockComponent(new EwfFileUploaderController(
                $scope,
                $attrs,
                attrsServiceMock,
                ewfFileUploaderServiceMock)
        );

        controllers = ewfFileUploaderControllerMock;

        sut = new EwfFileUploader(_$window_, attrsServiceMock);
        callPostLink();
    }));

    describe('#postLink', () => {
        it('should properly initialize form and events for uploading files', () => {
            expect(element.find).toHaveBeenCalledWith('input');
            expect(setGetAttributeMethods.setAttribute).toHaveBeenCalledWith('target', jasmine.any(String));
            expect(setGetAttributeMethods.getAttribute).toHaveBeenCalledWith('action');
            expect(ewfFileUploaderControllerMock.onFormReady).toHaveBeenCalledWith(jasmine.any(Object));
        });

        it('should add onclick event handler', () => {
            expect(onMethod.on).toHaveBeenCalledWith('click', jasmine.any(Function));
        });

        it('should assign onclick event handler', () => {
            expect(onClickEventCallback).toEqual(jasmine.any(Function));
        });

        it('should add onchange event handler', () => {
            expect(onMethod.on).toHaveBeenCalledWith('change', jasmine.any(Function));
        });

        it('should assign onchange event handler', () => {
            expect(onChangeEventCallback).toEqual(jasmine.any(Function));
        });

        it('should clear property with file name after button click', () => {
            const clickEvent = getEventMockWithFileType();
            onClickEventCallback(clickEvent);
            expect(clickEvent.target.value).toBe('');
        });

        it('should trigger before select event after button click', () => {
            const clickEvent = getEventMockWithFileType();
            onClickEventCallback(clickEvent);
            expect(attrsServiceMock.trigger).toHaveBeenCalledWith($scope, $attrs, 'filesBeforeSelect');
        });

        it('should not trigger before select event', () => {
            const clickEvent = getEventMockWithOtherType();
            onClickEventCallback(clickEvent);
            expect(attrsServiceMock.trigger).not.toHaveBeenCalled();
        });

        it('should trigger files ready to upload event with HTML5 file selection approach after files selected', () => {
            const changeEvent = getEventMockWithFileType();
            changeEvent.target.files = [];
            onChangeEventCallback(changeEvent);
            expect(ewfFileUploaderControllerMock.onFilesReadyToUpload).toHaveBeenCalledWith(changeEvent.target.files);
        });

        it('should trigger files ready to upload event with old file selection approach after files selected', () => {
            const changeEvent = getEventMockWithFileType();
            onChangeEventCallback(changeEvent);
            expect(ewfFileUploaderControllerMock.onFilesReadyToUpload).toHaveBeenCalledWith(changeEvent.target.value);
        });

        it('should not trigger files ready to upload event', () => {
            const changeEvent = getEventMockWithOtherType();
            onChangeEventCallback(changeEvent);
            expect(ewfFileUploaderControllerMock.onFilesReadyToUpload).not.toHaveBeenCalled();
        });

    });

    function getEventMockWithFileType() {
        return {
            target: {
                type: 'file',
                value: 'some_file.tmp'
            }
        };
    }

    function getEventMockWithOtherType() {
        return {
            target: {
                type: 'other'
            }
        };
    }
});
