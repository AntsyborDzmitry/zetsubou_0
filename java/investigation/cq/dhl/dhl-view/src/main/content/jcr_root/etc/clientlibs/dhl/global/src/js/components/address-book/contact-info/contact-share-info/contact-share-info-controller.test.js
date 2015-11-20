import ContactShareInfoController from './contact-share-info-controller';
import AttrsService from '../../../../services/attrs-service';

import 'angularMocks';

describe('#ContactShareInfoController', () => {
    let sut, attrsServiceMock, scopeMock, attrsMock = {someAttrs: 'test'};

    beforeEach(() => {
        scopeMock = {mailingLists: {selectedMailingLists: []}};
        attrsServiceMock = jasmine.mockComponent(new AttrsService());

        sut = new ContactShareInfoController(scopeMock, attrsMock, attrsServiceMock);
    });

    it('should track "shareSettings" attribute', () => {
        expect(attrsServiceMock.track).toHaveBeenCalledWith(scopeMock, attrsMock, 'shareSettings', sut);
    });

});
