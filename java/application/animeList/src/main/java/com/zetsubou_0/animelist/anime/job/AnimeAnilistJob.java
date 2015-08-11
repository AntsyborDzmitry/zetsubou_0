package com.zetsubou_0.animelist.anime.job;

import com.google.gson.*;
import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.bean.Rating;
import com.zetsubou_0.animelist.anime.bean.anilist.Token;
import com.zetsubou_0.animelist.anime.constant.AnilistConstant;
import com.zetsubou_0.animelist.anime.enums.AnimeService;
import com.zetsubou_0.animelist.anime.enums.RestMethods;
import com.zetsubou_0.animelist.anime.exception.AnimeTypeException;
import com.zetsubou_0.animelist.anime.exception.JobException;
import com.zetsubou_0.animelist.anime.exception.RequestInitConnectionException;
import com.zetsubou_0.animelist.anime.exception.RequestSendException;
import com.zetsubou_0.animelist.anime.helper.AnimeTypeServiceImpl;
import com.zetsubou_0.animelist.anime.helper.RequestHelper;
import com.zetsubou_0.animelist.anime.helper.RequestHelperImpl;
import org.apache.commons.lang3.StringUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeAnilistJob extends AbstractJob {
    private Token token;

    @Override
    public void action() throws JobException {
        Map<String, Set<Anime>> animeSeries = (Map<String, Set<Anime>>) params.get(AnimeContainer.ANIME);
        try {
            if(animeSeries != null) {
                String animeTitle = new ArrayList<String>(animeSeries.keySet()).get(0);
                Set<Anime> foundSet = searchAnime(animeTitle);
                if(!foundSet.isEmpty()) {
                    animeSeries.put(animeTitle, foundSet);
                }
            }
        } catch (RequestSendException | RequestInitConnectionException | UnsupportedEncodingException e) {
            LOG.error(e.getMessage(), e);
        } finally {
            List<Job> jobs = (List<Job>) params.get(JobContainer.JOB_LIST);
            if(jobs != null) {
                jobs.remove(this);
            }
        }
        params.put(SourceContainer.DATA, animeSeries);
    }

    protected Set<Anime> searchAnime(String queryString) throws RequestSendException, RequestInitConnectionException, UnsupportedEncodingException {
        Set<Anime> animeSet = new HashSet<>();
        RequestHelper helper = new RequestHelperImpl();

        Map<String, String> query = new HashMap<>();
        query.put(AnilistConstant.ACCESS_TOKEN, getToken().getAccessToken());

        StringBuilder sbUrl = new StringBuilder();
        sbUrl.append(AnilistConstant.BASE_URL);
        sbUrl.append(AnilistConstant.ANIME_SEARCH);
        sbUrl.append(correctQueryString(queryString));

        Map<String, Object> initParams = new HashMap<>();
        initParams.put(RequestHelper.KEY_QUERY, query);
        initParams.put(RequestHelper.KEY_URL, sbUrl.toString());
        initParams.put(RequestHelper.KEY_METHOD, RestMethods.GET);

        helper.init(initParams);
        String response = helper.send();

        if(StringUtils.isNotBlank(response)) {
            JsonParser jsonParser = new JsonParser();
            JsonElement element = jsonParser.parse(response);
            JsonArray array = element.getAsJsonArray();

            for(JsonElement e : array) {
                JsonObject obj = e.getAsJsonObject();
                long id = obj.get(AnilistConstant.ID).getAsLong();
                animeSet.add(getById(id));
            }
        }
        return animeSet;
    }

    /**
     * Get access token
     * @return access token
     */
    private Token getToken() throws RequestSendException, RequestInitConnectionException {
        final long now = new Date().getTime() + 1000;

        RequestHelper helper = new RequestHelperImpl();

        Map<String, String> query = new HashMap<>();
        query.put(AnilistConstant.GRANT_TYPE_KEY, AnilistConstant.GRANT_TYPE);
        query.put(AnilistConstant.CLIENT_ID_KEY, AnilistConstant.CLIENT_ID);
        query.put(AnilistConstant.CLIENT_SECRET_KEY, AnilistConstant.CLIENT_SECRET);

        StringBuilder sbUrl = new StringBuilder();
        sbUrl.append(AnilistConstant.BASE_URL);
        sbUrl.append(AnilistConstant.AUTH_ACCESS_TOKEN);

        Map<String, Object> initParams = new HashMap<>();
        initParams.put(RequestHelper.KEY_QUERY, query);
        initParams.put(RequestHelper.KEY_URL, sbUrl.toString());
        initParams.put(RequestHelper.KEY_METHOD, RestMethods.POST);

        Gson gson = new GsonBuilder().create();
        helper.init(initParams);

        synchronized(AnimeAnilistJob.class) {
            // return if token present
            if(token != null && StringUtils.isNotBlank(token.getAccessToken()) && now > token.getExpiresIn()) {
                AnimeAnilistJob.class.notifyAll();
                return token;
            }
            String response = helper.send();
            token = gson.fromJson(response, Token.class);
            AnimeAnilistJob.class.notifyAll();
            return token;
        }
    }

    /**
     * Get one instance of Anime by ID
     * @param id
     * @return Anime instance
     * @throws RequestInitConnectionException
     * @throws RequestSendException
     */
    private Anime getById(long id) throws RequestInitConnectionException, RequestSendException {
        Anime anime = null;

        RequestHelper helper = new RequestHelperImpl();

        Map<String, String> query = new HashMap<>();
        query.put(AnilistConstant.ACCESS_TOKEN, getToken().getAccessToken());

        StringBuilder sbUrl = new StringBuilder();
        sbUrl.append(AnilistConstant.BASE_URL);
        sbUrl.append(AnilistConstant.ANIME_BY_ID);
        sbUrl.append(id);

        Map<String, Object> initParams = new HashMap<>();
        initParams.put(RequestHelper.KEY_QUERY, query);
        initParams.put(RequestHelper.KEY_URL, sbUrl.toString());
        initParams.put(RequestHelper.KEY_METHOD, RestMethods.GET);

        helper.init(initParams);
        String response = helper.send();

        if(StringUtils.isNotBlank(response)) {
            anime = new GsonBuilder().create().fromJson(response, Anime.class);
            JsonObject animeJson = new JsonParser().parse(response).getAsJsonObject();

            // get titles
            Set<String> titles = new HashSet<>();
            titles.add(animeJson.get(AnilistConstant.TITLE_ROMAJI).getAsString());
            titles.add(animeJson.get(AnilistConstant.TITLE_JAPANESE).getAsString());
            titles.add(animeJson.get(AnilistConstant.TITLE_ENGLISH).getAsString());
            anime.setTitles(titles);

            // date
            SimpleDateFormat dateFormat = null;
            Date startDate = null;
            Date endDate = null;
            try {
                dateFormat = new SimpleDateFormat(AnilistConstant.ISO_DATE_PATTERN);
                startDate = dateFormat.parse(animeJson.get(AnilistConstant.START_DATE).getAsString());
                endDate = dateFormat.parse(animeJson.get(AnilistConstant.END_DATE).getAsString());
            } catch (Exception e1) {
                try {
                    dateFormat = new SimpleDateFormat(AnilistConstant.SIMPLE_PATTERN);
                    startDate = dateFormat.parse(animeJson.get(AnilistConstant.START_DATE).getAsString());
                    endDate = dateFormat.parse(animeJson.get(AnilistConstant.END_DATE).getAsString());
                } catch (Exception e2) {
                    try {
                        dateFormat = new SimpleDateFormat(AnilistConstant.YEAR_PATTERN);
                        startDate = dateFormat.parse(animeJson.get(AnilistConstant.START_DATE).getAsString());
                        endDate = dateFormat.parse(animeJson.get(AnilistConstant.END_DATE).getAsString());
                    } catch (Exception e) {
                        throw new RequestSendException(e);
                    }
                }
            }
            anime.setStartDate(startDate);
            anime.setEndDate(endDate);

            // total episodes count
            long episodesCount = animeJson.get(AnilistConstant.TOTAL_EPISODES).getAsLong();
            anime.setEpisodesCount(episodesCount);

            // type
            try {
                String type = animeJson.get(AnilistConstant.TYPE).getAsString();
                anime.setType(new AnimeTypeServiceImpl().convert(type));
            } catch (AnimeTypeException e) {
                throw new RequestSendException(e);
            }

            // rating
            Rating rating = new Rating();
            rating.setSource(AnimeService.ANI_LIST);
            rating.setScore(animeJson.get(AnilistConstant.AVERAGE_SCORE).getAsDouble());
            anime.addRating(rating);
        }

        return anime;
    }

    /**
     * Remove "!", ... ")" and escape URL
     * @param query
     * @return corrected URL string
     * @throws UnsupportedEncodingException
     */
    private String correctQueryString(String query) throws UnsupportedEncodingException {
        query = query.replaceAll(AnilistConstant.SPECIAL_SYMBOLS, StringUtils.EMPTY);
        return URLEncoder.encode(query, RequestHelper.DEFAULT_ENCODING);
    }
}
