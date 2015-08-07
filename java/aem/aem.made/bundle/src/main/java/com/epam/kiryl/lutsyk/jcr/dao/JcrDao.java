package com.epam.kiryl.lutsyk.jcr.dao;

import com.epam.kiryl.lutsyk.jcr.bean.Entity;
import com.epam.kiryl.lutsyk.jcr.exception.DaoException;

import javax.jcr.Session;

/**
 * Created by Kiryl_Lutsyk on 8/7/2015.
 */
public interface JcrDao {
    public static final String DEFAULT_PATH = "content/store";

    void add(Entity entity, Session session) throws DaoException;
    void update(Entity entity, Session session) throws DaoException;
    Entity get(String name, Session session) throws DaoException;
    void remove(String name, Session session) throws DaoException;
}
