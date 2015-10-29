package com.zetsubou_0.proxy.api;

import com.zetsubou_0.proxy.bean.Person;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public interface PersonInfo<T extends Person> {
    String getInfo();
}
