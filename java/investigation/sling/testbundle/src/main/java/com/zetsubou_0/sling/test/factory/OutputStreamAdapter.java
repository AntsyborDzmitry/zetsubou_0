package com.zetsubou_0.sling.test.factory;

import com.zetsubou_0.sling.test.bean.FsResource;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.adapter.AdapterFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
@Component
@Service
@Properties({
        @Property(name = "adaptables", value = {"com.zetsubou_0.sling.test.bean.FsResource"}),
        @Property(name = "adapters", value = {"java.io.OutputStream"})
})
public class OutputStreamAdapter implements AdapterFactory {
    private static final Logger LOG = LoggerFactory.getLogger(OutputStreamAdapter.class);

    @Override
    public <AdapterType> AdapterType getAdapter(Object o, Class<AdapterType> adapterClass) {
        OutputStream out = null;
        FsResource resource = (FsResource) o;
        try {
            out = new FileOutputStream(resource.getFile()) ;
        } catch (IOException e) {
            LOG.error(e.getMessage(), e);
        }
        return (AdapterType) out;
    }
}
