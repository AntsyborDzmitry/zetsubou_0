import './../../services/nls-service';

NLSController.$inject = ['$q', 'nlsService'];

export default function NLSController($q, nlsService) {
    const vm = this;

    vm.setRenderFunction = setRenderFunction;
    vm.translate = translate;

    let renderFunction;

    function setRenderFunction(newRenderFunction) {
        renderFunction = newRenderFunction;
    }

    /**
     * @param {String} nlsKey key in form 'dictionaryName.key'
     */
    function translate(nlsKey) {
        if (!nlsService.isValidKey(nlsKey)) {
            renderFunction({text: 'wrong format "' + nlsKey + '"'});
            return;
        }

        let [dictionaryName, key] = nlsKey.split('.');

        nlsService.getDictionary(dictionaryName)
            .then(function(dictionary) {
                const translations = {};

                const text = dictionary[key];
                if (text) {
                    translations.text = text;
                }

                key += '.';
                const keyLength = key.length;
                Object.keys(dictionary).forEach((theKey) => {
                    if (theKey.substr(0, keyLength) === key) {
                        const attrName = theKey.substr(keyLength);
                        translations[attrName] = dictionary[theKey];
                    }
                });

                const anyTranslations = Object.keys(translations).length > 0;
                if (anyTranslations) {
                    renderFunction(translations);
                } else {
                    renderFunction({text: 'no translation for "' + nlsKey + '"'});
                }
            })
            .catch(function() {
                renderFunction({text: 'can\'t obtain dictionary "' + dictionaryName + '"'});
            });
    }
}
