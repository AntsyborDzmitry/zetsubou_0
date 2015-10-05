package com.zetsubou_0.pattern.journaldev.visitor;

import com.zetsubou_0.pattern.journaldev.visitor.item.Book;
import com.zetsubou_0.pattern.journaldev.visitor.item.Fruit;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class ShoppingCartVisitorImpl implements ShoppingCartVisitor {
    @Override
    public int visit(Book book) {
        System.out.println(book);
        return (int) Math.ceil(book.getPrice() * (1 - book.getDiscountPercent() / 100));
    }

    @Override
    public int visit(Fruit fruit) {
        System.out.println(fruit);
        return fruit.getPrice() - fruit.getDiscount();
    }
}
