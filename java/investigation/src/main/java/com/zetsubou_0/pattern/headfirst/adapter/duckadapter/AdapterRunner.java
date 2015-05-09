package com.zetsubou_0.pattern.headfirst.adapter.duckadapter;

import com.zetsubou_0.pattern.headfirst.adapter.duckadapter.adpter.DuckAdapter;
import com.zetsubou_0.pattern.headfirst.adapter.duckadapter.bean.DefaultDuck;
import com.zetsubou_0.pattern.headfirst.adapter.duckadapter.bean.Duck;
import com.zetsubou_0.pattern.headfirst.adapter.duckadapter.bean.Turkey;
import com.zetsubou_0.pattern.headfirst.strategy.simuduck.fly.WingsFly;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 1/15/2015.
 *
 * The Adapter Pattern converts the interface of a class
 * into another interface the clients expect. Adapter lets
 * classes work together that couldn’t otherwise because of
 * incompatible interfaces.
 *
 */
public class AdapterRunner {
    public static void main(String[] args) {
        List<Duck> ducks = new ArrayList<Duck>();
        ducks.add(new DefaultDuck());
        ducks.add(new DuckAdapter(new Turkey(new WingsFly())));

        for(Duck duck : ducks) {
            System.out.println(duck);
            duck.move();
            duck.performedFly();
            duck.performedQuack();
            System.out.println();
        }
    }
}
