define(['exports', 'ewf', './location-selector-controller'], function (exports, _ewf, _locationSelectorController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _LocationController = _interopRequireDefault(_locationSelectorController);

    _ewf2['default'].directive('ewfLocationSelector', function () {
        return {
            restrict: 'E',
            controller: _LocationController['default'],
            controllerAs: 'locationSelector',
            template: '<div class=main><div class=area__background></div><div class=container><div class=\"col-8 darker\"><form action=\"/\"><h1 class=select_location__title nls=selectlocation.title></h1><div class=row><div ng-show=locationSelector.error class=\"row error\" ng-model=locationSelector.error><div class=col-md-9><p class=text-danger>{{locationSelector.error}}</p></div></div><div class=\"field-wrapper ng-scope\"><div class=col-8><div class=\"select full-width\"><select id=location name=location ewf-input=locationSelector.location ng-options=\"lc.name for lc in locationSelector.availableLocations\" ng-model=locationSelector.currentLocation></select></div></div><div class=col-3><button ng-click=locationSelector.saveLocation() type=button class=\"btn btn_success btn_regular\"><span nls=selectlocation.go_button></span></button></div></div><div class=field-wrapper><label class=\"login__remember checkbox checkbox_small\"><input class=checkbox__input id=rememberLocation type=checkbox data-aqa-id=rememberLocation ng-model=locationSelector.rememberLocation> <span class=label nls=selectlocation.remember_location></span></label></div></div></form></div></div></div>'
        };
    });
});
//# sourceMappingURL=location-selector-directive.js.map
