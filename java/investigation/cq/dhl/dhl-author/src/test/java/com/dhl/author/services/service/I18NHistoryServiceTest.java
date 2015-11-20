package com.dhl.author.services.service;

import com.day.cq.commons.jcr.JcrUtil;
import com.dhl.author.mock.I18NJcrMock;
import com.dhl.services.service.JcrProps;
import com.google.common.collect.ImmutableList;
import org.apache.sling.jcr.api.SlingRepository;
import org.apache.sling.testing.mock.jcr.MockJcr;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import javax.jcr.Credentials;
import javax.jcr.Node;
import javax.jcr.Session;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class I18NHistoryServiceTest {

    @Mock
    private SlingRepository repository;

    @InjectMocks
    private I18NHistoryService sut = new I18NHistoryServiceImpl();

    @Test
    public void shouldCreateDictionaryVersion() throws Exception {
        final String dictionaryPath = "/apps/dhl/i18n/en";
        final Credentials credentials = null;
        final Session session = spy(MockJcr.newRepository().login(credentials));

        session.getRootNode().addNode(dictionaryPath, "sling:Folder");
        session.getRootNode().addNode(JcrProps.VERSION_PATH.getValue(), "sling:Folder");
        Node enNodeMock = I18NJcrMock.mockDictionary();

        when(session.getNode(dictionaryPath)).thenReturn(enNodeMock);
        when(repository.loginAdministrative(null)).thenReturn(session);

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Node node = session.getNode(JcrProps.VERSION_PATH.getValue() + "/test-version");
                assertEquals("en", node.getProperty("jcr:language").getString());
                assertEquals("dhl", node.getProperty("sling:basename").getString());

                Node firstChildNode = node.getNode("first_message");
                assertEquals("first message", firstChildNode.getProperty("sling:message").getValue().getString());
                assertEquals("en", firstChildNode.getProperty(JcrProps.LANGUAGE.getValue()).getString());
                assertNull(firstChildNode.getProperty(JcrProps.JCR_LANGUAGE.getValue()).getValue());

                Node secondChildNode = node.getNode("second_message");
                assertEquals("second message", secondChildNode.getProperty("sling:message").getValue().getString());
                assertEquals("en", secondChildNode.getProperty(JcrProps.LANGUAGE.getValue()).getString());
                assertNull(secondChildNode.getProperty(JcrProps.JCR_LANGUAGE.getValue()).getValue());

                Node infoNode = node.getNode(JcrProps.VERSION_INFO.getValue());
                assertEquals(dictionaryPath, infoNode.getProperty(JcrProps.ORIGINAL_PATH.getValue()).getString());
                return null;
            }
        }).when(session).logout();

        Map<String, String> result = sut.makeDictionaryVersion(dictionaryPath, "test-version");
        assertEquals(JcrProps.OK.getValue(), result.get(JcrProps.STATUS.getValue()));
        verify(session, atLeastOnce()).save();
        verify(session, atLeastOnce()).logout();
    }

    @Test
    public void shouldDeleteDictionaryVersion() throws Exception {
        final String versionNodeName = "test-version";
        final Credentials credentials = null;
        final Session session = spy(MockJcr.newRepository().login(credentials));

        Node versionContainerNode = session.getRootNode().addNode(JcrProps.VERSION_PATH.getValue(), "sling:Folder");
        versionContainerNode.addNode(versionNodeName);

        assertNotNull(session.getNode(JcrProps.VERSION_PATH.getValue() + "/" + versionNodeName));

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Node containerNode = session.getNode(JcrProps.VERSION_PATH.getValue());
                assertFalse(containerNode.hasProperty(versionNodeName));
                return null;
            }
        }).when(session).logout();

        when(repository.loginAdministrative(null)).thenReturn(session);

        Map<String, String> result = sut.deleteDictionaryVersion(JcrProps.VERSION_PATH.getValue() + "/" + versionNodeName);
        assertEquals(JcrProps.OK.getValue(), result.get(JcrProps.STATUS.getValue()));
        verify(session, atLeastOnce()).save();
        verify(session, atLeastOnce()).logout();
    }

    @Test
    public void shouldRollbackDictionaryToVersion() throws Exception {
        final String dictionaryPath = "/apps/dhl/i18n/en";
        final String versionNodeName = "test-version";
        final Credentials credentials = null;
        final Session session = spy(MockJcr.newRepository().login(credentials));

        Node versionContainerNode = session.getRootNode().addNode(JcrProps.VERSION_PATH.getValue(), "sling:Folder");
        versionContainerNode.addNode(versionNodeName);

        session.getRootNode().addNode("/apps/dhl/i18n", "sling:Folder");
        session.getRootNode().addNode(dictionaryPath, "sling:Folder");
        Node versionNodeMock = I18NJcrMock.mockDictionaryVersion(dictionaryPath);
        when(versionNodeMock.getPath()).thenReturn(JcrProps.VERSION_PATH.getValue() + "/test-version");
        when(session.getNode(JcrProps.VERSION_PATH.getValue() + "/test-version")).thenReturn(versionNodeMock);

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Object[] args = invocation.getArguments();
                String srcPath = (String)args[0];
                String destPath = (String)args[1];
                String destName = destPath.substring(destPath.lastIndexOf("/") + 1);
                String destParent = destPath.substring(0, destPath.lastIndexOf("/"));
                JcrUtil.copy(session.getNode(srcPath), session.getNode(destParent), destName);
                return null;
            }
        }).when(session).move(anyString(), anyString());
        when(repository.loginAdministrative(null)).thenReturn(session);

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Node dictionary = session.getNode(dictionaryPath);
                assertNotNull(dictionary);
                assertFalse(dictionary.hasNode(JcrProps.VERSION_INFO.getValue()));

                Node firstChildNode = dictionary.getNode("first_message");
                assertEquals("first message", firstChildNode.getProperty("sling:message").getValue().getString());
                assertEquals("en", firstChildNode.getProperty(JcrProps.JCR_LANGUAGE.getValue()).getString());
                assertNull(firstChildNode.getProperty(JcrProps.LANGUAGE.getValue()).getValue());

                Node secondChildNode = dictionary.getNode("second_message");
                assertEquals("second message", secondChildNode.getProperty("sling:message").getValue().getString());
                assertEquals("en", secondChildNode.getProperty(JcrProps.JCR_LANGUAGE.getValue()).getString());
                assertNull(secondChildNode.getProperty(JcrProps.LANGUAGE.getValue()).getValue());
                return null;
            }
        }).when(session).logout();

        sut.rollbackToVersion(JcrProps.VERSION_PATH.getValue() + "/test-version");
        verify(session, atLeastOnce()).save();
        verify(session, atLeastOnce()).logout();
    }

    @Test
    public void shouldReturnListOfVersions() throws Exception {
        final Credentials credentials = null;
        final String firstVersionName = "version-first";
        final String secondVersionName = "version-second";
        final Session session = spy(MockJcr.newRepository().login(credentials));

        Node versionsNode = session.getRootNode().addNode(JcrProps.VERSION_PATH.getValue(), "sling:Folder");

        Node versionFirst = versionsNode.addNode(firstVersionName, "sling:Folder");
        versionFirst.setProperty("jcr:mixinTypes", new String[]{"mix:language"});
        Node versionInfoFirst = versionFirst.addNode(JcrProps.VERSION_INFO.getValue(), "sling:Folder");
        versionInfoFirst.setProperty(JcrProps.ORIGINAL_PATH.getValue(), "/apps/dhl/i18n/errors/en");

        Node versionSecond = versionsNode.addNode(secondVersionName, "sling:Folder");
        versionSecond.setProperty("jcr:mixinTypes", new String[]{"mix:language"});
        Node versionInfoSecond = versionSecond.addNode(JcrProps.VERSION_INFO.getValue(), "sling:Folder");
        versionInfoSecond.setProperty(JcrProps.ORIGINAL_PATH.getValue(), "/apps/dhl/i18n/errors/en");

        List<Node> queryresult = ImmutableList.of(versionFirst, versionSecond);
        MockJcr.setQueryResult(session, queryresult);

        when(repository.loginAdministrative(null)).thenReturn(session);
        Set<String> versionPaths = sut.fetchDictionaryVersions("/apps/dhl/i18n/errors/en");

        assertEquals(2, versionPaths.size());

        assertTrue(versionPaths.contains(JcrProps.VERSION_PATH.getValue() + "/" + firstVersionName));
        assertTrue(versionPaths.contains(JcrProps.VERSION_PATH.getValue() + "/" + secondVersionName));
    }

}
