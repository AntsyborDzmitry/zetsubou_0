import './../../services/ewf-crud-service';
import './../../constants/system-settings-constants';
import './../../services/ewf-spinner-service';

NotificationSharingController.$inject = [
    '$scope',
    '$timeout',
    'ewfCrudService',
    'systemSettings',
    'ewfSpinnerService'
];

export default function NotificationSharingController(
    $scope,
    $timeout,
    ewfCrudService,
    systemSettings,
    ewfSpinnerService) {
    const vm = this;
    const notificationShareListUrl = '/api/myprofile/notification/settings';
    const templatesSupportDataUrl = '/api/myprofile/notification/settings/template/config';
    const sendTestEmailUrl = '/api/myprofile/notification/custom-template/test';
    const emailsMaxLength = 5;

    let showMore = false;
    let savedEditorHtml;

    Object.assign(vm, {
        scope: $scope,
        sharingListUpdated: false,
        activeEmailTemplateTab: 'standard',
        emailsCount: 0,
        blockAddBtn: false,
        defaultSettings: {},
        helpOpen: {
            shipStatus: false,
            shipDetails: false
        },

        init,
        updateSharingList,
        countEmails,
        addEmail,
        blockAddButtonIfEmpty,
        removeEmail,
        rebuildEmails,
        showMoreInfo,
        isMoreInfoShown,
        isActiveTab,
        setActiveTab,
        revertChanges,
        cancelChangesAction,
        setTranslation,

        templateTagsList: [],
        templateTypesList: [],
        saveTemplate,
        disableTemplateSaving,
        sendTestEmail,

        mapOptionKey
    });

    function init() {
        initNotificationSharingList();
        initTemplateTagsList();
    }

    function initNotificationSharingList() {
        const promise = ewfCrudService.getElementList(notificationShareListUrl)
            .then((sharingList) => {
                vm.sharingList = sharingList;

                $scope.ckEditorBuffer = $scope.ckEditorTplToHTML(
                    vm.sharingList.shipmentSharingDefaults.customTemplate.templateHtml,
                    vm.templateTagsList
                );
                savedEditorHtml = $scope.ckEditorBuffer;
            })
            .finally(() => {
                vm.countEmails();
                if (!vm.emailsCount) {
                    vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails[0] = '';
                }
                vm.rebuildEmails();
                vm.defaultSettings = angular.copy(vm.sharingList);
            });

        return ewfSpinnerService.applySpinner(promise);
    }

    function initTemplateTagsList() {
        ewfCrudService.getElementList(templatesSupportDataUrl)
            .then((templatesData) => {
                vm.templateTagsList = templatesData.templateTagsList;
                vm.templateTypesList = templatesData.templateTypesList.map(vm.setTranslation);
            });
    }

    function updateSharingList(sharingListForm, ewfFormCtrl) {
        if (sharingListForm.$invalid && ewfFormCtrl.ewfValidation()) {
            return;
        }
        $timeout.cancel(vm.successMsgTimeout);

        saveTemplate();

        ewfCrudService.updateElement(notificationShareListUrl, vm.sharingList)
            .then(sharingListUpdated)
            .finally(() => {
                vm.defaultSettings = angular.copy(vm.sharingList);
            });
    }

    function sharingListUpdated() {
        vm.sharingListUpdated = true;
        vm.successMsgTimeout = $timeout(() => {
                vm.sharingListUpdated = false;
            },
            systemSettings.showInformationHintTimeout
        );
    }

    function countEmails() {
        vm.emailsCount = vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails.length;
    }

    function addEmail() {
        const lastItem = vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails[vm.emailsCount - 1];
        if (vm.emailsCount < emailsMaxLength && lastItem) {
            vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails.push('');
        }
        vm.rebuildEmails();
    }

    function blockAddButtonIfEmpty() {
        vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails.forEach((emailItem) => {
            vm.blockAddBtn = (!emailItem || vm.emailsCount >= emailsMaxLength);
        });
    }

    function removeEmail(indexOfEmail) {
        vm.sharingList.shipmentSharingDefaults.shareDetailsWith.emails.splice(indexOfEmail, 1);
        vm.rebuildEmails();
    }

    function rebuildEmails() {
        vm.countEmails();
        vm.blockAddButtonIfEmpty();
    }

    function showMoreInfo() {
        showMore = true;
    }

    function isMoreInfoShown() {
        return showMore;
    }

    function isActiveTab(name) {
        return vm.activeEmailTemplateTab === name;
    }

    function setActiveTab(name) {
        vm.activeEmailTemplateTab = name;
    }

    function revertChanges() {
        vm.sharingList = angular.copy(vm.defaultSettings);
    }

    function cancelChangesAction() {
        vm.revertChanges();
        vm.rebuildEmails();
    }

    function saveTemplate() {
        if (templateNotChanged()) {
            return;
        }

        savedEditorHtml = $scope.ckEditorBuffer;
        vm.sharingList.shipmentSharingDefaults.customTemplate.templateHtml = $scope.ckEditorHTMLToTpl(savedEditorHtml);
    }

    function mapOptionKey(option) {
        return option && option.key || option || null;
    }

    function setTranslation(option) {
        option.nls = `shipment-settings.nfn_shr__email_tpl_${option.name}`;
        return option;
    }

    function templateNotChanged() {
        return (!savedEditorHtml && !$scope.ckEditorBuffer) || savedEditorHtml === $scope.ckEditorBuffer;
    }

    function disableTemplateSaving() {
        return !vm.sharingList || templateNotChanged();
    }

    function sendTestEmail() {
        ewfCrudService.updateElement(sendTestEmailUrl, {
            subject: vm.sharingList.shipmentSharingDefaults.customTemplate.emailSubject,
            content: $scope.ckEditorHTMLToTpl($scope.ckEditorBuffer)
        });
    }
}
