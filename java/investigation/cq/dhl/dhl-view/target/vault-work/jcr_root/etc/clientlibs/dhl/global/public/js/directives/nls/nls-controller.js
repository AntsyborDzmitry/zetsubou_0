define(['exports', 'module', './../../services/nls-service'], function (exports, module, _servicesNlsService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = NLSController;

    NLSController.$inject = ['$q', 'nlsService'];

    function NLSController($q, nlsService) {
        var vm = this;

        vm.setRenderFunction = setRenderFunction;
        vm.translate = translate;

        var renderFunction = undefined;

        function setRenderFunction(newRenderFunction) {
            renderFunction = newRenderFunction;
        }

        /**
         * @param {String} nlsKey key in form 'dictionaryName.key'
         */
        function translate(nlsKey) {
            if (!nlsService.isValidKey(nlsKey)) {
                renderFunction({ text: 'wrong format "' + nlsKey + '"' });
                return;
            }

            var _nlsKey$split = nlsKey.split('.');

            var _nlsKey$split2 = _slicedToArray(_nlsKey$split, 2);

            var dictionaryName = _nlsKey$split2[0];
            var key = _nlsKey$split2[1];

            nlsService.getDictionary(dictionaryName).then(function (dictionary) {
                var translations = {};

                var text = dictionary[key];
                if (text) {
                    translations.text = text;
                }

                key += '.';
                var keyLength = key.length;
                Object.keys(dictionary).forEach(function (theKey) {
                    if (theKey.substr(0, keyLength) === key) {
                        var attrName = theKey.substr(keyLength);
                        translations[attrName] = dictionary[theKey];
                    }
                });

                var anyTranslations = Object.keys(translations).length > 0;
                if (anyTranslations) {
                    renderFunction(translations);
                } else {
                    renderFunction({ text: 'no translation for "' + nlsKey + '"' });
                }
            })['catch'](function () {
                renderFunction({ text: 'can\'t obtain dictionary "' + dictionaryName + '"' });
            });
        }
    }
});
//# sourceMappingURL=nls-controller.js.map
