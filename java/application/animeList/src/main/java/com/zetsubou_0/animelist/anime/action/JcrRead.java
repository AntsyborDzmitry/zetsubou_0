package com.zetsubou_0.animelist.anime.action;

import com.zetsubou_0.animelist.anime.constant.JcrConstant;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import org.apache.jackrabbit.rmi.repository.RMIRemoteRepository;
import org.apache.jackrabbit.rmi.repository.URLRemoteRepository;

import javax.jcr.*;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zetsubou_0 on 04.05.15.
 */
public class JcrRead extends AbstractAction {

    public JcrRead() {
    }

    public JcrRead(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        try {
            Repository repositoryHttp = new URLRemoteRepository(JcrConstant.LOCAL_REPOSYTORY_HTTP);
            Credentials credentials = new SimpleCredentials("admin", "admin".toCharArray());
            Session session = repositoryHttp.login(credentials, "default");

            Node root = session.getRootNode();

//            Node test = root.addNode("test", "nt:unstructured");
//            session.save();

            NodeIterator iterator = root.getNodes();
            while(iterator.hasNext()) {
                Node node = iterator.nextNode();
                System.out.println(node.getPath());
            }

        } catch (RepositoryException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }
}
