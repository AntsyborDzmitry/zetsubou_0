package com.zetsubou_0.animelist.anime.action;

import com.google.gson.*;
import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.bean.Rating;
import com.zetsubou_0.animelist.anime.bean.anilist.Token;
import com.zetsubou_0.animelist.anime.constant.AnilistConstant;
import com.zetsubou_0.animelist.anime.enums.AnimeService;
import com.zetsubou_0.animelist.anime.enums.RestMethods;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.exception.AnimeTypeException;
import com.zetsubou_0.animelist.anime.exception.RequestInitConnectionException;
import com.zetsubou_0.animelist.anime.exception.RequestSendException;
import com.zetsubou_0.animelist.anime.helper.AnimeTypeServiceImpl;
import com.zetsubou_0.animelist.anime.helper.RequestHelper;
import com.zetsubou_0.animelist.anime.helper.RequestHelperImpl;
import com.zetsubou_0.animelist.anime.service.metadata.AnimeAnilist;
import org.apache.commons.lang3.StringUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by zetsubou_0 on 22.05.15.
 */
public class AnilistAction extends AbstractAction {
    private Token token;

    public AnilistAction() {
    }

    public AnilistAction(Action action) throws ActionException {
        super(action);
    }

    @Override
    public void perform() throws ActionException {
        throw new ActionException("\"perform()\" wasn't implemented");
    }

    /**
     * Search anime by query string
     * @param queryString title or other
     * @return Anime set
     */
    protected Set<Anime> searchAnime(String queryString) {
        Set<Anime> animeSet = new HashSet<>();

        try {
            RequestHelper helper = new RequestHelperImpl();

            Map<String, String> query = new HashMap<>();
            query.put(AnilistConstant.ACCESS_TOKEN, getToken().getAccessToken());

            Map<String, Object> initParams = new HashMap<>();
            initParams.put(RequestHelper.KEY_QUERY, query);
            initParams.put(RequestHelper.KEY_URL, AnilistConstant.BASE_URL + AnilistConstant.ANIME_SEARCH + correctQueryString(queryString));
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
        } catch (RequestInitConnectionException | RequestSendException | UnsupportedEncodingException e) {
            LOG.error(e.getMessage(), e);
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

        Map<String, Object> initParams = new HashMap<>();
        initParams.put(RequestHelper.KEY_QUERY, query);
        initParams.put(RequestHelper.KEY_URL, AnilistConstant.BASE_URL + AnilistConstant.AUTH_ACCESS_TOKEN);
        initParams.put(RequestHelper.KEY_METHOD, RestMethods.POST);

        Gson gson = new GsonBuilder().create();
        helper.init(initParams);

        synchronized(AnimeAnilist.class) {
            // return if token present
            if(token != null && StringUtils.isNotBlank(token.getAccessToken()) && now > token.getExpiresIn()) {
                AnimeAnilist.class.notifyAll();
                return token;
            }
            String response = helper.send();
            token = gson.fromJson(response, Token.class);
            AnimeAnilist.class.notifyAll();
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

        Map<String, Object> initParams = new HashMap<>();
        initParams.put(RequestHelper.KEY_QUERY, query);
        initParams.put(RequestHelper.KEY_URL, AnilistConstant.BASE_URL + AnilistConstant.ANIME_BY_ID + id);
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
        query = query.replaceAll("[!@#\\$%\\^&\\*\\)\\(]", "");
        return URLEncoder.encode(query, RequestHelper.DEFAULT_ENCODING);
    }
}
