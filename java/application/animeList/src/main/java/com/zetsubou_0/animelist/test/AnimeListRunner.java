package com.zetsubou_0.animelist.test;

import com.zetsubou_0.animelist.anime.action.Action;
import com.zetsubou_0.animelist.anime.action.JcrRead;
import com.zetsubou_0.animelist.anime.exception.ActionException;
import com.zetsubou_0.animelist.anime.observer.Listener;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class AnimeListRunner implements Listener {
    public static void main(String[] args) {
        new AnimeListRunner().process();

        System.out.println("Complete");
    }

    public void process() {
//        try {
//            AnimeData fileSystem = new AnimeFileSystem();
//            Action read = new ReadAnimeDirectory();
//            fileSystem.pullData(read);
//
//            AnimeData aniList = new AnimeAnilist();
//            Action write = new WriteJsonFile(read);
//            Map<String, Object> params = new HashMap<>();
//            params.put(ActionConstant.Observer.LISTENER, this);
//            write.addParams(params);
//            aniList.pullData(write);
//
//            // wait all threads
//            synchronized(AnimeListRunner.class) {
//                AnimeListRunner.class.wait(TimeUnit.MINUTES.toMillis(5));
//            }
//        } catch (ActionException e) {
//            e.printStackTrace();
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        Action jcrRead = new JcrRead();
        try {
            jcrRead.perform();
        } catch (ActionException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void performAction() {
        synchronized(AnimeListRunner.class) {
            AnimeListRunner.class.notifyAll();
            System.out.println("All process was finished successfully");
        }
    }
}
