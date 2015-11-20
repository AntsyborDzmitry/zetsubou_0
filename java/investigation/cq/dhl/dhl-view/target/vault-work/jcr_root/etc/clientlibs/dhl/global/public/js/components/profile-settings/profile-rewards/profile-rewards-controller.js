define(['exports', 'module', './profile-rewards-directive', './../../../services/ewf-crud-service'], function (exports, module, _profileRewardsDirective, _servicesEwfCrudService) {
    'use strict';

    module.exports = ProfileRewardsController;

    ProfileRewardsController.$inject = ['$scope', '$q', 'ewfCrudService', 'logService'];

    function ProfileRewardsController($scope, $q, ewfCrudService, logService) {
        var vm = this;
        var numOfFixedDigits = 8;
        var defaultRewardFirstPart = '98263000';
        var defaultRewardSecondPart = '00000000000';
        var rewardProgramURL = 'https://www.nectar.com/register/consumer/enrol.htm';

        Object.assign(vm, {
            profileReward: '',
            errorMessages: [],
            profileRewardFirstPart: defaultRewardFirstPart,
            showRewardProgramForNewUser: true,
            patterns: {
                numeric: '^(\\s*|\\d+)$'
            },

            rewardProgramURL: rewardProgramURL,
            defaultRewardSecondPart: defaultRewardSecondPart,
            updateRewardNumber: updateRewardNumber
        });

        ewfCrudService.getElementDetails('/api/myprofile/rewards').then(function (response) {
            var profileReward = response;
            vm.profileReward = profileReward.rewardsCardNumber.replace('\"', '');
            vm.profileReward = vm.profileReward.replace('\"', '');
            if (response !== '' && response !== '""') {
                var _length = vm.profileReward.length;
                if (_length > numOfFixedDigits) {
                    vm.profileRewardFirstPart = vm.profileReward.substring(0, numOfFixedDigits);
                    vm.profileRewardSecondPart = vm.profileReward.substring(numOfFixedDigits, _length);
                    vm.showRewardProgramForNewUser = false;
                }
            }
        })['catch'](function (err) {
            logService.error(err);
            $q.reject(err);
        });

        function updateRewardNumber() {

            var rewardObject = getRewardObject(vm.profileRewardSecondPart ? vm.profileRewardFirstPart + vm.profileRewardSecondPart : '');

            var rewardNumberPromise = ewfCrudService.updateElement('/api/myprofile/rewards', rewardObject);
            rewardNumberPromise.then(function (response) {
                vm.rewardNumberResponse = response;
                vm.showRewardProgramForNewUser = false;
                vm.errorMessages = [];
            })['catch'](function (err) {
                logService.error(err);
                if (err.fieldErrors && err.fieldErrors.rewardsCardNumber && err.fieldErrors.rewardsCardNumber instanceof Array) {

                    vm.errorMessages = err.fieldErrors.rewardsCardNumber;
                } else if (err.errors && err.errors instanceof Array) {
                    vm.errorMessages = err.errors;
                } else {
                    vm.errorMessages.push(err.errors ? err.errors : 'internal error ');
                }
                $q.reject(err);
            });
        }

        function getRewardObject(rewardsNumber) {
            return {
                rewardsCardNumber: rewardsNumber
            };
        }
    }
});
//# sourceMappingURL=profile-rewards-controller.js.map
