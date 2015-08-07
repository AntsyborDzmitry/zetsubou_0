package com.epam.kiryl.lutsyk.jcr;

import com.epam.kiryl.lutsyk.jcr.bean.Entity;
import com.epam.kiryl.lutsyk.jcr.dao.JcrDao;
import com.epam.kiryl.lutsyk.jcr.dao.JcrDaoImpl;
import com.epam.kiryl.lutsyk.jcr.exception.DaoException;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.core.TransientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.io.File;
import java.util.Arrays;
import java.util.Date;
import java.util.Random;

public class Main {
    private static final Logger LOG = LoggerFactory.getLogger(Main.class);
    private static final String REP_DEFAULT_DIRECTORY = "C:/jcr_dir";
    private static final String REP_WORKSPACE = "aem-training";
    private static final String DIR_SEPARATOR = "/";
    private static final String TABULATION = "\t";
    private static final String[] REP_DEFAULT_DIRECTORIES = {"content", JcrDao.DEFAULT_PATH};
    private static final Credentials REP_CREDENTIALS = new SimpleCredentials("admin","admin".toCharArray());
    // CQ 5.3 instance
    private static final String AEM_REPOSITORY = "http://localhost:4504/crx/server";

    private static Session session = null;
    private static Repository repository;
    private static Random random = new Random();


    public static void main(String[] args)  {
//        repository = new TransientRepository(getRepositoryDir());

        try{
            repository = JcrUtils.getRepository(AEM_REPOSITORY);
            session = repository.login(REP_CREDENTIALS);
            fillWorkspace();
//            initWorkspace();
            Node node = session.getRootNode();

            JcrDao dao = new JcrDaoImpl();

            // crud operations
            crud(dao);

            // print nodes
            printNodes(node);

        } catch (RepositoryException e) {
            LOG.error(e.getMessage(), e);
        } finally {
            if (session != null && session.isLive()) session.logout();
        }
    }

    private static int getRandom() {
        return random.nextInt(10) + 1;
    }

    private static File getRepositoryDir(){
        File file = new File(REP_DEFAULT_DIRECTORY);
        
        if (!file.exists()) file.mkdir();
        
        return file;
    }

    private static void fillWorkspace() throws RepositoryException {
        Node node = session.getRootNode();
        for(String path : REP_DEFAULT_DIRECTORIES) {
            if(!node.hasNode(path)) {
                node.addNode(path);
            }
        }
        session.save();
    }

    private static void initWorkspace() throws RepositoryException {
        try {
            session = repository.login(REP_CREDENTIALS, REP_WORKSPACE);
        } catch (RepositoryException e) {
            session = repository.login(REP_CREDENTIALS);

            Workspace workspace = session.getWorkspace();
            String[] names = workspace.getAccessibleWorkspaceNames();
            if(!Arrays.asList(names).contains(REP_WORKSPACE)) {
                workspace.createWorkspace(REP_WORKSPACE);
            }
            session.logout();

            session = repository.login(REP_CREDENTIALS, REP_WORKSPACE);
        }
        fillWorkspace();
    }

    private static void crud(JcrDao dao) {
        Entity entity = new Entity();
        entity.setName("" + getRandom());
        entity.setCount(getRandom());
        entity.setDate(new Date());

        try {
            dao.add(entity, session);
        } catch (DaoException e) {
            LOG.error(e.getMessage(), e);
        }

        try {
            Entity e = new Entity();
            e.setCount(getRandom());
            e.setName("" + getRandom());
            e.setDate(new Date());
            dao.update(entity, session);
        } catch (DaoException e) {
            LOG.error(e.getMessage(), e);
        }

        try {
            String num = "" + getRandom();
            dao.remove(num, session);
            LOG.error(num + " was removed");
        } catch (DaoException e) {
            LOG.error(e.getMessage(), e);
        }

        try {
            Entity e = dao.get("" + getRandom(), session);
            if(e != null) {
                LOG.info(e.getName());
            }
        } catch (DaoException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    public static void printNodes(Node root) throws RepositoryException {
        NodeIterator iterator = root.getNodes();
        String[] path = root.getPath().split(DIR_SEPARATOR);
        StringBuilder sb = new StringBuilder();
        // inner path was shifted
        if(path.length > 0) {
            for(int i = 0; i < path.length; i++) {
                sb.append(TABULATION);
            }
            sb.append(DIR_SEPARATOR);
            sb.append(path[path.length - 1]);
        } else {
            sb.append(DIR_SEPARATOR);
        }
        LOG.info(sb.toString());
//        System.out.println(sb.toString());
        while(iterator.hasNext()) {
            printNodes(iterator.nextNode());
        }
    }
}
