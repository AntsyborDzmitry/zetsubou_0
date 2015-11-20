define(['exports', 'module', './../../services/password-service'], function (exports, module, _servicesPasswordService) {
    'use strict';

    module.exports = ForgotPasswordController;

    ForgotPasswordController.$inject = ['$scope', '$window', 'logService', 'navigationService', 'passwordService'];

    function ForgotPasswordController($scope, $window, logService, navigationService, passwordService) {
        var vm = this;

        var captchaOptions = {
            imgPath: '/etc/clientlibs/dhl/global/public/img/',
            captcha: {
                numberOfImages: 5,
                url: '/api/visualcaptcha',
                callbacks: {
                    // TODO: We have to use this callback in 0.0.7 version of captcha.
                    // TODO: We sincerely hope, that in next version <a href> won't be in a sources anymore
                    // TODO:    so we can remove callback at all
                    loaded: function loaded() {
                        // Binds an element to callback on click
                        // @param element object like document.getElementById() (has to be a single element)
                        // @param callback function to run when the element is clicked
                        function bindClick(element, callback) {
                            if (element.addEventListener) {
                                element.addEventListener('click', callback, false);
                            } else {
                                element.attachEvent('onclick', callback);
                            }
                        }
                        // Avoid adding the hashtag to the URL when clicking/selecting visualCaptcha options
                        var anchorOptions = $window.document.getElementById('forgotpassword-captcha').getElementsByTagName('a');
                        // .getElementsByTagName does not return an actual array, so
                        var anchorList = Array.prototype.slice.call(anchorOptions);
                        anchorList.forEach(function (anchorItem) {
                            bindClick(anchorItem, function (event) {
                                return event.preventDefault();
                            });
                        });
                    }
                }
            },
            init: function init(captcha) {
                vm.captcha = captcha;
            }
        };

        Object.assign(vm, {
            sendResetPassword: sendResetPassword,
            redirectToLoginPage: redirectToLoginPage,

            email: '',
            error: '',
            isOnWay: false,
            captchaOptions: captchaOptions
        });

        function sendResetPassword(formError) {
            $scope.$broadcast('ValidateForm');
            if (formError.email === false && formError.required === false && formError.formatted === false) {
                return passwordService.sendResetPassword(vm.email, vm.captcha.getCaptchaData()).then(function () {
                    vm.isOnWay = true;
                    vm.error = '';
                })['catch'](function (errorConst) {
                    vm.error = errorConst;
                    vm.captcha.refresh();
                });
            }
        }

        function redirectToLoginPage() {
            navigationService.redirectToLogin();
        }
    }
});
//# sourceMappingURL=forgot-password-controller.js.map
