package com.zetsubou_0.testdemo.impl3;

import com.zetsubou_0.testdemo.api.PersonService;
import com.zetsubou_0.testdemo.bean.Person;
import com.zetsubou_0.testdemo.constants.PesrsonConstants;
import com.zetsubou_0.testdemo.exception.PersonNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
@Component
@Service(PersonService.class)
public class PersonServiceImpl implements PersonService {
    private static final String DELIMITER = "/";

    @Reference
    private ResourceResolver resourceResolver;

    @Override
    public List<Person> findPerson(final String firsName, final String lastName) throws PersonNotFoundException {
        if (StringUtils.isBlank(firsName) || StringUtils.isBlank(lastName)) {
            throw new PersonNotFoundException("Please check first or last name");
        }
        List<Person> persons = new ArrayList<>();
        Resource personStore = resourceResolver.getResource(buildPath(firsName, lastName));
        Iterator<Resource> personIterator = personStore.getChildren().iterator();
        while (personIterator.hasNext()) {
            Resource personResource = personIterator.next();
            Person person = personResource.adaptTo(Person.class);
            if (person != null) {
                persons.add(person);
            }
        }
        return persons;
    }

    @Override
    public void findAndAddPerson(final List<Person> persons, final String firsName, final String lastName) throws PersonNotFoundException {
        if (StringUtils.isBlank(firsName) || StringUtils.isBlank(lastName)) {
            throw new PersonNotFoundException("Please check first or last name");
        }
        Resource personStore = resourceResolver.getResource(buildPath(firsName, lastName));
        Iterator<Resource> personIterator = personStore.getChildren().iterator();
        while (personIterator.hasNext()) {
            Resource personResource = personIterator.next();
            Person person = personResource.adaptTo(Person.class);
            if (person != null) {
                persons.add(person);
            }
        }
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
