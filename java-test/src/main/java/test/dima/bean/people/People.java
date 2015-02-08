package test.dima.bean.people;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public class People {
    private String firstName;
    private String lastName;
    private Birthday birthday;

    public People() {
    }

    public People(String firstName, String lastName, Birthday birthday) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
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

    public Birthday getBirthday() {
        return birthday;
    }

    public void setBirthday(Birthday birthday) {
        this.birthday = birthday;
    }
}
