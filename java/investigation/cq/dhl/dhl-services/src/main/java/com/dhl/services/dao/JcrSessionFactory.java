package com.dhl.services.dao;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.jcr.api.SlingRepository;

@Service(JcrSessionFactory.class)
@Component(immediate = true, metatype = false, label = "Jcr Session Factory")
public class JcrSessionFactory {

    private ThreadLocal<Session> currentSession = new ThreadLocal<Session>();

    @Reference
    protected SlingRepository repository;

    public Session getCurrentSession() throws RepositoryException {
        Session session = currentSession.get();
        if (session == null) {
            session = repository.loginAdministrative(null);
            currentSession.set(session);
        }
        return session;
    }

    public void closeCurrentSession() {
        Session session = currentSession.get();
        if (session != null) {
            session.logout();
            currentSession.remove();
        }
    }
}

