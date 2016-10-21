package com.zetsubou_0.java8.investigation.util;

import com.zetsubou_0.java8.investigation.bean.Transaction;

import java.util.*;

public class ListProducer {

    private static final List<String> CITIES = new ArrayList<>();
    static {
        CITIES.add("Belarus");
        CITIES.add("Russia");
        CITIES.add("USA");
        CITIES.add("Canada");
    }

    public static List<Transaction> generateTransactions(int size, List<String> cities) {
        List<Transaction> transactions = new LinkedList<>();
        cities = cities == null ? CITIES : cities;
        Random random = new Random();
        for (int i = 0; i < size; i++) {
            Transaction transaction = new Transaction();
            transaction.setId(i);
            transaction.setValue(random.nextInt(10000));
            transaction.setCity(cities.get(random.nextInt(cities.size() - 1)));
            transactions.add(transaction);
        }
        return transactions;
    }
}
