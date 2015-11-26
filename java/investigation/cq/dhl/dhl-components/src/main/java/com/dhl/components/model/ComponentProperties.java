package com.dhl.components.model;

import java.util.HashMap;

import javax.inject.Inject;

import org.apache.sling.api.resource.ValueMap;

import com.cognifide.slice.mapper.annotation.SliceResource;
import com.dhl.components.annotation.ParentComponentAttributes;
import com.dhl.components.annotation.TemplateAttributes;

@SliceResource
public class ComponentProperties extends HashMap<String, Object> {
    private static final long serialVersionUID = 3573099595621439793L;

    @Inject
    public ComponentProperties(@TemplateAttributes final ValueMap templateAttributes,
            @ParentComponentAttributes final ValueMap parentComponentAttributes) {
        // Get default properties from template
        this.putAll(templateAttributes);
        // And override by component properties
        this.putAll(parentComponentAttributes);
    }
}