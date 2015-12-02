package com.zetsubou_0.testdemo.impl3;

import com.zetsubou_0.testdemo.api.PersonService;
import com.zetsubou_0.testdemo.bean.Person;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class PersonServiceImpl implements PersonService {
    private final ResourceResolver resourceResolver;

    public PersonServiceImpl(final ResourceResolver resourceResolver) {
        this.resourceResolver = resourceResolver;
    }

    @Override
    public List<Person> findPerson(final String firsName, final String lastName) {
        return null;
    }
}
