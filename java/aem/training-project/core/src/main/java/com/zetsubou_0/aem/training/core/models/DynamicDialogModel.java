package com.zetsubou_0.aem.training.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class)
public class DynamicDialogModel {

    private static final String CATEGORY_REL_PATH = "container/category/category-container";

    private SlingHttpServletRequest request;

    private List<CategoryFieldModel> fields;

    public DynamicDialogModel(SlingHttpServletRequest request) {
        this.request = request;
    }

    public List<CategoryFieldModel> getFields() {
        return fields;
    }

    @PostConstruct
    protected void init() {
        Resource productResource = request.getRequestPathInfo().getSuffixResource();
        PageManager pageManager = productResource.getResourceResolver().adaptTo(PageManager.class);
        Page categoryPage = pageManager.getContainingPage(productResource).getParent();
        Resource categoryResource = categoryPage.getContentResource().getChild(CATEGORY_REL_PATH);
        if (categoryResource == null) {
            return;
        }
        CategoryModel categoryModel = categoryResource.adaptTo(CategoryModel.class);
        fields = categoryModel.getFields();
    }
}
