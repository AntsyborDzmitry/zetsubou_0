package com.zetsubou_0.jcr.dao;

import com.zetsubou_0.jcr.bean.Entity;
import com.zetsubou_0.jcr.exception.DaoException;

import javax.jcr.Session;
import java.util.Date;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 8/17/2015.
 */
public interface DaoSearch {
    public static final String START_QUERY = "/jcr:root/content/store//* [jcr:like(@name, '%s%%')]";
    public static final String DATE_QUERY = "/jcr:root/content/store//* [@date >= xs:dateTime('%s') and @date <= xs:dateTime('%s')]";

    Set<Entity> startWith(String query, Session session) throws DaoException;
    Set<Entity> betweenDate(Date start, Date end, Session session) throws DaoException;
}
