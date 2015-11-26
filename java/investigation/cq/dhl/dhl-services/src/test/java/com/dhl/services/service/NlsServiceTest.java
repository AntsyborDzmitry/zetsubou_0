package com.dhl.services.service;

import com.dhl.services.dao.SlingDao;
import com.dhl.services.mock.JcrMocks;
import com.dhl.services.model.CqLocale;
import com.dhl.services.model.Lang;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.jcr.Node;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static com.dhl.services.dao.SlingDao.*;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class NlsServiceTest {

    @Mock
    private SlingDao slingDaoMock;

    @InjectMocks
    private NlsService sut = new NlsServiceImpl();

    @Mock
    private Map<String, String> basicLanguageResources;

    @Test
    public void shouldReturnAvailableLanguages() throws Exception {
        List<Node> langNodeList = Arrays.asList(JcrMocks.mockLangNode("1111", "ua"),JcrMocks.mockLangNode("2222", "ru"));
        when(slingDaoMock.getNodes("/content/dhl/ukraine")).thenReturn(langNodeList);

        when(slingDaoMock.getNodeProperty(langNodeList.get(0).getNode(CONTENT), "langName")).thenReturn("ua");
        when(slingDaoMock.getNodeProperty(langNodeList.get(1).getNode(CONTENT), "langName")).thenReturn("ru");

        List<Lang> availableLangs = sut.availableLangs("path", "ukraine");

        assertEquals(langNodeList, slingDaoMock.getNodes("/content/dhl/ukraine"));
        assertEquals(2, availableLangs.size());

        verify(slingDaoMock, times(2)).getNodes("/content/dhl/ukraine");
        verify(slingDaoMock, times(1)).getNodeProperty(langNodeList.get(0).getNode(CONTENT), "langName");

        assertEquals("1111", availableLangs.get(0).getId());
        assertEquals("2222", availableLangs.get(1).getId());

        assertEquals("ua", availableLangs.get(0).getName());
        assertEquals("ru", availableLangs.get(1).getName());
    }

    @Test
    public void shouldReturnBasicLanguageResources() throws Exception {
        List<Node> nodeList = Arrays.asList(JcrMocks.mockNode("label1"), JcrMocks.mockNode("label2"));

        CqLocale cqLocale = new CqLocale("usa","english");

        Node firstNode = nodeList.get(0);
        Node secondNode = nodeList.get(1);

        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(nodeList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(true);

        when(slingDaoMock.getNodeProperty(firstNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedText1");
        when(slingDaoMock.getNodeProperty(secondNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedText2");

        Map<String, String> translations = sut.getLanguageResources(cqLocale, "login");
        Map<String, String> translations2 = sut.getLanguageResources(cqLocale, "not-existing-dict");

        assertEquals(translations2.size(), 0);
        assertEquals(translations.size(), 2);
        assertEquals(translations.get(firstNode.getName()), "TranslatedText1");
        assertEquals(translations.get(secondNode.getName()), "TranslatedText2");
    }

    @Test
    public void shouldReturnLanguageResourcesFromTwoDictionaries() throws  Exception{
        List<Node> loginNodeLangList = Arrays.asList(JcrMocks.mockNode("labelLogin1"), JcrMocks.mockNode("labelLogin2"));
        List<Node> loginNodeCountryLangList = new ArrayList<>();
        CqLocale cqLocale = new CqLocale("usa","english");

        Node firstLoginNode = loginNodeLangList.get(0);
        Node secondLoginNode = loginNodeLangList.get(1);

        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(loginNodeLangList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(true);
        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode() + "_" + cqLocale.getCountryCode())).thenReturn(loginNodeCountryLangList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode() + "_" + cqLocale.getCountryCode())).thenReturn(true);

        when(slingDaoMock.getNodeProperty(firstLoginNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedLoginText1");
        when(slingDaoMock.getNodeProperty(secondLoginNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedLoginText2");

        List<Node> registrationNodeLangList = Arrays.asList(JcrMocks.mockNode("labelRegistration1"));
        List<Node> registrationNodeCountryLangList = Arrays.asList(JcrMocks.mockNode("labelRegistration2"));

        Node firstRegistrationNode = registrationNodeLangList.get(0);
        Node secondRegistrationNode = registrationNodeCountryLangList.get(0);

        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "registration/" + cqLocale.getLanguageCode())).thenReturn(registrationNodeLangList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "registration/" + cqLocale.getLanguageCode())).thenReturn(true);
        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "registration/" + cqLocale.getLanguageCode() + "_" + cqLocale.getCountryCode())).thenReturn(registrationNodeCountryLangList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "registration/" + cqLocale.getLanguageCode() + "_" + cqLocale.getCountryCode())).thenReturn(true);

        when(slingDaoMock.getNodeProperty(firstRegistrationNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedRegistrationText1");
        when(slingDaoMock.getNodeProperty(secondRegistrationNode, SLING_MESSAGE_PROPERTY_KEY)).thenReturn("TranslatedRegistrationText2");

        Map<String, com.dhl.services.model.Dictionary> translations = sut.getResources(cqLocale, Arrays.asList("login", "registration"));

        assertEquals(translations.get("login").size(), 2);
        assertEquals(translations.get("registration").size(), 2);
        assertEquals(translations.get("login").get("labelLogin1"), "TranslatedLoginText1");
        assertEquals(translations.get("login").get("labelLogin2"), "TranslatedLoginText2");
        assertEquals(translations.get("registration").get("labelRegistration1"), "TranslatedRegistrationText1");
        assertEquals(translations.get("registration").get("labelRegistration2"), "TranslatedRegistrationText2");
    }

    @Test
    public void shouldReturnDescriptionForResources() throws Exception {
        CqLocale cqLocale = new CqLocale("usa","english");
        List<Node> loginNodeList = Arrays.asList(JcrMocks.mockNode("labelLogin1"), JcrMocks.mockNode("labelLogin2"));

        Node firstNode = loginNodeList.get(0);
        Node secondNode = loginNodeList.get(1);

        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(loginNodeList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(true);

        String firstNodeDesc = "this is description";
        String firstNodeKeyValue = firstNode.getName() + "(" + firstNodeDesc + ")";
        when(firstNode.hasProperty(SLING_KEY_PROPERTY_KEY)).thenReturn(true);
        when(slingDaoMock.getNodeProperty(firstNode, SLING_KEY_PROPERTY_KEY)).thenReturn(firstNodeKeyValue);

        Map<String, String> descriptions = sut.getDescriptions(cqLocale.getLanguageCode(), "login");

        assertEquals(descriptions.size(), 2);
        assertEquals(descriptions.get(firstNode.getName()), firstNodeDesc);
        assertEquals(descriptions.get(secondNode.getName()), NlsServiceImpl.NO_DESCRIPTION);
    }

    @Test
    public void shouldUpdateResource() throws Exception {
        CqLocale cqLocale = new CqLocale("usa","english");
        List<Node> loginNodeList = Arrays.asList(JcrMocks.mockNode("labelLogin1"), JcrMocks.mockNode("labelLogin2"));
        Node firstNode = loginNodeList.get(0);

        when(slingDaoMock.getNodes(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(loginNodeList);
        when(slingDaoMock.isNodeExists(DEFAULT_DICTIONARY_PATH + "login/" + cqLocale.getLanguageCode())).thenReturn(true);

        sut.updateResources("labelLogin1", "new value", "login", cqLocale.getLanguageCode());

        verify(firstNode, times(1)).setProperty(SLING_MESSAGE_PROPERTY_KEY, "new value");
    }
}
