import './../../services/password-service';

ForgotPasswordController.$inject = ['$scope', '$window', 'logService', 'navigationService', 'passwordService'];

export default function ForgotPasswordController($scope, $window, logService, navigationService, passwordService) {
    const vm = this;

    const captchaOptions = {
        imgPath: '/etc/clientlibs/dhl/global/public/img/',
        captcha: {
            numberOfImages: 5,
            url: '/api/visualcaptcha',
            callbacks: {
                // TODO: We have to use this callback in 0.0.7 version of captcha.
                // TODO: We sincerely hope, that in next version <a href> won't be in a sources anymore
                // TODO:    so we can remove callback at all
                loaded: function() {
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
                    const anchorOptions = $window.document.getElementById('forgotpassword-captcha')
                                                            .getElementsByTagName('a');
                    // .getElementsByTagName does not return an actual array, so
                    const anchorList = Array.prototype.slice.call(anchorOptions);
                    anchorList.forEach((anchorItem) => {
                        bindClick(anchorItem, (event) => event.preventDefault());
                    });
                }
            }
        },
        init: function(captcha) {
            vm.captcha = captcha;
        }
    };

    Object.assign(vm, {
        sendResetPassword,
        redirectToLoginPage,

        email: '',
        error: '',
        isOnWay: false,
        captchaOptions
    });


    function sendResetPassword(formError) {
        $scope.$broadcast('ValidateForm');
        if (formError.email === false && formError.required === false && formError.formatted === false) {
            return passwordService.sendResetPassword(vm.email, vm.captcha.getCaptchaData())
                .then(() => {
                    vm.isOnWay = true;
                    vm.error = '';
                })
                .catch((errorConst) => {
                    vm.error = errorConst;
                    vm.captcha.refresh();
                });
        }
    }

    function redirectToLoginPage() {
        navigationService.redirectToLogin();
    }
}
