package com.dhl.services.config;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Modified;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Holds play configuration
 */
@Component(label = "Play configuration", metatype = true, immediate = true, inherit = true)
@Service(PlayConfiguration.class)
public class PlayConfiguration {
    private static final Logger LOG = LoggerFactory.getLogger(PlayConfiguration.class);

    @Property(label = "Play server host", value = "localhost", description = "example: dev.lb.dhl.kyiv.epam.com")
    protected static final String DEFAULT_HOST = "play.host";

    @Property(label = "Play server port", value = "9000")
    protected static final String DEFAULT_PORT = "play.port";

    private String url;

    /**
     * Activate the component.
     */
    @Activate
    @Modified
    public void activate(Map<String, ?> properties) {
        String playHost = (String) properties.get(DEFAULT_HOST);
        String playPort = (String) properties.get(DEFAULT_PORT);

        url = String.format("http://%s:%s", playHost, playPort);

        LOG.info("PlayConfiguration\nHost: {}\nPort: {}\nurl: {}", new Object[]{playHost, playPort, url});
    }

    public String getPlayURL() {
        return url;
    }
}
