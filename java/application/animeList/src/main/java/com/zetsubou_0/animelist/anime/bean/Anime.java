package com.zetsubou_0.animelist.anime.bean;

import com.zetsubou_0.animelist.anime.enums.AnimeType;
import com.zetsubou_0.animelist.anime.jcr.AnimeTypeConverter;
import org.apache.jackrabbit.ocm.manager.collectionconverter.impl.MultiValueCollectionConverterImpl;
import org.apache.jackrabbit.ocm.mapper.impl.annotation.Collection;
import org.apache.jackrabbit.ocm.mapper.impl.annotation.Field;
import org.apache.jackrabbit.ocm.mapper.impl.annotation.Node;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by zetsubou_0 on 20.04.15.
 */
@Node
public class Anime {
    @Collection(collectionConverter = MultiValueCollectionConverterImpl.class)
    private Set<String> titles;
    @Collection(collectionConverter = MultiValueCollectionConverterImpl.class)
    private Set<String> genres;
    @Field
    private String description;
    @Field(converter = AnimeTypeConverter.class)
    private AnimeType type;
    @Field
    private Date startDate;
    @Field
    private Date endDate;

    @Collection(collectionConverter = MultiValueCollectionConverterImpl.class)
    private Set<String> images;

    @Field
    private String directedBy;
    @Field
    private String author;

    @Field
    private long episodesCount;
    @Field
    private long duration;

    @Collection(collectionConverter = MultiValueCollectionConverterImpl.class)
    private Set<Rating> rating;

    @Collection(collectionConverter = MultiValueCollectionConverterImpl.class)
    private Set<Seiyuu> seiyuuSet;

    @Field(path = true)
    private String jcrPath;

    public Anime() {
    }

    public Set<String> getTitles() {
        return titles;
    }

    public void setTitles(Set<String> titles) {
        this.titles = titles;
    }

    public Set<String> getGenres() {
        return genres;
    }

    public void setGenres(Set<String> genres) {
        this.genres = genres;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public long getEpisodesCount() {
        return episodesCount;
    }

    public void setEpisodesCount(long episodesCount) {
        this.episodesCount = episodesCount;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public AnimeType getType() {
        return type;
    }

    public void setType(AnimeType type) {
        this.type = type;
    }

    public String getDirectedBy() {
        return directedBy;
    }

    public void setDirectedBy(String directedBy) {
        this.directedBy = directedBy;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Set<Rating> getRating() {
        return rating;
    }

    public void setRating(Set<Rating> rating) {
        this.rating = rating;
    }

    public void addRating(Rating rating) {
        if(this.rating == null) {
            this.rating = new HashSet<Rating>();
        }
        this.rating.add(rating);
    }

    public Set<String> getImages() {
        return images;
    }

    public void setImages(Set<String> images) {
        this.images = images;
    }

    public Set<Seiyuu> getSeiyuuSet() {
        return seiyuuSet;
    }

    public void setSeiyuuSet(Set<Seiyuu> seiyuuSet) {
        this.seiyuuSet = seiyuuSet;
    }

    public String getJcrPath() {
        return jcrPath;
    }

    public void setJcrPath(String jcrPath) {
        this.jcrPath = jcrPath;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Anime anime = (Anime) o;

        if (duration != anime.duration) return false;
        if (episodesCount != anime.episodesCount) return false;
        if (author != null ? !author.equals(anime.author) : anime.author != null) return false;
        if (description != null ? !description.equals(anime.description) : anime.description != null) return false;
        if (directedBy != null ? !directedBy.equals(anime.directedBy) : anime.directedBy != null) return false;
        if (endDate != null ? !endDate.equals(anime.endDate) : anime.endDate != null) return false;
        if (genres != null ? !genres.equals(anime.genres) : anime.genres != null) return false;
        if (images != null ? !images.equals(anime.images) : anime.images != null) return false;
        if (rating != null ? !rating.equals(anime.rating) : anime.rating != null) return false;
        if (seiyuuSet != null ? !seiyuuSet.equals(anime.seiyuuSet) : anime.seiyuuSet != null) return false;
        if (startDate != null ? !startDate.equals(anime.startDate) : anime.startDate != null) return false;
        if (titles != null ? !titles.equals(anime.titles) : anime.titles != null) return false;
        if (type != anime.type) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = titles != null ? titles.hashCode() : 0;
        result = 31 * result + (genres != null ? genres.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (images != null ? images.hashCode() : 0);
        result = 31 * result + (directedBy != null ? directedBy.hashCode() : 0);
        result = 31 * result + (author != null ? author.hashCode() : 0);
        result = 31 * result + (int) (episodesCount ^ (episodesCount >>> 32));
        result = 31 * result + (int) (duration ^ (duration >>> 32));
        result = 31 * result + (rating != null ? rating.hashCode() : 0);
        result = 31 * result + (seiyuuSet != null ? seiyuuSet.hashCode() : 0);
        return result;
    }
}
