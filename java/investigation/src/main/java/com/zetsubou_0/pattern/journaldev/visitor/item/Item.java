package com.zetsubou_0.pattern.journaldev.visitor.item;

import com.zetsubou_0.pattern.journaldev.visitor.ShoppingCartVisitor;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public interface Item {
    int accept(ShoppingCartVisitor visitor);
}
