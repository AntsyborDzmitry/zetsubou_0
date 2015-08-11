package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.bean.Seiyuu;
import com.zetsubou_0.animelist.anime.constant.JcrConstant;
import com.zetsubou_0.animelist.anime.exception.JobException;
import org.apache.jackrabbit.ocm.manager.ObjectContentManager;
import org.apache.jackrabbit.ocm.manager.impl.ObjectContentManagerImpl;
import org.apache.jackrabbit.ocm.mapper.Mapper;
import org.apache.jackrabbit.ocm.mapper.impl.annotation.AnnotationMapperImpl;
import org.apache.jackrabbit.rmi.repository.URLRemoteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by zetsubou_0 on 19.07.15.
 */
public class WriteJcrJob extends AbstractJob {
    private static Logger LOG = LoggerFactory.getLogger(WriteJcrJob.class);

    private Session session;
    private ObjectContentManager ocm;

    @Override
    public void action() throws JobException {
        try {
            init();

            Anime anime = new Anime();
            Set<String> titles = new HashSet<>();
            titles.add("gto");
            titles.add("Greate Teacher Onizuka");
            anime.setJcrPath(String.format(JcrConstant.Store.ANIME_PATH, "GTO"));
            anime.setTitles(titles);
            saveAnime(anime);
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }

    private void saveAnime(Anime anime) throws RepositoryException {
        if(!session.nodeExists(anime.getJcrPath())) {
            ocm.insert(anime);
        } else {
            ocm.update(anime);
        }
        ocm.save();
    }

    private void init() throws MalformedURLException, RepositoryException {
        jcrConnect();
        objectContentManagerInit();
        checkFolders();
    }

    private void jcrConnect() throws MalformedURLException, RepositoryException {
        Repository repository = new URLRemoteRepository(JcrConstant.Repository.LOCAL_REPOSYTORY_HTTP);
        session = repository.login(new SimpleCredentials(JcrConstant.Repository.DEFAULT_USER, JcrConstant.Repository.DEFAULT_PASSWORD));
        if(session != null) {
            Workspace workspace = session.getWorkspace();
            String workspaceName = workspace.getName();
            if(!JcrConstant.Store.WORKSPACE.equals(workspaceName)) {
                try {
                    workspace.createWorkspace(JcrConstant.Store.WORKSPACE);
                } catch(Exception e) {}
                session.logout();
                session = repository.login(new SimpleCredentials(JcrConstant.Repository.DEFAULT_USER, JcrConstant.Repository.DEFAULT_PASSWORD), JcrConstant.Store.WORKSPACE);
            }
        }
    }

    private void objectContentManagerInit() {
        List classes = new ArrayList();
        classes.add(Anime.class);
        classes.add(Seiyuu.class);
        Mapper mapper = new AnnotationMapperImpl(classes);
        ocm = new ObjectContentManagerImpl(session, mapper);
    }

    private void checkFolders() throws RepositoryException {
        Node root = session.getRootNode();
        if(!root.hasNode(JcrConstant.Store.ANIME_FOLDER)) {
            root.addNode(JcrConstant.Store.ANIME_FOLDER);
        }
        if(!root.hasNode(JcrConstant.Store.SEIYUU_FOLDER)) {
            root.addNode(JcrConstant.Store.SEIYUU_FOLDER);
        }
        session.save();
    }
}
