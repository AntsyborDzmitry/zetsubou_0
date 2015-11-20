package com.dhl.author.mock;


import com.dhl.services.service.JcrProps;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.collections.CollectionUtils;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import javax.jcr.*;
import javax.jcr.nodetype.NodeDefinition;
import javax.jcr.nodetype.NodeType;
import javax.jcr.nodetype.PropertyDefinition;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class I18NJcrMock {

    public static Node mockNode(String name, String type) throws Exception {
        NodeType nodeTypeMock = mock(NodeType.class);
        when(nodeTypeMock.getName()).thenReturn(type);

        Node nodeMock = mock(Node.class);
        when(nodeMock.getMixinNodeTypes()).thenReturn(new NodeType[0]);
        when(nodeMock.getPrimaryNodeType()).thenReturn(nodeTypeMock);
        when(nodeMock.getName()).thenReturn(name);

        NodeDefinition nodeDefMock = mock(NodeDefinition.class);
        when(nodeDefMock.isProtected()).thenReturn(false);
        when(nodeMock.getDefinition()).thenReturn(nodeDefMock);
        return nodeMock;
    }

    public static Property mockProperty(Node parentNode, String name, String value) throws Exception {
        Property propMock = mock(Property.class);

        PropertyDefinition propDefMock = mock(PropertyDefinition.class);
        when(propDefMock.isMultiple()).thenReturn(false);
        when(propDefMock.isProtected()).thenReturn(false);

        when(propMock.getDefinition()).thenReturn(propDefMock);
        when(propMock.getName()).thenReturn(name);
        Value propValue = mock(Value.class);
        when(propValue.getString()).thenReturn(value);
        when(propMock.getValue()).thenReturn(propValue);

        when(parentNode.getProperty(name)).thenReturn(propMock);
        return propMock;
    }

    public static NodeIterator mockNodeIterator(List<Node> nodes) throws Exception {
        NodeIterator nodeChildrenMock = mock(NodeIterator.class);

        if(CollectionUtils.isNotEmpty(nodes)) {
            Iterator<Node> nodeIterator = nodes.iterator();
            Node firstNode = nodeIterator.next();

            List<Boolean> hasNext = new ArrayList<>();
            List<Node> nextNode = new ArrayList<>();

            while(nodeIterator.hasNext()) {
                nextNode.add(nodeIterator.next());
                hasNext.add(true);
            }
            hasNext.add(false);
            when(nodeChildrenMock.hasNext()).thenReturn(true, hasNext.toArray(new Boolean[hasNext.size()]));
            when(nodeChildrenMock.nextNode()).thenReturn(firstNode, nextNode.toArray(new Node[nextNode.size()]));
        } else {
            when(nodeChildrenMock.hasNext()).thenReturn(false);
        }
        return nodeChildrenMock;
    }

    public static PropertyIterator mockPropertyIterator(Node parentNode, Map<String, String> properties) throws Exception {
        PropertyIterator nodePropsMock = mock(PropertyIterator.class);

        Iterator<Map.Entry<String, String>> propertiesIterator = properties.entrySet().iterator();
        Map.Entry<String, String> property = propertiesIterator.next();
        Property firstNextProperty = mockProperty(parentNode, property.getKey(), property.getValue());

        List<Property> nextProperty = new ArrayList<>();
        List<Boolean> hasNext = new ArrayList<>();

        while(propertiesIterator.hasNext()) {
            property = propertiesIterator.next();
            nextProperty.add(mockProperty(parentNode, property.getKey(), property.getValue()));
            hasNext.add(true);
        }
        hasNext.add(false);

        when(nodePropsMock.hasNext()).thenReturn(true, hasNext.toArray(new Boolean[hasNext.size()]));
        when(nodePropsMock.nextProperty()).thenReturn(firstNextProperty, nextProperty.toArray(new Property[nextProperty.size()]));
        return nodePropsMock;
    }

    public static Node mockNodeWithProperties(String nodeName, String nodeType, Map<String, String> properties) throws Exception{
        Node nodeMock = mockNode(nodeName, nodeType);

        PropertyIterator nodePropsMock = mockPropertyIterator(nodeMock, properties);
        when(nodeMock.getProperties()).thenReturn(nodePropsMock);

        NodeIterator nodeChildrenMock = mockNodeIterator(new ArrayList<Node>());
        when(nodeMock.getNodes()).thenReturn(nodeChildrenMock);
        return nodeMock;
    }

    public static Node mockDictionary() throws Exception{
        Node enNodeMock = mockNodeWithProperties("en", "sling:Folder",
                ImmutableMap.of("jcr:language", "en", "sling:basename", "dhl"));

        //node's children
        Node enNodeChild1Mock = mockNodeWithProperties("first_message", "nt:folder",
                ImmutableMap.of("sling:message", "first message", "jcr:language", "en"));
        Node enNodeChild2Mock = mockNodeWithProperties("second_message", "nt:folder",
                ImmutableMap.of("sling:message", "second message", "jcr:language", "en"));

        NodeIterator enNodeChildrenMock = mockNodeIterator(ImmutableList.of(enNodeChild1Mock, enNodeChild2Mock));
        when(enNodeMock.getNodes()).thenReturn(enNodeChildrenMock);
        return enNodeMock;
    }

    public static Node mockDictionaryVersion(String dictionaryPath) throws Exception{
        final Node versionNodeMock = mockNodeWithProperties("en", "sling:Folder",
                ImmutableMap.of("jcr:language", "en", "sling:basename", "dhl"));

        //node's children
        final Node versionNodeChild1Mock = mockNodeWithProperties("first_message", "nt:folder",
                ImmutableMap.of("sling:message", "first message", "language", "en"));
        when(versionNodeMock.getNode("first_message")).thenReturn(versionNodeChild1Mock);

        final Node versionNodeChild2Mock = mockNodeWithProperties("second_message", "nt:folder",
                ImmutableMap.of("sling:message", "second message", "language", "en"));
        when(versionNodeMock.getNode("second_message")).thenReturn(versionNodeChild2Mock);

        Node versionNodeChildInfoMock = mockNodeWithProperties(JcrProps.VERSION_INFO.getValue(), JcrProps.SLING_FOLDER.getValue(),
                ImmutableMap.of(JcrProps.ORIGINAL_PATH.getValue(), dictionaryPath));
        when(versionNodeMock.getNode(JcrProps.VERSION_INFO.getValue())).thenReturn(versionNodeChildInfoMock);

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                NodeIterator enNodeChildrenMock = mockNodeIterator(
                        ImmutableList.of(versionNodeChild1Mock, versionNodeChild2Mock));
                when(versionNodeMock.getNodes()).thenReturn(enNodeChildrenMock);
                return null;
            }
        }).when(versionNodeChildInfoMock).remove();

        NodeIterator enNodeChildrenMock = mockNodeIterator(
                ImmutableList.of(versionNodeChild1Mock, versionNodeChild2Mock, versionNodeChildInfoMock));
        when(versionNodeMock.getNodes()).thenReturn(enNodeChildrenMock);
        return versionNodeMock;
    }
}
