package com.zetsubou_0.testdemo.impl3;

import com.zetsubou_0.testdemo.api.PersonService;
import com.zetsubou_0.testdemo.bean.Person;
import com.zetsubou_0.testdemo.constants.PesrsonConstants;
import com.zetsubou_0.testdemo.exception.PersonNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class PersonServiceTest {
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";
    private static final String DELIMITER = "/";
    private static int AGE_1 = 20;
    private static int AGE_2 = 35;

    @InjectMocks
    private PersonService sut = new PersonServiceImpl();
    @Mock
    private ResourceResolver resourceResolver;
    private Iterator<Resource> childrenIterator;
    private Resource personResource1;
    private Resource personResource2;
    private Person person1;
    private Person person2;

    @Before
    public void setupGeneralBehavior() {
        MockitoAnnotations.initMocks(this);

        personResource1 = mock(Resource.class);
        person1 = new Person(FIRST_NAME, LAST_NAME);
        person1.setAge(AGE_1);
        when(personResource1.adaptTo(Person.class)).thenReturn(person1);

        personResource2 = mock(Resource.class);
        person2 = new Person(FIRST_NAME, LAST_NAME);
        person2.setAge(AGE_2);
        when(personResource2.adaptTo(Person.class)).thenReturn(person2);

        Resource personParentResource = mock(Resource.class);
        Iterable<Resource> iterable = mock(Iterable.class);
        childrenIterator = mock(Iterator.class);
        when(iterable.iterator()).thenReturn(childrenIterator);

        when(resourceResolver.getResource(buildPath(FIRST_NAME, LAST_NAME))).thenReturn(personParentResource);
        when(personParentResource.getChildren()).thenReturn(iterable);
    }

    @Test(expected = PersonNotFoundException.class)
    public void shouldThrowPersonNotFoundException() throws PersonNotFoundException {
        sut.findPerson(StringUtils.EMPTY, StringUtils.EMPTY);
    }

    @Test(expected = PersonNotFoundException.class)
    public void shouldThrowPersonNotFoundException2() throws PersonNotFoundException {
        sut.findAndAddPerson(new ArrayList<Person>(), StringUtils.EMPTY, StringUtils.EMPTY);
    }


    @Test
    public void shouldFindPerson() throws PersonNotFoundException {
        when(childrenIterator.hasNext()).thenReturn(true, false);
        when(childrenIterator.next()).thenReturn(personResource1);

        List<Person> persons = sut.findPerson(FIRST_NAME, LAST_NAME);
        assertEquals(1, persons.size());
        Person person = persons.get(0);
        assertEquals("Unexpected person", person1, person);
    }

    @Test
    public void shouldFindPersons() throws PersonNotFoundException {
        when(childrenIterator.hasNext()).thenReturn(true, true, false);
        when(childrenIterator.next()).thenReturn(personResource1, personResource2);

        List<Person> persons = sut.findPerson(FIRST_NAME, LAST_NAME);
        assertEquals(2, persons.size());
        Person person_1 = persons.get(0);
        Person person_2 = persons.get(1);
        assertEquals("Unexpected person", person1, person_1);
        assertEquals("Unexpected person", person2, person_2);
    }

    @Test
    public void shouldFindAndAddPerson() throws PersonNotFoundException {
        when(childrenIterator.hasNext()).thenReturn(true, false);
        when(childrenIterator.next()).thenReturn(personResource1);

        List<Person> persons = spy(new ArrayList<Person>());
        sut.findAndAddPerson(persons, FIRST_NAME, LAST_NAME);
        verify(persons, times(1)).add(any(Person.class));

        Person person = persons.get(0);
        assertEquals("Unexpected person", person1, person);
    }

    @Test
    public void shouldFindAndAddPersons() throws PersonNotFoundException {
        when(childrenIterator.hasNext()).thenReturn(true, true, false);
        when(childrenIterator.next()).thenReturn(personResource1, personResource2);

        List<Person> persons = spy(new ArrayList<Person>());
        sut.findAndAddPerson(persons, FIRST_NAME, LAST_NAME);
        verify(persons, times(2)).add(any(Person.class));

        Person person_1 = persons.get(0);
        Person person_2 = persons.get(1);
        assertEquals("Unexpected person", person1, person_1);
        assertEquals("Unexpected person", person2, person_2);
    }

    private String buildPath(final String firstName, final  String lastName) {
        return new StringBuilder()
                .append(PesrsonConstants.BASE_PATH)
                .append(DELIMITER)
                .append(firstName)
                .append(DELIMITER)
                .append(lastName)
                .toString();
    }
}
