package com.zetsubou_0.locale.configuration;

import org.apache.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigurationProperties {

    private static final Logger LOG = Logger.getLogger(ConfigurationProperties.class);

    private String host;

    private int port;

    private String scheme;

    private String userName;

    private String userPassword;

    private String locale;

    private boolean fail;

    private ConfigurationProperties(String fileName) {
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(fileName)) {
            properties.load(input);
//            host = properties.getProperty(PN_HOST, DEFAULT_HOST);
//            port = Integer.parseInt(properties.getProperty(PN_PORT, DEFAULT_PORT));
//            scheme = properties.getProperty(PN_SCHEME, DEFAULT_SCHEME);
//            userName = properties.getProperty(PN_USER_NAME, DEFAULT_USER_NAME);
//            userPassword = properties.getProperty(PN_PASSWORD, DEFAULT_PASSWORD);
//            locale = properties.getProperty(PN_LOCALE, DEFAULT_LOCALE);
        } catch (IOException e) {
            LOG.error("Error occurred while obtaining properties", e);
            fail = true;
        }
    }

    public static ConfigurationProperties readFromFile(String fileName) {
        return new ConfigurationProperties(fileName);
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public String getScheme() {
        return scheme;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public String getLocale() {
        return locale;
    }

    public boolean isDataObtained() {
        return !fail;
    }
}
