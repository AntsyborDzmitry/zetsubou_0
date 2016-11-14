package com.zetsubou_0.locale.rest.impl;

import com.zetsubou_0.locale.configuration.ConfigurationProperties;
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

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class RestExecutor implements Closeable {

    private CloseableHttpClient httpClient;

    private HttpHost targetHost;

    private HttpClientContext context;

    private ConfigurationProperties properties;

    public RestExecutor(ConfigurationProperties properties) {
        if (properties == null) {
            return;
        }
        this.properties = properties;
        httpClient = HttpClients.createDefault();
        targetHost = new HttpHost(properties.getHost(), properties.getPort(), properties.getScheme());
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                new AuthScope(targetHost.getHostName(), targetHost.getPort()),
                new UsernamePasswordCredentials(properties.getUserName(), properties.getUserPassword()));

        AuthCache authCache = new BasicAuthCache();
        BasicScheme basicAuth = new BasicScheme();
        authCache.put(targetHost, basicAuth);

        context = HttpClientContext.create();
        context.setCredentialsProvider(credentialsProvider);
        context.setAuthCache(authCache);
    }

    public int executePost(final String url, final Map<String, String> params) throws IOException {
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

    public String executeGet(final String url, final Map<String, String> params) throws IOException {
        HttpGet httpGet;
        try {
            httpGet = new HttpGet(getUri(url, params));
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

    private URI getUri(final String url, final Map<String, String> params) throws URISyntaxException {
        URIBuilder uriBuilder = new URIBuilder();
        uriBuilder.setScheme(properties.getScheme()).setHost(properties.getHost()).setPath(url);
        for (Map.Entry<String, String> entry : params.entrySet()) {
            uriBuilder.setParameter(entry.getKey(), entry.getValue());
        }
        return uriBuilder.build();
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
