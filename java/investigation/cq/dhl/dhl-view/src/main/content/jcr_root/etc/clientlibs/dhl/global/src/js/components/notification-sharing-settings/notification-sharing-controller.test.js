import NotificationSharingController from './notification-sharing-controller';
import ewfCrudService from './../../services/ewf-crud-service';
import EwfFormController from './../../directives/ewf-form/ewf-form-controller';
import systemSettings from './../../constants/system-settings-constants';
import EwfSpinnerService from './../../services/ewf-spinner-service';
import 'angularMocks';

describe('NotificationSharingController', () => {
    let sut;
    let $q;
    let $timeout;
    let $scope;
    let crudServiceMock;
    let ewfFormCtrlMock;
    let ewfSpinnerServiceMock;
    let getDefer;
    let updateDefer;
    const validForm = {
        $valid: true
    };
    const sharingListUrl = '/api/myprofile/notification/settings';
    const templatesDataUrl = '/api/myprofile/notification/settings/template/config';
    const sendTestEmailUrl = '/api/myprofile/notification/custom-template/test';

    const defaultModel = {
        templateTagsList: null,
        templateTypesList: [
            {
                key: 'key_custom_email',
                name: 'notifications_custom_email'
            },
            {
                key: 'key_remote_booking',
                name: 'notifications_remote_booking'
            }
        ],
        shipmentSharingDefaults: {
            customTemplate: {
                templateHtml: null
            },
            shareDetailsWith: {
                emails: []
            }
        }
    };

    const mockTpl = 'mock template';
    const mockHTML = 'mock html';

    let ckEditorTplToHTMLMock;
    let ckEditorHTMLToTplMock;

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;
        getDefer = $q.defer();
        updateDefer = $q.defer();

        ckEditorTplToHTMLMock = jasmine.createSpy('ckEditorTplToHTML').and.returnValue(mockHTML);
        ckEditorHTMLToTplMock = jasmine.createSpy('ckEditorHTMLToTpl').and.returnValue(mockTpl);
        $scope.ckEditorTplToHTML = ckEditorTplToHTMLMock;
        $scope.ckEditorHTMLToTpl = ckEditorHTMLToTplMock;

        crudServiceMock = jasmine.mockComponent(new ewfCrudService());
        crudServiceMock.getElementList.and.returnValue(getDefer.promise);
        crudServiceMock.updateElement.and.returnValue(updateDefer.promise);

        ewfFormCtrlMock = jasmine.mockComponent(new EwfFormController());
        ewfFormCtrlMock.ewfValidation.and.returnValue(true);

        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());

        sut = new NotificationSharingController(
            $scope,
            $timeout,
            crudServiceMock,
            systemSettings,
            ewfSpinnerServiceMock
        );

        spyOn(sut, 'revertChanges').and.callThrough();
        spyOn(sut, 'countEmails').and.callThrough();
        spyOn(sut, 'rebuildEmails').and.callThrough();
        spyOn(sut, 'setTranslation').and.callThrough();

        sut.sharingList = {
            shipmentSharingDefaults: {
                dhlTemplate: {
                    useAsDefaults: true,
                    detailsToShare: {
                        customsInvoice: true,
                        message: 'Some template',
                        pickupConfirmationNumber: true,
                        shippingLabel: true,
                        shippingReceipt: true,
                        trackingNumber: true
                    }
                },
                shareDetailsWith: {
                    emails: [
                       'testmail@test', 'anothertest@test'
                    ],
                    reciever: false,
                    sender: false
                }
            }
        };
    }));

    describe('#init', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should initialize component with spinner', () => {
            getDefer.resolve(defaultModel);
            expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
        });

        it('should make a call to notifications and sharing data endpoint with correct url', () => {
            expect(crudServiceMock.getElementList.calls.argsFor(0)).toEqual([sharingListUrl]);
        });

        it('should make a call to templates supporting data endpoint with correct url', () => {
            expect(crudServiceMock.getElementList.calls.argsFor(1)).toEqual([templatesDataUrl]);
        });

        it('should initialize notification and sharing data on request success', () => {
            getDefer.resolve(defaultModel);
            $timeout.flush();

            expect(sut.sharingList).toBe(defaultModel);
        });

        it('should initialize templates supporting data data on request success', () => {
            const templateTagsList = [];
            const templateTypesList = [];
            const response = angular.copy(defaultModel);
            angular.extend(response, {
                templateTagsList,
                templateTypesList
            });

            getDefer.resolve(response);
            $timeout.flush();

            expect(sut.templateTagsList).toEqual(jasmine.any(Array));
            expect(sut.templateTypesList).toEqual(jasmine.any(Array));
        });

        it('should initialize scope variable by custom template content', () => {
            const templateHtml = 'custom-tpl-content';
            const response = angular.copy(defaultModel);
            angular.extend(response.shipmentSharingDefaults.customTemplate, {
                templateHtml
            });

            getDefer.resolve(response);
            $timeout.flush();

            expect(ckEditorTplToHTMLMock).toHaveBeenCalledWith(templateHtml, jasmine.any(Array));
            expect($scope.ckEditorBuffer).toBe(mockHTML);
        });

        it('should display error if service failed', () => {
            getDefer.reject();
            $timeout.flush();

            expect(crudServiceMock.getElementList).toHaveBeenCalled();
        });

        it('should add translation to template types list items', () => {
            const response = angular.copy(defaultModel);
            getDefer.resolve(response);
            $timeout.flush();
            expect(sut.setTranslation).toHaveBeenCalled();
        });
    });

    describe('#updateSharingList', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should not call service if form is invalid', () => {
            const invalidForm = {
                $invalid: true
            };

            sut.updateSharingList(invalidForm, ewfFormCtrlMock);

            expect(crudServiceMock.updateElement).not.toHaveBeenCalled();
        });

        it('should call service on form submit, if fields are valid', () => {
            getDefer.resolve(defaultModel);
            $timeout.flush();
            sut.updateSharingList(validForm, ewfFormCtrlMock);

            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(sharingListUrl, sut.sharingList);
        });

        it('should save unsaved ckeditor changes', () => {
            const templateHtml = 'custom-tpl-content';
            const updatedTemplateHtml = 'updated-custom-tpl-content';
            const response = angular.copy(defaultModel);
            angular.extend(response.shipmentSharingDefaults.customTemplate, {
                templateHtml
            });

            getDefer.resolve(response);
            $timeout.flush();
            $scope.ckEditorBuffer = updatedTemplateHtml;
            sut.updateSharingList(validForm, ewfFormCtrlMock);

            expect(ckEditorHTMLToTplMock).toHaveBeenCalledWith(updatedTemplateHtml);
            expect(sut.sharingList.shipmentSharingDefaults.customTemplate.templateHtml).toBe(mockTpl);
        });

        it('should hide success block after system timeout', () => {
            sut.init();
            getDefer.resolve(defaultModel);
            $timeout.flush();
            sut.updateSharingList(validForm, ewfFormCtrlMock);
            updateDefer.resolve();
            $timeout.flush();

            expect(sut.sharingListUpdated).toBe(false);
        });

        it('should display error if service failed and copy current progress', () => {
            getDefer.resolve(defaultModel);
            $timeout.flush();
            sut.updateSharingList(validForm, ewfFormCtrlMock);
            updateDefer.reject();
            $timeout.flush();

            expect(sut.defaultSettings).toEqual(sut.sharingList);
        });
    });

    it('should call countEmails function in any case and set default list', () => {
        sut.init();
        getDefer.reject();
        $timeout.flush();

        expect(sut.countEmails).toHaveBeenCalled();
        expect(sut.defaultSettings).toEqual(sut.sharingList);
    });

    it('should emulate button block if too many emails', () => {
        sut.emailsCount = 10;
        sut.blockAddButtonIfEmpty();

        expect(sut.blockAddBtn).toEqual(true);
    });

    it('should rebuild emails after adding one', () => {
        sut.addEmail();

        expect(sut.rebuildEmails).toHaveBeenCalled();
    });

    it('should remove item', () => {
        sut.removeEmail(1);

        expect(sut.sharingList.shipmentSharingDefaults.shareDetailsWith.emails[1]).toEqual(undefined);
    });

    it('should define getter/setter for showMore flag', () => {
        expect(sut.isMoreInfoShown).toBeDefined();
        expect(sut.showMoreInfo).toBeDefined();
    });

    it('should initialize showMore flag to false', () => {
        expect(sut.isMoreInfoShown()).toEqual(false);
    });

    it('should switch showMore flag state on showMoreInfo run', () => {
        sut.showMoreInfo();

        expect(sut.isMoreInfoShown()).toEqual(true);
    });

    it('should set default active tab', () => {
        sut.init();

        expect(sut.activeEmailTemplateTab).toBeDefined();
    });

    it('should set active tab', () => {
        const tabName = 'custom';

        sut.setActiveTab(tabName);

        expect(sut.activeEmailTemplateTab).toEqual(tabName);
    });

    it('should return true if equals active tab, false if not', () => {
        const fakeTab = `${sut.activeEmailTemplateTab}fake`;

        sut.init();

        expect(sut.isActiveTab(sut.activeEmailTemplateTab)).toBeTruthy();
        expect(sut.isActiveTab(fakeTab)).toBeFalsy();
    });

    it('should add empty email if there is no such on server', () => {
        sut.sharingList.shipmentSharingDefaults.shareDetailsWith.emails = [];
        sut.init();
        getDefer.reject();
        $timeout.flush();

        expect(sut.sharingList.shipmentSharingDefaults.shareDetailsWith.emails[0]).toEqual('');
    });

    it('should reset list of data to default', () => {
        sut.defaultSettings = {
            defaultSettingMock: 'some data'
        };
        sut.revertChanges();

        expect(sut.sharingList).toEqual(sut.defaultSettings);
    });

    it('should count number of emails', () => {
        sut.countEmails();

        expect(sut.emailsCount).toEqual(2);
    });

    it('should revert changes and rebuild emails', () => {
        sut.init();
        getDefer.resolve(defaultModel);
        $timeout.flush();
        sut.updateSharingList(validForm, ewfFormCtrlMock);
        updateDefer.resolve();
        $timeout.flush();
        spyOn(sut, 'cancelChangesAction').and.callThrough();
        sut.cancelChangesAction();

        expect(sut.revertChanges).toHaveBeenCalled();
        expect(sut.rebuildEmails).toHaveBeenCalled();
        expect(sut.sharingList).toEqual(sut.defaultSettings);
    });

    describe('#saveTemplate', () => {
        it('should apply updated template data to model', () => {
            const templateHtml = 'custom-tpl-content';
            const updatedTemplateHtml = 'updated-custom-tpl-content';
            const response = angular.copy(defaultModel);
            angular.extend(response.shipmentSharingDefaults.customTemplate, {
                templateHtml
            });

            sut.init();
            getDefer.resolve(response);
            $timeout.flush();
            $scope.ckEditorBuffer = updatedTemplateHtml;
            sut.saveTemplate();

            expect(ckEditorHTMLToTplMock).toHaveBeenCalledWith(updatedTemplateHtml);
            expect(sut.sharingList.shipmentSharingDefaults.customTemplate.templateHtml).toBe(mockTpl);
        });
    });

    describe('#mapOptionKey', () => {
        it('should return null if provided input is not valuable', () => {
            expect(sut.mapOptionKey(null)).toEqual(null);

            expect(sut.mapOptionKey('')).toEqual(null);
        });

        it('should return input as is if provided input is valuable, and do not have "key" property', () => {
            expect(sut.mapOptionKey('qwer')).toEqual('qwer');

            expect(sut.mapOptionKey(234)).toEqual(234);
        });

        it('should return option.key property value if provided input has it', () => {
            const key = 1234;

            expect(sut.mapOptionKey({
                key
            })).toEqual(key);
        });
    });

    describe('#disableTemplateSaving', () => {
        beforeEach(() => {
            const response = angular.copy(defaultModel);
            angular.extend(response.shipmentSharingDefaults.customTemplate, {
                templateHtml: 'custom-tpl-content'
            });

            sut.init();
            getDefer.resolve(response);
            $timeout.flush();
        });

        it('should be truthy if editor content matches model', () => {
            expect(sut.disableTemplateSaving()).toEqual(true);
        });

        it('should be falsy if editor content does not match model', () => {
            $scope.ckEditorBuffer = 'updated-custom-tpl-content';

            expect(sut.disableTemplateSaving()).toEqual(false);
        });

        it('should be truthy if model not initialized', () => {
            sut.sharingList = undefined;

            expect(sut.disableTemplateSaving()).toEqual(true);
        });
    });

    describe('#sendTestEmail', () => {
        it('should make POST request with provided data', () => {
            const emailSubject = 'email subject';
            const templateHtml = 'custom-tpl-content';
            const updTemplateHtml = 'updated-custom-tpl-content';
            const response = angular.copy(defaultModel);
            angular.extend(response.shipmentSharingDefaults.customTemplate, {
                emailSubject,
                templateHtml
            });

            sut.init();
            getDefer.resolve(response);
            $timeout.flush();
            $scope.ckEditorBuffer = updTemplateHtml;
            sut.sendTestEmail();

            expect(ckEditorHTMLToTplMock).toHaveBeenCalledWith(updTemplateHtml);
            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(sendTestEmailUrl, {
                subject: emailSubject,
                content: mockTpl
            });
        });

        describe('#setTranslation', () => {
            it('should set translation key according to value', () => {
                const name = 'option';
                expect(sut.setTranslation({name}).nls).toEqual(`shipment-settings.nfn_shr__email_tpl_${name}`);
            });
        });
    });
});
