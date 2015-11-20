define(['exports', 'module', '../../services/rule-service'], function (exports, module, _servicesRuleService) {
    'use strict';

    module.exports = AccountFieldController;

    AccountFieldController.$inject = ['$scope', 'ruleService', '$timeout'];

    function AccountFieldController($scope, ruleService, $timeout) {
        var vm = this;
        var user = vm.user = $scope.regCtrl.user;
        var uuid = 0;
        var rules = undefined;

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
            $timeout(function () {
                $scope.registrationAccountForm.$invalid = true;
            });
        }

        function removeAccount(acc) {
            if (isUserHasMultiplyAccounts()) {
                if (!isItemFirstInArray(acc)) {
                    var position = user.accountNumbers.indexOf(acc);
                    user.accountNumbers.splice(position, 1);
                    if (user.primaryAccountId === acc.id) {
                        user.primaryAccountId = user.accountNumbers[0].id;
                    }
                }
            }
            validateMaxArrayLength();
        }

        function addAccount() {
            var acc = {
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
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = rules.validators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var rule = _step.value;

                        var functionName = rule.type;
                        if (functionName === 'maxArrayLength') {
                            vm.maxArrayLengthValid = user.accountNumbers.length <= rule.params.value;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }

        function initializeRules(fieldId) {
            // ruleService is async, but we get rule synchronously
            var formFields = ruleService.getFieldRules(fieldId);
            if (formFields) {
                rules = formFields;
            }
        }
    }
});
//# sourceMappingURL=ewf-account-field-controller.js.map
