package com.zetsubou_0.animelist.anime.bean;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by zetsubou_0 on 21.04.15.
 */
public class Seiyuu {
    private String firstName;
    private String lastName;
    private String originFirstName;
    private String originLastName;

    private String city;

    private Set<Anime> anime;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getOriginFirstName() {
        return originFirstName;
    }

    public void setOriginFirstName(String originFirstName) {
        this.originFirstName = originFirstName;
    }

    public String getOriginLastName() {
        return originLastName;
    }

    public void setOriginLastName(String originLastName) {
        this.originLastName = originLastName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Set<Anime> getAnime() {
        return anime;
    }

    public void setAnime(Set<Anime> anime) {
        this.anime = anime;
    }

    public void addAnime(Anime anime) {
        if(this.anime == null) {
            this.anime = new HashSet<Anime>();
        }
        this.anime.add(anime);
    }

    public void removeAnime(Anime anime) {
        if(this.anime != null) {
            this.anime.remove(anime);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Seiyuu seiyuu = (Seiyuu) o;

        if (anime != null ? !anime.equals(seiyuu.anime) : seiyuu.anime != null) return false;
        if (city != null ? !city.equals(seiyuu.city) : seiyuu.city != null) return false;
        if (firstName != null ? !firstName.equals(seiyuu.firstName) : seiyuu.firstName != null) return false;
        if (lastName != null ? !lastName.equals(seiyuu.lastName) : seiyuu.lastName != null) return false;
        if (originFirstName != null ? !originFirstName.equals(seiyuu.originFirstName) : seiyuu.originFirstName != null)
            return false;
        if (originLastName != null ? !originLastName.equals(seiyuu.originLastName) : seiyuu.originLastName != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = firstName != null ? firstName.hashCode() : 0;
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + (originFirstName != null ? originFirstName.hashCode() : 0);
        result = 31 * result + (originLastName != null ? originLastName.hashCode() : 0);
        result = 31 * result + (city != null ? city.hashCode() : 0);
        result = 31 * result + (anime != null ? anime.hashCode() : 0);
        return result;
    }
}
