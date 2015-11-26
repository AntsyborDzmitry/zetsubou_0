package com.dhl.services.mock;

import com.dhl.services.dao.SlingDao;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

import static org.mockito.Mockito.*;

public class JcrMocks {
    public static Node mockNode(String name) throws RepositoryException {
        Node node = Mockito.mock(Node.class);
        when(node.getName()).thenReturn(name);
        when(node.hasNode(anyString())).thenReturn(true);
        when(node.getNode(SlingDao.CONTENT)).thenReturn(node);
        return node;
    }

    private static void mockProperty(Node node, String key, String val) throws RepositoryException {
        Value value = Mockito.mock(Value.class);
        when(value.getString()).thenReturn(val);
        Property property = Mockito.mock(Property.class);
        when(property.getValue()).thenReturn(value);
        when(node.getProperty(key)).thenReturn(property);
    }

    public static Node mockLangNode(String name, String lang) throws RepositoryException {
        Node node = mockNode(name);

        mockProperty(node, "langName", lang);
        mockProperty(node, SlingDao.SLING_MESSAGE_PROPERTY_KEY, lang);

        return node;
    }

    public static SlingDao mockDao() {
        SlingDao dao = Mockito.mock(SlingDao.class);

        try {
            when(dao.getNodeProperty((Node)anyObject(), anyString())).then(new Answer<String>() {
                @Override
                public String answer(InvocationOnMock invocation) throws Throwable {
                    Object[] args = invocation.getArguments();
                    Node node = (Node)args[0];
                    String key = (String)args[1];
                    return node.getProperty(key).getValue().getString();
                }
            });
        } catch (RepositoryException e) {
            throw new RuntimeException(e);
        }

        return dao;
    }
}
