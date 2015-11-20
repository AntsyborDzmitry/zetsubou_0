export default class BaseValidator {
    constructor(options = {}) {
        this.setOptions(options);
    }

    getMessage() {
        return this.options.msg || this.msg || '';
    }

    setMessage(msg) {
        this.msg = msg || '';
    }

    setCSSClass(cssClass) {
        this.cssClass = cssClass;
    }

    getCSSClass() {
        return this.cssClass || '';
    }

    setOptions(options) {
        this.options = options;
    }

    getOptions() {
        return this.options;
    }

    validate() {
        throw new Error('BaseValidator#validate should be implemented in child.');
    }
}
