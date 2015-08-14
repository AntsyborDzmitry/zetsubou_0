package com.zetsubou_0.jcr.dao;

import com.zetsubou_0.jcr.bean.Entity;
import com.zetsubou_0.jcr.exception.DaoException;
import org.apache.commons.lang3.StringUtils;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Calendar;

/**
 * Created by Kiryl_Lutsyk on 8/7/2015.
 */
public class JcrDaoImpl implements JcrDao {
    public static final String COUNT = "count";
    public static final String DATE = "date";

    @Override
    public void add(Entity entity, Session session) throws DaoException {
        try {
            Node store = getStore(session.getRootNode());
            if(StringUtils.isBlank(entity.getName()) || store.hasNode(entity.getName())) {
                throw new DaoException("Add exception. " + entity.getName() + " present in repository");
            } else {
                Node added = store.addNode(entity.getName());
                added.setProperty(COUNT, entity.getCount());
                Calendar date = Calendar.getInstance();
                date.setTime(entity.getDate());
                added.setProperty(DATE, date);
                session.save();
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
    }

    @Override
    public void update(Entity entity, Session session) throws DaoException {
        try {
            Node store = getStore(session.getRootNode());
            if(StringUtils.isBlank(entity.getName()) || !store.hasNode(entity.getName())) {
                throw new DaoException("Update exception. " + entity.getName() + " doesn't present in repository");
            } else {
                Node updated = store.getNode(entity.getName());
                updated.setProperty(COUNT, entity.getCount());
                Calendar date = Calendar.getInstance();
                date.setTime(entity.getDate());
                updated.setProperty(DATE, date);
                session.save();
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
    }

    @Override
    public Entity get(String name, Session session) throws DaoException {
        Entity entity = null;
        try {
            Node store = getStore(session.getRootNode());
            if(StringUtils.isBlank(name) || !store.hasNode(name)) {
                throw new DaoException("Get exception. " + name + " doesn't present in repository");
            } else {
                Node found = store.getNode(name);
                if(found == null) {
                    return entity;
                }
                entity = new Entity();
                entity.setName(name);
                Property count = found.getProperty(COUNT);
                if(count != null) {
                    entity.setCount((int) count.getLong());
                }
                Property date = found.getProperty(COUNT);
                if(date != null) {
                    entity.setDate(date.getDate().getTime());
                }
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
        return entity;
    }

    @Override
    public void remove(String name, Session session) throws DaoException {
        try {
            Node store = getStore(session.getRootNode());
            if(StringUtils.isBlank(name) || !store.hasNode(name)) {
                throw new DaoException("Remove exception. " + name + " doesn't present in repository");
            } else {
                Node removed = store.getNode(name);
                removed.remove();
            }
            session.save();
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
    }

    private Node getStore(Node root) throws DaoException {
        try {
            if(root.hasNode(DEFAULT_PATH)) {
                return root.getNode(DEFAULT_PATH);
            } else {
                throw new DaoException(DEFAULT_PATH + " not found.");
            }
        } catch (RepositoryException e) {
            throw new DaoException(e);
        }
    }
}
