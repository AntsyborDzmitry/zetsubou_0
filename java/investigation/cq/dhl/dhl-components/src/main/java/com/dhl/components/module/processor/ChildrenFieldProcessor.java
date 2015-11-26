package com.dhl.components.module.processor;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.Validate;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.cognifide.slice.api.provider.ModelProvider;
import com.cognifide.slice.mapper.api.processor.FieldProcessor;
import com.dhl.components.annotation.Children;
import com.dhl.services.utils.ResourceUtil;
import com.google.inject.Inject;
import com.google.inject.Provider;

public class ChildrenFieldProcessor implements FieldProcessor {

    private final Provider<ModelProvider> modelProvider;

    @Inject
    public ChildrenFieldProcessor(final Provider<ModelProvider> modelProvider) {
        this.modelProvider = modelProvider;
    }

    @Override
    public boolean accepts(final Resource resource, final Field field) {
        if (!field.isAnnotationPresent(Children.class)) {
            return false;
        }
        Class<?> fieldType = field.getType();
        return List.class.isAssignableFrom(fieldType) || fieldType.isArray();
    }

    @Override
    public Object mapResourceToField(final Resource resource, final ValueMap valueMap, final Field field,
            final String propertyName) {
        List<?> mappedModels = getChildrenList(resource, field, propertyName);
        final Class<?> fieldType = field.getType();
        return fieldType.isArray() ? getArrayFromList(fieldType.getComponentType(), mappedModels) : mappedModels;

    }

    private List<?> getChildrenList(final Resource resource, final Field field, final String propertyName) {
        Validate.isTrue(propertyName.charAt(0) != '/',
                "Property name must not start with \"/\" as it doesn't indicate a relative resource");
        Resource parentResource = resource.getChild(propertyName);
        return getChildrenList(parentResource, field);
    }

    private List<?> getChildrenList(final Resource parentResource, final Field field) {
        if (parentResource == null) {
            return Collections.emptyList();
        }
        Children childrenAnnotation = field.getAnnotation(Children.class);
        Class<?> modelClass = childrenAnnotation.value();
        ModelProvider provider = modelProvider.get();
        List<String> childrenPaths = ResourceUtil.listChildrenPaths(parentResource);
        return provider.getList(modelClass, childrenPaths.iterator());
    }

    private Object getArrayFromList(final Class<?> componentType, final List<?> children) {
        Object array = Array.newInstance(componentType, children.size());
        int index = 0;
        for (Object child : children) {
            if (!componentType.isAssignableFrom(child.getClass())) {
                Array.set(array, index++, child);
            }
        }
        return array;
    }
}