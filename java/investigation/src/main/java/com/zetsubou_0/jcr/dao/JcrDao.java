package com.zetsubou_0.jcr.dao;

import com.zetsubou_0.jcr.bean.Entity;
import com.zetsubou_0.jcr.exception.DaoException;

import javax.jcr.Session;

/**
 * Created by Kiryl_Lutsyk on 8/7/2015.
 */
public interface JcrDao extends DaoSearch {
    public static final String DEFAULT_PATH = "content/store";

    void add(Entity entity, Session session) throws DaoException;
    void update(Entity entity, Session session) throws DaoException;
    Entity get(String name, Session session) throws DaoException;
    void remove(String name, Session session) throws DaoException;
}
