import ContactMailingListsController from './contact-mailing-lists-controller';
import ContactMailingListsService from './contact-mailing-lists-service';
import AttrsService from '../../../../services/attrs-service';
import 'angularMocks';

describe('#ContactMailingListsController', () => {
    let sut, contactMailingListsControllerMock, $q, attrsServiceMock, scopeMock, attrsMock = {someAttrs: 'test'};

    beforeEach(inject((_$q_) => {
        scopeMock = {mailingLists: {selectedMailingLists: []}};

        $q = _$q_;
        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        contactMailingListsControllerMock = jasmine.mockComponent(new ContactMailingListsService());
        contactMailingListsControllerMock.getTypeaheadMailingLists.and.returnValue($q.defer().promise);

        sut = new ContactMailingListsController(
            scopeMock, attrsMock, attrsServiceMock, contactMailingListsControllerMock);

        sut.mailingLists = [];
    }));

    it('should track "mailingLists" attribute', () => {
       expect(attrsServiceMock.track).toHaveBeenCalledWith(scopeMock, attrsMock, 'mailingLists', sut);
    });

    it('should add item to mailing lists', () => {
        const listLength = sut.mailingLists.length;
        sut.addNewListItem();
        expect(sut.mailingLists.length).toBe(listLength + 1);
        expect(attrsServiceMock.track).toHaveBeenCalled();
    });

    it('should remove item from mailing lists', () => {
        const listLength = sut.mailingLists.length;
        sut.addNewListItem();
        sut.removeListItem(listLength);
        expect(sut.mailingLists.length).toBe(listLength);
        expect(attrsServiceMock.track).toHaveBeenCalled();
    });
});
