package dima.service;

import com.zetsubou_0.test.dima.bean.item.Product;
import com.zetsubou_0.test.dima.bean.people.Client;
import com.zetsubou_0.test.dima.exception.OrderException;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public interface StoreService {
    void order(Client client, Product product) throws OrderException;
    void printOrders();
}
