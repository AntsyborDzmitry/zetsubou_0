package com.zetsubou_0.wallpaper.runner.test;

import com.zetsubou_0.wallpaper.core.WallpaperChanger;
import com.zetsubou_0.wallpaper.core.WallpaperChangerWindows;

/**
 * Created by zetsubou_0 on 06.05.15.
 */
public class Main {
    public static void main(String[] args) {
        WallpaperChanger wc = new WallpaperChangerWindows();
        wc.changeWallpaper("http://i.ytimg.com/vi/pHKZccQy_cg/maxresdefault.jpg");
    }
}
