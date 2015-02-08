package dima;

import com.zetsubou_0.test.dima.bean.item.Card;
import com.zetsubou_0.test.dima.bean.item.Product;
import com.zetsubou_0.test.dima.bean.people.Birthday;
import com.zetsubou_0.test.dima.bean.people.Client;
import com.zetsubou_0.test.dima.exception.OrderException;
import com.zetsubou_0.test.dima.service.ShopStoreServise;
import com.zetsubou_0.test.dima.service.StoreService;

/**
 * Created by zetsubou_0 on 31.1.15.
 *
 * This is simple test class.
 * Representation of shop working.
 *
 */
public class Shop {
    public static void main(String[] args) {
        // create client base
        Card kirylCard = new Card();
        Birthday kirylBirtday = new Birthday(1988, 1, 22);
        Client kiryl = new Client("Kiryl", "Lutsyk", kirylBirtday, kirylCard);

        Card dimaCard = new Card();
        Birthday dimaBirtday = new Birthday(1989, 5, 11);
        Client dima = new Client("Dima", "Tsygankov", dimaBirtday, dimaCard);


        // some products
        Product milk = new Product();
        milk.setName("milk");
        milk.setTrackCode(1);
        milk.setCost(300);

        Product bread = new Product();
        bread.setName("bread");
        bread.setTrackCode(2);
        bread.setCost(100);

        // create shop
        StoreService shop = new ShopStoreServise();
        try {
            shop.order(dima, milk);
            shop.order(kiryl, milk);
            shop.order(dima, bread);
        } catch (OrderException e) {
            System.err.println("Something wrong!");
            e.printStackTrace();
        }

        // display orders
        shop.printOrders();
    }
}
