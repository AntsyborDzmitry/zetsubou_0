import ewf from 'ewf';
import LanguageController from './langselector-controller';

ewf.directive('ewfLangselector', () => {
    return {
        restrict: 'E',
        controller: LanguageController,
        controllerAs: 'langselector',
        templateUrl: 'langselector-layout.html'
    };
});
