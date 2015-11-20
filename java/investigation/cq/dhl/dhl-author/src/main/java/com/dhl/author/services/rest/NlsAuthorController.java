package com.dhl.author.services.rest;

import com.dhl.services.service.NlsService;
import com.dhl.services.utils.RestUtil;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;


@Component
@Service(Object.class)
@Property(name = "javax.ws.rs", boolValue = true)
@Path("/services/dhl/author/nls")
public class NlsAuthorController {

    private static final Logger LOG = LoggerFactory.getLogger(NlsAuthorController.class);

    @Reference
    private NlsService nlsService;

    @GET
    @Path("update")
    @Produces("text/plain")
    public String updateResources(@QueryParam("id") String id,
                                  @QueryParam("value") String value,
                                  @QueryParam("dictionary") String dictionary,
                                  @QueryParam("lang") String lang) {

        RestUtil.checkParam(value, "value", LOG);
        RestUtil.checkParam(id, "id", LOG);
        RestUtil.checkParam(lang, "lang param", LOG);
        RestUtil.checkParam(dictionary, "lang dictionary", LOG);

        nlsService.updateResources(id, value, dictionary, lang);

        return "Successfully updated";
    }
}
