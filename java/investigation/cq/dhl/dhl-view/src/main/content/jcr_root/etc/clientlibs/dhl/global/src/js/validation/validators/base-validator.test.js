import 'angularMocks';
import BaseValidator from './base-validator';

describe('BaseValidator', () => {
    let sut;
    const message = 'some_message';

    beforeEach(() => {
        sut = new BaseValidator();
    });

    describe('#constructor', () => {
        it('should define public interface', () => {
            expect(sut.setMessage).toEqual(jasmine.any(Function));
            expect(sut.getMessage).toEqual(jasmine.any(Function));
            expect(sut.setCSSClass).toEqual(jasmine.any(Function));
            expect(sut.getCSSClass).toEqual(jasmine.any(Function));
            expect(sut.setOptions).toEqual(jasmine.any(Function));
            expect(sut.getOptions).toEqual(jasmine.any(Function));
            expect(sut.validate).toEqual(jasmine.any(Function));
        });

        it('should call setOptions', () => {
            const options = {};
            spyOn(BaseValidator.prototype, 'setOptions');

            const validator = new BaseValidator(options);

            expect(validator.setOptions).toHaveBeenCalledWith(options);
        });
    });

    describe('#validate', () => {
        it('should throw an exception if wasn`t implemented in child', () => {
            const callValidate = () => sut.validate();

            expect(callValidate).toThrow(new Error('BaseValidator#validate should be implemented in child.'));
        });
    });

    describe('#setMessage', () => {
        it('should set msg to validator', () => {
            sut.setMessage(message);

            expect(sut.msg).toBe(message);
        });
    });

    describe('#getMessage', () => {
        it('should retrieve msg set to validator', () => {
            sut.msg = message;

            expect(sut.getMessage()).toBe(message);
        });

        it('should return empty string if msg was not set to validator', () => {
            expect(sut.getMessage()).toBe('');
        });

        it('should return msg from options if options have msg property', () => {
            const msg = 'message_from_options';
            sut.options = {
                msg
            };
            expect(sut.getMessage()).toBe(msg);
        });
    });

    describe('#setCSSClass', () => {
        it('should set cssClass to validator', () => {
            const cls = 'some_css_class';

            sut.setCSSClass(cls);

            expect(sut.cssClass).toBe(cls);
        });

        it('should return empty string if cssClass was not set to validator', () => {
            expect(sut.getMessage()).toBe('');
        });
    });

    describe('#getCSSClass', () => {
        it('should retrieve', () => {
            const cls = 'some_css_class';

            sut.setCSSClass(cls);

            expect(sut.cssClass).toBe(cls);
        });
    });

    describe('#setOptions', () => {
        it('should set options to validator', () => {
            const options = {};

            sut.setOptions(options);

            expect(sut.options).toBe(options);
        });
    });


    describe('#getOptions', () => {
        it('should retrieve options from validator', () => {
            const options = {};
            sut.options = options;

            expect(sut.getOptions()).toBe(options);
        });
    });
});
