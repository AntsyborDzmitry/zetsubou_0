import './profile-edit-quick-link-dialog-service';
import './../profile-settings-service';
import './../../../services/ewf-crud-service';
import './../../../constants/system-settings-constants';
import './../../../services/ewf-spinner-service';

ProfileQuickLinksController.$inject = [
    '$timeout',
    '$sce',
    'ewfCrudService',
    'profileEditQuickLinkDialogService',
    'profileSettingsService',
    'systemSettings',
    'ewfSpinnerService'];

export default function ProfileQuickLinksController(
    $timeout,
    $sce,
    ewfCrudService,
    profileEditQuickLinkDialogService,
    profileSettingsService,
    systemSettings,
    ewfSpinnerService) {
    const vm = this;
    const addUrl = '/api/myprofile/links/add';

    Object.assign(vm, {
        alertTypes: {
            added: false,
            updated: false,
            deleted: false
        },
        columnsToDisplay: [
            {alias: 'name', title: 'quick-links.name_column'},
            {alias: 'link', title: 'quick-links.url_column'}
        ],
        quickLinkUrl: '',
        quickLinkName: '',
        gridData: undefined,

        init,
        addQuickLink,
        editQuickLink,
        getLinkHtml,
        rebuildGrid,
        toggleNotificationAlert,
        updateQuickLink,
        updateLinkHtml
    });

    function init() {
        vm.gridCtrl.editCallback = editQuickLink;
           rebuildGrid();
    }

    function rebuildGrid() {
        const promise = profileSettingsService.getQuickLinks()
            .then((data) => {
                const parsedData = data.map((item) => {
                    item.link = getLinkHtml(item.url);
                    return item;
                });
                vm.gridCtrl.rebuildGrid(parsedData);
            });
        return ewfSpinnerService.applySpinner(promise);
    }

    function toggleNotificationAlert(action) {
        vm.alertTypes[action] = true;
        $timeout(() => {
            vm.alertTypes[action] = false;
        }, systemSettings.showInformationHintTimeout);
    }

    function addQuickLink(ngform, ewfForm) {
        const isFormValid = ngform.$valid && vm.quickLinkName !== '' && vm.quickLinkUrl !== '';
        if (isFormValid) {
            const quickLink = {
                name: vm.quickLinkName,
                url: vm.quickLinkUrl
            };
            ewfCrudService.addElement(addUrl, quickLink)
                .then(() => {
                    vm.toggleNotificationAlert('added');
                    vm.rebuildGrid();
                }).catch(() => {
                    ewfForm.ewfValidation();
                });
        }
    }

    function updateQuickLink(linkInfo) {
        vm.updateLinkHtml(linkInfo);
        vm.gridCtrl.updateElement(linkInfo)
            .then(() => {
                vm.toggleNotificationAlert('updated');
            });
    }

    function editQuickLink(key) {
        const quickLink = vm.gridData.find((elem) => elem.key === key);
        profileEditQuickLinkDialogService.showSaveDialog(quickLink.name, quickLink.url)
            .then((linkInfo) => {
                linkInfo.key = key;
                vm.updateQuickLink(linkInfo);
            });
    }

    function getLinkHtml(string) {
        return $sce.trustAsHtml(`<a href="${string}" target="_blank">${string}</a>`);
    }

    function updateLinkHtml(linkInfo) {
        const findByKey = (el) => el.key === linkInfo.key;
        let quickLink = vm.gridCtrl.attributes.gridData.find(findByKey);
        quickLink.link = getLinkHtml(linkInfo.url);
    }
}
