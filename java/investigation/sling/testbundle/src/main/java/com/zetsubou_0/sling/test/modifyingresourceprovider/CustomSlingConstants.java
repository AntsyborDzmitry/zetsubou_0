package com.zetsubou_0.sling.test.modifyingresourceprovider;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
public class CustomSlingConstants {
    public static final String MODIFYING_RESOURCE_PROVIDER_NAME = "sling.custom.modifyingResourceProvider.name";
    public static final String CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME = "com.zetsubou_0.sling.test.modifyingresourceprovider.CustomFsModifying";
    public static final String DEFAULT_FS_ROOT = "d:/temp/00/%s";
    public static final String DEFAULT_SLING_ROOT = "/content/fs/%s";
    public static final String TOPIC_RESOURCE_ADD_JOB = "com/zetsubou_0/sling/test/job/add";
    public static final String TOPIC_RESOURCE_REMOVE_JOB = "com/zetsubou_0/sling/test/job/remove";
    public static final String TOPIC_RESOURCE_ADD = "com/zetsubou_0/sling/test/job/event/add";
    public static final String TOPIC_RESOURCE_REMOVE = "com/zetsubou_0/sling/test/job/event/remove";
    public static final String RESOURCE = "resource";
}
