package com.zetsubou_0.pattern.journaldev.visitor;

import com.zetsubou_0.pattern.journaldev.visitor.item.Book;
import com.zetsubou_0.pattern.journaldev.visitor.item.Fruit;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public interface ShoppingCartVisitor {
    int visit(Book book);
    int visit(Fruit fruit);
}
