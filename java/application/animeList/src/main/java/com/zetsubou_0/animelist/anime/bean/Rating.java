package com.zetsubou_0.animelist.anime.bean;

import com.zetsubou_0.animelist.anime.enums.AnimeService;

/**
 * Created by zetsubou_0 on 21.04.15.
 */
public class Rating {
    private AnimeService source;
    private double score;
    private long voiceCount;
    private long position;

    public AnimeService getSource() {
        return source;
    }

    public void setSource(AnimeService source) {
        this.source = source;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public long getVoiceCount() {
        return voiceCount;
    }

    public void setVoiceCount(long voiceCount) {
        this.voiceCount = voiceCount;
    }

    public long getPosition() {
        return position;
    }

    public void setPosition(long position) {
        this.position = position;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Rating rating = (Rating) o;

        if (position != rating.position) return false;
        if (Double.compare(rating.score, score) != 0) return false;
        if (voiceCount != rating.voiceCount) return false;
        if (source != null ? !source.equals(rating.source) : rating.source != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return source != null ? source.hashCode() : 0;
    }
}
