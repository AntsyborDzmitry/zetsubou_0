package com.dhl.services.rest;

import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dhl.services.model.CqLocale;
import com.dhl.services.model.Dictionary;
import com.dhl.services.model.Lang;
import com.dhl.services.service.NlsService;
import com.dhl.services.utils.RestUtil;

/**
 * Manage localization and i18n for CQ
 */
@Component
@Service(Object.class)
@Property(name = "javax.ws.rs", boolValue = true)
@Path("/services/dhl/nls")
public class NlsController {

    private static final Logger LOG = LoggerFactory.getLogger(NlsController.class);

    @Reference
    private NlsService nlsService;

    @GET
    @Path("pagelangs")
    @Produces("application/json")
    public List<Lang> getLangs(@QueryParam("pagepath") String pagePath, @QueryParam("country") String country) {
        RestUtil.checkParam(pagePath, "pagePath", LOG);
        RestUtil.checkParam(country, "country", LOG);
        return nlsService.availableLangs(pagePath, country);
    }

    @GET
    @Path("resources")
    @Produces("application/json")
    public Map<String, Dictionary> getResources(@QueryParam("languageCode") String languageCode,
                                                @QueryParam("countryCode") String countryCode,
                                                @QueryParam("dictionaries") List<String> dictionaries) {
        RestUtil.checkParam(languageCode, "languageCode", LOG);

        if (dictionaries == null || dictionaries.isEmpty()) {
            LOG.error("dictionary list is empty while calling 'resources' services");
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        final CqLocale cqLocale = new CqLocale(countryCode,languageCode);
        return nlsService.getResources(cqLocale, dictionaries);
    }

    @GET
    @Path("resources/basic")
    @Produces("application/json")
    public Map<String, String> getBasicLanguageResources(@QueryParam("languageCode") String languageCode,
                                                         @QueryParam("countryCode") String countryCode,
                                                         @QueryParam("dictionary") String dictionary) {
        RestUtil.checkParam(languageCode, "languageCode", LOG);
        RestUtil.checkParam(dictionary, "lang dictionary", LOG);

        final CqLocale cqLocale = new CqLocale(countryCode,languageCode);
        return nlsService.getLanguageResources(cqLocale, dictionary);
    }
    

    @GET
    @Path("resources/descriptions")
    @Produces("application/json")
    public Map<String, String> getResourcesDescriptions(@QueryParam("lang") String lang,
                                                        @QueryParam("dictionary") String dictionary) {
        RestUtil.checkParam(lang, "lang", LOG);
        RestUtil.checkParam(dictionary, "lang dictionary", LOG);

        return nlsService.getDescriptions(lang, dictionary);
    }

}