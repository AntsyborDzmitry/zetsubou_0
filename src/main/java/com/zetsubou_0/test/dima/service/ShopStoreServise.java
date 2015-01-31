package com.zetsubou_0.test.dima.service;

import com.zetsubou_0.test.dima.bean.item.Product;
import com.zetsubou_0.test.dima.bean.people.Client;
import com.zetsubou_0.test.dima.exception.OrderException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public class ShopStoreServise implements StoreService {
    private Map<Client, List<Product>> orderBook;

    public ShopStoreServise() {
        orderBook = new HashMap<Client, List<Product>>();
    }

    @Override
    public void order(Client client, Product product) throws OrderException {
        // verify client - new or not
        if(orderBook.containsKey(client)) {
            List<Product> orders = orderBook.get(client);
            orders.add(product);
        } else {
            // create new order record for client
            List<Product> orders = new ArrayList<Product>();
            orders.add(product);
            orderBook.put(client, orders);
        }
    }

    @Override
    public void printOrders() {
        StringBuilder stringBuilder = new StringBuilder();
        for(Client client : orderBook.keySet()) {
            stringBuilder.append(client.getFirstName());
            stringBuilder.append(" ");
            stringBuilder.append(client.getLastName());
            stringBuilder.append(":\n");

            List<Product> orders = orderBook.get(client);
            for(Product product : orders) {
                stringBuilder.append("\t");
                stringBuilder.append("Product: ");
                stringBuilder.append(product.getName());
                stringBuilder.append("\n\t");
                stringBuilder.append("Track code: ");
                stringBuilder.append(product.getTrackCode());
                stringBuilder.append("\n\t");
                stringBuilder.append("Cost: ");
                stringBuilder.append(product.getCost());
                stringBuilder.append(" RUB\n\n");
            }
        }

        System.out.println(stringBuilder);
    }
}
