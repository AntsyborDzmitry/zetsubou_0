import 'services/rule-service';
import './../../constants/system-settings-constants';
import './../../services/ewf-reward-cards-service';

EwfMyProfileController.$inject = ['$scope', '$attrs', 'ewfRewardCardsService'];

export default function EwfMyProfileController($scope, $attrs, ewfRewardCardsService) {
    const vm = this;
    Object.assign(vm, {
        urlWithLang: $scope.$eval($attrs.urlWithLang)
    });

    ewfRewardCardsService.canShowRewardCards()
        .then((responses) => {
            vm.showRewardCards = responses;
        });
}
