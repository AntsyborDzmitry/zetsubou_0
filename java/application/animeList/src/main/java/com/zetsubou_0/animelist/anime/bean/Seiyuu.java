package com.zetsubou_0.animelist.anime.bean;

import org.apache.jackrabbit.ocm.mapper.impl.annotation.Field;
import org.apache.jackrabbit.ocm.mapper.impl.annotation.Node;

/**
 * Created by zetsubou_0 on 21.04.15.
 */
@Node
public class Seiyuu {
    @Field
    private String firstName;
    @Field
    private String lastName;
    @Field
    private String originFirstName;
    @Field
    private String originLastName;

    @Field
    private String city;

    @Field(path = true)
    private String jcrPath;

    public String getName() throws Exception {
        if(lastName == null || firstName == null) {
            throw new Exception("Empty name. First name or last name is NULL");
        }
        StringBuilder sb = new StringBuilder();
        sb.append(lastName);
        sb.append(" ");
        sb.append(firstName);
        return sb.toString();
    }

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

        Seiyuu seiyuu = (Seiyuu) o;

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
        return result;
    }
}
