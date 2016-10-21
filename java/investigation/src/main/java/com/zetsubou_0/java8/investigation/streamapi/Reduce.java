package com.zetsubou_0.java8.investigation.streamapi;

import com.zetsubou_0.java8.investigation.bean.Transaction;
import com.zetsubou_0.java8.investigation.util.ListProducer;

import java.util.List;

public class Reduce {

    public static void main(String[] args) {
        List<Transaction> transactions = ListProducer.generateTransactions(10, null);
        transactions.stream().forEach(System.out::println);

        int reduceSum = transactions.stream()
                .filter(Reduce::transactionsFilter)
                .map(Transaction::getValue)
                .reduce(0, Integer::sum);
        System.out.println(reduceSum);
    }

    private static boolean transactionsFilter(final Transaction transaction) {
        return transaction.getValue() > 7000;
    }
}
