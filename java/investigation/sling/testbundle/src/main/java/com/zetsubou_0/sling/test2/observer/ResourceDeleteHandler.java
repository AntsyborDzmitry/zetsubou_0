package com.zetsubou_0.sling.test2.observer;

import com.zetsubou_0.sling.test2.helper.FsHelper;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingConstants;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

/**
 * Created by Kiryl_Lutsyk on 10/13/2015.
 */
@Component(immediate = true)
@Service(value = EventHandler.class)
@Property(name = EventConstants.EVENT_TOPIC, value = SlingConstants.TOPIC_RESOURCE_REMOVED)
public class ResourceDeleteHandler implements ResourceHandler {
    private static final Logger LOG = LoggerFactory.getLogger(ResourceDeleteHandler.class);

    @Override
    public void handleEvent(Event event) {
        if(FsHelper.checkEvent(event)) {
            LOG.debug(event.getTopic() + " - " + ((File)event.getProperty(FsHelper.FILE)).getPath());
        }
    }
}
