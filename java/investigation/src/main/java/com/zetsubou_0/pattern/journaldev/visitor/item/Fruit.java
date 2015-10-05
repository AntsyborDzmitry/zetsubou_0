package com.zetsubou_0.pattern.journaldev.visitor.item;

import com.zetsubou_0.pattern.journaldev.visitor.ShoppingCartVisitor;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class Fruit implements Item {
    private int price;
    private int discount;
    private String name;

    public Fruit(String name, int price, int discount) {
        this.price = price;
        this.discount = discount;
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public int getDiscount() {
        return discount;
    }

    @Override
    public int accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }

    @Override
    public String toString() {
        return name + ": " + price + "[" + discount + "]";
    }
}
