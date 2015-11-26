package com.dhl.services.utils;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;


public class RestUtil {

    private RestUtil() {
    }

    public static void checkParam(String param, String name, Logger logger) {
        if (StringUtils.isBlank(param)) {
            logger.error(name + " is empty while calling 'resources' services");
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
    }
}
