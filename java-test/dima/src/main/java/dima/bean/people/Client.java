package dima.bean.people;

import com.zetsubou_0.test.dima.bean.item.Card;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public class Client extends People {
    private Card card;

    public Client() {
    }

    public Client(String firstName, String lastName, Birthday birthday, Card card) {
        super(firstName, lastName, birthday);
        this.card = card;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }
}
