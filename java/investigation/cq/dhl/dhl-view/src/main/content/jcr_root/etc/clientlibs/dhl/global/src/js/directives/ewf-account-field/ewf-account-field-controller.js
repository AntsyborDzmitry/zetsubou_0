import '../../services/rule-service';

AccountFieldController.$inject = ['$scope', 'ruleService', '$timeout'];

export default function AccountFieldController($scope, ruleService, $timeout) {
    const vm = this;
    const user = vm.user = $scope.regCtrl.user;
    let uuid = 0;
    let rules;

    vm.maxArrayLengthValid = true;

    vm.add = addAccount;
    vm.remove = removeAccount;

    vm.isUserHasMultiplyAccounts = isUserHasMultiplyAccounts;
    vm.isItemFirstInArray = isItemFirstInArray;

    vm.setFieldId = setFieldId;

    init();

    function init() {
        addAccount();
        user.primaryAccountId = user.accountNumbers[0].id;
        $timeout(function() {
           $scope.registrationAccountForm.$invalid = true;
        });
    }

    function removeAccount(acc) {
        if (isUserHasMultiplyAccounts()) {
            if (!isItemFirstInArray(acc)) {
                const position = user.accountNumbers.indexOf(acc);
                user.accountNumbers.splice(position, 1);
                if (user.primaryAccountId === acc.id) {
                    user.primaryAccountId = user.accountNumbers[0].id;
                }
            }
        }
        validateMaxArrayLength();
    }

    function addAccount() {
        const acc = {
            id: getUniqueId(),
            account: '',
            primary: false
        };

        user.accountNumbers.push(acc);
        validateMaxArrayLength();
    }

    function getUniqueId() {
        return uuid++;
    }

    function isUserHasMultiplyAccounts() {
        return user.accountNumbers.length > 1;
    }

    function isItemFirstInArray(item) {
        return user.accountNumbers.indexOf(item) === 0;
    }

    function setFieldId(fieldId) {
        vm.fieldId = fieldId;
        initializeRules(fieldId);
    }

    function validateMaxArrayLength() {
        vm.maxArrayLengthValid = true;
        if (rules) {
            for (let rule of rules.validators) {
                const functionName = rule.type;
                if (functionName === 'maxArrayLength') {
                    vm.maxArrayLengthValid = user.accountNumbers.length <= rule.params.value;
                    break;
                }
            }
        }
    }

    function initializeRules(fieldId) {
        // ruleService is async, but we get rule synchronously
        let formFields = ruleService.getFieldRules(fieldId);
        if (formFields) {
            rules = formFields;
        }
    }
}
