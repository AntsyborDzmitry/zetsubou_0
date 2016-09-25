package com.zetsubou_0.game.golf2d.ui;

import org.newdawn.slick.*;

public class Golf extends BasicGame {

    public Golf(final String title) {
        super(title);
    }

    public static void main(String[] args) {
        try {
            runApplication();
        } catch (SlickException e) {
            // TODO: 25.09.16 logging or error window
            e.printStackTrace();
        }
    }

    private static void runApplication() throws SlickException {
        AppGameContainer app = new AppGameContainer(new Golf("Golf 2D"));
        app.setDisplayMode(800, 600, false);
        app.start();
    }

    public void init(final GameContainer gameContainer) throws SlickException {
        gameContainer.setShowFPS(true);
    }

    public void update(final GameContainer gameContainer, final int i) throws SlickException {

    }

    public void render(final GameContainer gameContainer, final Graphics graphics) throws SlickException {

    }
}
