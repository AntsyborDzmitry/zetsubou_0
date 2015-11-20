import './profile-rewards-directive';
import './../../../services/ewf-crud-service';

ProfileRewardsController.$inject = ['$scope', '$q', 'ewfCrudService', 'logService'];

export default function ProfileRewardsController($scope, $q, ewfCrudService, logService) {
    const vm = this;
    const numOfFixedDigits = 8;
    const defaultRewardFirstPart = '98263000';
    const defaultRewardSecondPart = '00000000000';
    const rewardProgramURL = 'https://www.nectar.com/register/consumer/enrol.htm';

    Object.assign(vm, {
        profileReward: '',
        errorMessages: [],
        profileRewardFirstPart: defaultRewardFirstPart,
        showRewardProgramForNewUser: true,
        patterns: {
            numeric: '^(\\s*|\\d+)$'
        },

        rewardProgramURL,
        defaultRewardSecondPart,
        updateRewardNumber
    });

    ewfCrudService.getElementDetails('/api/myprofile/rewards')
        .then((response) => {
            let profileReward = response;
            vm.profileReward = profileReward.rewardsCardNumber.replace('\"', '');
            vm.profileReward = vm.profileReward.replace('\"', '');
            if (response !== '' && response !== '""') {
                let length = vm.profileReward.length;
                if (length > numOfFixedDigits) {
                    vm.profileRewardFirstPart = vm.profileReward.substring(0, numOfFixedDigits);
                    vm.profileRewardSecondPart = vm.profileReward.substring(numOfFixedDigits, length);
                    vm.showRewardProgramForNewUser = false;
                }
            }
        })
        .catch((err) => {
            logService.error(err);
            $q.reject(err);
        });

    function updateRewardNumber() {

        const rewardObject = getRewardObject(vm.profileRewardSecondPart ?
            vm.profileRewardFirstPart + vm.profileRewardSecondPart : '');

        const rewardNumberPromise = ewfCrudService.updateElement('/api/myprofile/rewards', rewardObject);
        rewardNumberPromise
            .then((response) => {
                vm.rewardNumberResponse = response;
                vm.showRewardProgramForNewUser = false;
                vm.errorMessages = [];
            })
            .catch((err) => {
                logService.error(err);
                if (err.fieldErrors && err.fieldErrors.rewardsCardNumber
                    && (err.fieldErrors.rewardsCardNumber instanceof Array)) {

                        vm.errorMessages = err.fieldErrors.rewardsCardNumber;
                } else if (err.errors && (err.errors instanceof Array)) {
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
