package com.zetsubou_0.jcr.dao;

import com.zetsubou_0.jcr.bean.Entity;
import com.zetsubou_0.jcr.exception.DaoException;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 8/19/2015.
 */
public class JcrSqlDaoImpl extends JcrDaoImpl {
    @Override
    public Set<Entity> startWith(String query, Session session) throws DaoException {
        Set<Entity> set = new HashSet<Entity>();
        try {
            NodeIterator iterator = executeSql2Query(String.format(START_QUERY_SQL2, query), session);
            while (iterator.hasNext()) {
                Node currentNode = iterator.nextNode();
                Entity entity = new Entity();
                Property property = null;
                if(currentNode.hasProperty(NAME)) {
                    property = currentNode.getProperty(NAME);
                    if(property != null) {
                        entity.setName(property.getString());
                    }
                }
                if(currentNode.hasProperty(DATE)) {
                    property = currentNode.getProperty(DATE);
                    if(property != null) {
                        entity.setDate(property.getDate().getTime());
                    }
                }
                if(currentNode.hasProperty(COUNT)) {
                    property = currentNode.getProperty(COUNT);
                    if(property != null) {
                        entity.setCount((int) property.getLong());
                    }
                }
                set.add(entity);
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
        return set;
    }

    @Override
    public Set<Entity> betweenDate(Date start, Date end, Session session) throws DaoException {
        Set<Entity> set = new HashSet<Entity>();
        try {
            NodeIterator iterator = executeSql2Query(String.format(DATE_QUERY_SQL2, getJcrDate(start), getJcrDate(end)), session);
            while (iterator.hasNext()) {
                Node currentNode = iterator.nextNode();
                Entity entity = new Entity();
                Property property = null;
                if(currentNode.hasProperty(NAME)) {
                    property = currentNode.getProperty(NAME);
                    if(property != null) {
                        entity.setName(property.getString());
                    }
                }
                if(currentNode.hasProperty(DATE)) {
                    property = currentNode.getProperty(DATE);
                    if(property != null) {
                        entity.setDate(property.getDate().getTime());
                    }
                }
                if(currentNode.hasProperty(COUNT)) {
                    property = currentNode.getProperty(COUNT);
                    if(property != null) {
                        entity.setCount((int) property.getLong());
                    }
                }
                set.add(entity);
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
        return set;
    }

    private NodeIterator executeSql2Query(String queryString, Session session) throws RepositoryException {
        QueryManager qm = session.getWorkspace().getQueryManager();
        Query query = qm.createQuery(queryString, Query.JCR_SQL2);
        QueryResult results = query.execute();
        return results.getNodes();
    }
}
