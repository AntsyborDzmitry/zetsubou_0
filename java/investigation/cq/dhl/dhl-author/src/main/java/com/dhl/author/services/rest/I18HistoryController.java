package com.dhl.author.services.rest;

import com.dhl.author.services.service.I18NHistoryService;
import com.dhl.author.model.DictionaryVersion;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Map;
import java.util.Set;

import com.dhl.services.service.JcrProps;

/**
 * Responsible for creating/restoring versions of CQ i18n dictionaries.
 */
@Component
@Service(Object.class)
@Property(name = "javax.ws.rs", boolValue = true)
@Path("/services/dhl/i18nHistory")
public class I18HistoryController {

    private static final String IS_EMPTY = "path param is empty";

    private static final Logger LOGGER = LoggerFactory.getLogger(I18HistoryController.class);

    @Reference
    private I18NHistoryService historyService;


    @GET
    @Produces("application/json")
    public DictionaryVersion getVersionsForDictionary(@QueryParam("path") String dictionaryPath) throws JSONException {
        if (StringUtils.isEmpty(dictionaryPath)) {
            LOGGER.error(IS_EMPTY);
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        Set<String> versions = historyService.fetchDictionaryVersions(dictionaryPath);

        DictionaryVersion response = new DictionaryVersion();
        response.setTotal(versions.size());
        response.setPaths(versions);
        return response;
    }

    @DELETE
    @Produces("application/json")
    @Consumes("application/x-www-form-urlencoded")
    public Map<String, String> deleteVersion(@FormParam("path") String versionPath) throws JSONException {
        if (StringUtils.isEmpty(versionPath)) {
            LOGGER.error(IS_EMPTY);
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        return historyService.deleteDictionaryVersion(versionPath);
    }

    @PUT
    @Produces("application/json")
    @Consumes("application/x-www-form-urlencoded")
    public Map<String, String> addVersionForDictionary(@FormParam("path") String dictionaryPath,
                                                       @FormParam("name") String versionName) throws JSONException {
        if (StringUtils.isEmpty(dictionaryPath)) {
            LOGGER.error("dictionaryPath param is empty");
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (StringUtils.isEmpty(versionName)) {
            LOGGER.error("versionName param is empty");
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        return historyService.makeDictionaryVersion(dictionaryPath, versionName);
    }

    @POST
    @Path("rollback")
    @Consumes("application/x-www-form-urlencoded")
    public JSONObject rollbackToVersion(@FormParam("path") String versionPath) {
        if (StringUtils.isEmpty(versionPath)) {
            LOGGER.error("versionPath param is empty");
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        historyService.rollbackToVersion(versionPath);
        JSONObject response = new JSONObject();
        try {
            response.put(JcrProps.STATUS.getValue(), JcrProps.OK.getValue());
        } catch (JSONException e) {
            throw new WebApplicationException(e, Response.Status.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}
