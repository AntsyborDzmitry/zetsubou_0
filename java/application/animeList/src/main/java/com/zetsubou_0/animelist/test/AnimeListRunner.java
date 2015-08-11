package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.controller.Controller;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeListRunner {
    public static void main(String[] args) {
        new Thread(new Controller()).start();
    }
}
