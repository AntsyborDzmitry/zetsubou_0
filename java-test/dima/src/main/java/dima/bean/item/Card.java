package dima.bean.item;

import com.zetsubou_0.test.dima.bean.people.Client;
import com.zetsubou_0.test.dima.bean.people.People;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public class Card {
    private People owner;
    private int uniqueNumber;

    public Card() {
        this(new Client(), (int) (Math.random() * Integer.MAX_VALUE));
    }

    public Card(People owner, int uniqueNumber) {
        this.owner = owner;
        this.uniqueNumber = uniqueNumber;
    }

    public int getUniqueNumber() {
        return uniqueNumber;
    }
}
