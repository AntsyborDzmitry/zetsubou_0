package com.zetsubou_0.anime.helper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.anime.enums.RestMethods;
import com.zetsubou_0.anime.exception.RequestInitConnectionException;
import com.zetsubou_0.anime.exception.RequestSendException;
import com.zetsubou_0.anime.helper.anilist.bean.Token;
import com.zetsubou_0.anime.service.metadata.AnimeAnilist;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public class RequestHelperImpl implements RequestHelper {
    private Map<String, Object> params;
    private String url;
    private Proxy proxy;
    private RestMethods method;
    private String encoding = DEFAULT_ENCODING;
    private Map<String, String> headers;
    private Map<String, String> query;

    public void init(Map<String, Object> params) throws RequestInitConnectionException {
        this.params = params;
        initConnection();
    }

    public String send() throws RequestSendException {
        String response = null;

        List<NameValuePair> formparams = new ArrayList<NameValuePair>();
        for(Map.Entry<String, String> param : query.entrySet()) {
            formparams.add(new BasicNameValuePair(param.getKey(), param.getValue()));
        }

        if(method == RestMethods.POST) {

            try {
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, Consts.UTF_8);
                HttpPost httppost = new HttpPost(url);
                httppost.setEntity(entity);

                response = getResponse(httppost);
            } catch (IOException e) {
                throw new RequestSendException(e);
            }
        } else if(method == RestMethods.GET) {
            try {
                URIBuilder builder = new URIBuilder(url);
                builder.addParameters(formparams);
                HttpGet httpGet = new HttpGet(builder.build());

                response = getResponse(httpGet);
            } catch (URISyntaxException | IOException e) {
                throw new RequestSendException(e);
            }
        }

        return response;
    }

    private String getResponse(HttpUriRequest request) throws IOException {
        String response = null;

        CloseableHttpClient client = HttpClients.createDefault();

        try (CloseableHttpResponse closeableHttpResponse = client.execute(request)) {
            HttpEntity httpEntity = closeableHttpResponse.getEntity();
            if(httpEntity != null) {
                try(BufferedReader in = new BufferedReader(
                        new InputStreamReader(httpEntity.getContent()));) {
                    String inputLine;
                    StringBuffer responseBuf = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        responseBuf.append(inputLine);
                    }

                    return responseBuf.toString();
                }
            }
        }

        return response;
    }

    private void verifyUrl() throws RequestInitConnectionException {
        if(url == null) {
            throw new RequestInitConnectionException("URL is empty");
        }
    }

    private void initConnection() throws RequestInitConnectionException{
        try {
            url = (String) params.get(KEY_URL);
            proxy = (Proxy) params.get(KEY_PROXY);
            method = (RestMethods) params.get(KEY_METHOD);
            headers = (Map<String, String>) params.get(KEY_HEADERS);
            query = (Map<String, String>) params.get(KEY_QUERY);
            String encoding = (String) params.get(KEY_ENCODING);

            verifyUrl();

            if(encoding != null) {
                this.encoding = encoding;
            }
            if(method == null) {
                method = RestMethods.GET;
            }
        } catch (Exception e) {
            throw new RequestInitConnectionException(e);
        }
    }

}
