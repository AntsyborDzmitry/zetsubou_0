import NotificationSharing from './notification-sharing-directive';
import NotificationSharingController from './notification-sharing-controller';
import 'angularMocks';

describe('notificationSharing', () => {
    let sut;
    let notificationSharingCtrl;
    let $scope, elem, attrs;
    let $window;
    let replace;
    let filterMock;
    let textMock;
    let htmlWriterMock;
    let createFromHtml;
    let insertElement;
    let elementMock;
    let fromHtmlMock;
    let tagMock;
    let editorOn;
    let fragmentMock;
    let writeHtmlMock;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        notificationSharingCtrl = jasmine.mockComponent(new NotificationSharingController());

        replace = jasmine.createSpy('replace');
        elementMock = {};
        createFromHtml = jasmine.createSpy('createFromHtml').and.returnValue(elementMock);
        insertElement = jasmine.createSpy('insertElement');
        editorOn = jasmine.createSpy('on');
        filterMock = jasmine.createSpy('filter');
        textMock = jasmine.createSpy('text');
        htmlWriterMock = jasmine.createSpy('htmlWriter').and.returnValue({
            getHtml: jasmine.createSpy('getHtml')
        });
        writeHtmlMock = jasmine.createSpy('writeHtml');
        fragmentMock = {
            writeHtml: writeHtmlMock
        };
        fromHtmlMock = jasmine.createSpy('fromHtml').and.returnValue(fragmentMock);
        tagMock = {
            key: 'some tag key',
            name: 'some tag name'
        };
        $window = {
            CKEDITOR: {
                replace,
                dom: {
                    element: {
                        createFromHtml
                    }
                },
                instances: {
                    dhlTxtEditor: {
                        insertElement,
                        on: editorOn
                    }
                },
                htmlParser: {
                    filter: filterMock,
                    text: textMock,
                    fragment: {
                        fromHtml: fromHtmlMock
                    }
                },
                htmlWriter: htmlWriterMock
            }
        };

        sut = new NotificationSharing($window);

        sut.link.pre($scope, elem, attrs, notificationSharingCtrl);
    }));

    describe('#preLink', () => {
        it('should wrap replace function', () => {
            expect($window.CKEDITOR.replace).not.toBe(replace);
            expect($window.CKEDITOR.replace).toEqual(jasmine.any(Function));
        });

        it('should call replace function', () => {
            const containerMock = {};
            const configMock = {};

            $window.CKEDITOR.replace(containerMock, configMock);

            expect(replace).toHaveBeenCalledWith(containerMock, jasmine.objectContaining({
                customConfig: jasmine.any(String),
                on: {
                    instanceReady: jasmine.any(Function),
                    dataReady: jasmine.any(Function)
                }
            }));
        });

        it('should assign template inserting function to scope', () => {
            $window.CKEDITOR.replace();

            expect($scope.ckEditorInsertTag).toEqual(jasmine.any(Function));
            expect($scope.ckEditorTplToHTML).toEqual(jasmine.any(Function));
            expect($scope.ckEditorHTMLToTpl).toEqual(jasmine.any(Function));
        });

        it('should call to init function of controller', () => {
            expect(notificationSharingCtrl.init).toHaveBeenCalledWith();
        });
    });

    describe('#ckEditorInsertTag', () => {
        beforeEach(() => {
            $window.CKEDITOR.replace();
            $scope.ckEditorInsertTag(tagMock);
        });

        it('should make call to Editors`s API to create element from html', () => {
            expect(createFromHtml).toHaveBeenCalledWith(
                `<input dhl-tpl-key="${tagMock.key}" type="button" value="[[${tagMock.name}]]" />`
            );
        });

        it('should make a call to Editor`s API to insert created element to Editor`s dom', () => {
            expect(insertElement).toHaveBeenCalledWith(elementMock);
        });
    });

    describe('#ckEditorTplToHTML', () => {
        beforeEach(() => {
            $window.CKEDITOR.replace();
        });

        it('should return empty string if input is falsy', () => {
            const html = $scope.ckEditorTplToHTML(null);

            expect(html).toEqual('');
        });

        it('should convert provided template string to html', () => {
            const existingKey = '${existingKey}';
            const existingName = 'existing name';
            const nonExistingKey = '${nonExistingKey}';
            const tags = [
                {
                    key: '${blah_key}',
                    name: 'blah value'
                },
                {
                    key: existingKey,
                    name: existingName
                }
            ];
            const html = $scope.ckEditorTplToHTML(`qwer${existingKey}asdf${nonExistingKey}zxcv`, tags);

            expect(html).toEqual(
                `qwer<input dhl-tpl-key="${existingKey}" type="button" value="[[${existingName}]]" />asdf` +
                    `<input dhl-tpl-key="${nonExistingKey}" type="button" value="[[${nonExistingKey}]]" />zxcv`
            );
        });
    });

    describe('#ckEditorHTMLToTpl', () => {
        beforeEach(() => {
            $window.CKEDITOR.replace();
        });

        it('should return empty string if input is falsy', () => {
            const html = $scope.ckEditorHTMLToTpl(null);

            expect(fromHtmlMock).not.toHaveBeenCalled();
            expect(html).toEqual('');
        });

        it('should convert provided html string to template', () => {
            const html = 'html string';

            $scope.ckEditorHTMLToTpl(html);

            expect(fromHtmlMock).toHaveBeenCalledWith(html);
            expect(writeHtmlMock).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object));
        });
    });
});
