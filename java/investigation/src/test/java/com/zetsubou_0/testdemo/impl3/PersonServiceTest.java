package com.zetsubou_0.testdemo.impl3;

import com.zetsubou_0.testdemo.api.PersonService;
import com.zetsubou_0.testdemo.bean.Person;
import com.zetsubou_0.testdemo.exception.PersonNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.mockito.Mockito.*;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class PersonServiceTest {
    private static final String BASE_PATH = "/persons/";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";
    private static final String DELIMITER = "/";
    private static int AGE_1 = 20;
    private static int AGE_2 = 35;

    @Mock
    private ResourceResolver resourceResolver;
    @Mock
    private Resource personResource1;
    @Mock
    private Resource personResource2;
    private PersonService sut;
    private Person person1;
    private Person person2;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        sut = new PersonServiceImpl(resourceResolver);

        person1 = new Person(FIRST_NAME, LAST_NAME);
        person1.setAge(AGE_1);
        when(personResource1.adaptTo(Person.class)).thenReturn(person1);

        person2 = new Person(FIRST_NAME, LAST_NAME);
        person2.setAge(AGE_2);
        when(personResource2.adaptTo(Person.class)).thenReturn(person2);
    }

    @Test(expected = PersonNotFoundException.class)
    public void shouldThrowPersonNotFoundException() throws PersonNotFoundException {
        sut.findPerson(StringUtils.EMPTY, StringUtils.EMPTY);
    }

    @Test
    public void shouldFindPerson() throws PersonNotFoundException {
        List<Person> result = sut.findPerson(FIRST_NAME, LAST_NAME);
    }

    @Test
    public void shouldFindPersons() throws PersonNotFoundException {
        List<Person> persons = sut.findPerson(FIRST_NAME, LAST_NAME);
    }

    @Test
    public void shouldFindAndAddPerson() throws PersonNotFoundException {
        List<Person> persons = sut.findPerson(FIRST_NAME, LAST_NAME);
    }

    @Test
    public void shouldFindAndAddPersons() throws PersonNotFoundException {
        List<Person> persons = sut.findPerson(FIRST_NAME, LAST_NAME);
    }

    private String buildPath(String firstName, String lastName) {
        return new StringBuilder()
                .append(BASE_PATH)
                .append(DELIMITER)
                .append(firstName)
                .append(DELIMITER)
                .append(lastName)
                .toString();
    }
}
