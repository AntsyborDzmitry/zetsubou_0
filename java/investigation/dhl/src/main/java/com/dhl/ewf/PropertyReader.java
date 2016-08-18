package com.dhl.ewf;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import static com.dhl.ewf.ConfigurationConstants.*;
import static com.dhl.ewf.ConfigurationConstants.DEFAULT_LOG_FILE;
import static com.dhl.ewf.ConfigurationConstants.PN_LOG_FILE;

public class PropertyReader {

    private String host;

    private int port;

    private String scheme;

    private String userName;

    private String userPassword;

    private String logFileName;


    public PropertyReader(String fileName) {
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(fileName)) {
            properties.load(input);
            host = properties.getProperty(PN_HOST, DEFAULT_HOST);
            port = Integer.parseInt(properties.getProperty(PN_PORT, DEFAULT_PORT));
            scheme = properties.getProperty(PN_SCHEME, DEFAULT_SCHEME);
            userName = properties.getProperty(PN_USER_NAME, DEFAULT_USER_NAME);
            userPassword = properties.getProperty(PN_PASSWORD, DEFAULT_PASSWORD);
            logFileName = properties.getProperty(PN_LOG_FILE, DEFAULT_LOG_FILE);
        } catch (IOException e) {
            System.err.println("Error occurred while reading properties from " + fileName + ". " + e.getMessage());
        }
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

    public String getLogFileName() {
        return logFileName;
    }
}
