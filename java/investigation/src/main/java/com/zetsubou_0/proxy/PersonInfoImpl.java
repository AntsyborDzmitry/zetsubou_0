package com.zetsubou_0.proxy;

import com.zetsubou_0.proxy.api.PersonInfo;
import com.zetsubou_0.proxy.bean.Person;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class PersonInfoImpl<T extends Person> implements PersonInfo<T> {
    private final T person;

    public PersonInfoImpl(T person) {
        this.person = person;
    }

    @Override
    public String getInfo() {
        return person.getName() + " - " + person.getAge();
    }
}
