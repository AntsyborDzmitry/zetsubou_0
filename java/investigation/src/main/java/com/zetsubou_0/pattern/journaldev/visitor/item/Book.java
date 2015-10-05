package com.zetsubou_0.pattern.journaldev.visitor.item;

import com.zetsubou_0.pattern.journaldev.visitor.ShoppingCartVisitor;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class Book implements Item {
    private int price;
    private double discountPercent;
    private String name;

    public Book(String name, int price, double discountPercent) {
        this.price = price;
        this.discountPercent = discountPercent;
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public double getDiscountPercent() {
        return discountPercent;
    }

    @Override
    public int accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }

    @Override
    public String toString() {
        return name + ": " + price + "[" + discountPercent + "%]";
    }
}
