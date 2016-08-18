package com.dhl.ewf;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.NameValuePair;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

import java.io.*;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static com.dhl.ewf.ConfigurationConstants.*;

public class Executor implements Closeable {

    private static final String PROPERTIES_PATH = "resources/configuration.properties";

    private static final String QUERY_BUILDER_PATH = "/bin/querybuilder.json";

    private String host;

    private int port;

    private String scheme;

    private String userName;

    private String userPassword;

    private CloseableHttpClient httpClient;
    private HttpHost targetHost;
    private HttpClientContext context;

    public Executor() {
        initProperties();
        httpClient = HttpClients.createDefault();
        targetHost = new HttpHost(host, port, scheme);
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                new AuthScope(targetHost.getHostName(), targetHost.getPort()),
                new UsernamePasswordCredentials(userName, userPassword));

        AuthCache authCache = new BasicAuthCache();
        BasicScheme basicAuth = new BasicScheme();
        authCache.put(targetHost, basicAuth);

        context = HttpClientContext.create();
        context.setCredentialsProvider(credentialsProvider);
        context.setAuthCache(authCache);
    }

    private void initProperties() {
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(PROPERTIES_PATH)) {
            properties.load(input);
            host = properties.getProperty(PN_HOST, DEFAULT_HOST);
            port = Integer.parseInt(properties.getProperty(PN_PORT, DEFAULT_PORT));
            scheme = properties.getProperty(PN_SCHEME, DEFAULT_SCHEME);
            userName = properties.getProperty(PN_USER_NAME, DEFAULT_USER_NAME);
            userPassword = properties.getProperty(PN_PASSWORD, DEFAULT_PASSWORD);
        } catch (IOException e) {
            // todo: print exception
        }
    }

    public int execute(String url, Map<String, String> params) throws IOException {
        List<NameValuePair> postParams = new LinkedList<>();
        for (String paramName : params.keySet()) {
            postParams.add(new BasicNameValuePair(paramName, params.get(paramName)));
        }
        UrlEncodedFormEntity entity = new UrlEncodedFormEntity(postParams, Consts.UTF_8);

        HttpPost httpPost = new HttpPost(url);
        httpPost.setEntity(entity);

        try (CloseableHttpResponse response = httpClient.execute(targetHost, httpPost, context)) {
            return response.getStatusLine().getStatusCode();
        }
    }

    public String executeQuery(final Map<String, String> queryParams) throws IOException {
        URIBuilder uriBuilder = new URIBuilder();
        uriBuilder.setScheme(scheme).setHost(host).setPath(QUERY_BUILDER_PATH);
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            uriBuilder.setParameter(entry.getKey(), entry.getValue());
        }
        HttpGet httpGet;
        try {
            httpGet = new HttpGet(uriBuilder.build());
        } catch (URISyntaxException e) {
            throw new IOException(e);
        }
        try (CloseableHttpResponse response = httpClient.execute(targetHost, httpGet, context)) {
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode >= 400) {
                return StringUtils.EMPTY;
            }
            return convertResponseToString(response);
        }
    }

    public int executeDelete(String url) throws IOException {
        HttpDelete httpPost = new HttpDelete(url);

        try (CloseableHttpResponse response = httpClient.execute(targetHost, httpPost, context)) {
            return response.getStatusLine().getStatusCode();
        }
    }

    private String convertResponseToString(final CloseableHttpResponse response) throws IOException {
        String result = StringUtils.EMPTY;
        HttpEntity entity = response.getEntity();
        if (entity == null) {
            return result;
        }
        InputStream inputStream = entity.getContent();
        StringWriter writer = new StringWriter();
        IOUtils.copy(inputStream, writer, Consts.UTF_8.displayName());
        return writer.toString();
    }

    @Override
    public void close() throws IOException {
        httpClient.close();
    }
}
