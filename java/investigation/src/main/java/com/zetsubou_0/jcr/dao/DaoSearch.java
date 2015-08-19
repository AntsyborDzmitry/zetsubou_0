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
    public static final String START_QUERY = "/jcr:root/content/store//element(*, jte:testEntity) [jcr:like(@name, '%s%%')]";
    public static final String DATE_QUERY = "/jcr:root/content/store//element(*, jte:testEntity) [(@date >= xs:dateTime('%s') and @date <= xs:dateTime('%s'))]";
    public static final String START_QUERY_SQL2 = "SELECT * FROM [jte:testEntity] WHERE [name] LIKE '%s%%'";
    public static final String DATE_QUERY_SQL2 = "SELECT p.* FROM [jte:testEntity] AS p WHERE [p.date] >= CAST('%s' AS DATE) and [p.date] <= CAST('%s' AS DATE)";

    Set<Entity> startWith(String query, Session session) throws DaoException;
    Set<Entity> betweenDate(Date start, Date end, Session session) throws DaoException;
}
