package com.zetsubou_0.testdemo.api;

import com.zetsubou_0.testdemo.bean.Person;
import com.zetsubou_0.testdemo.exception.PersonNotFoundException;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public interface PersonService {
    List<Person> findPerson(String firsName, String lastName) throws PersonNotFoundException;
    void findAndAddPerson(List<Person> persons, String firsName, String lastName) throws PersonNotFoundException;
}
