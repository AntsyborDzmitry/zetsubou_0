package com.zetsubou_0.gc;

/**
 * Created by Kiryl_Lutsyk on 12/22/2014.
 */
public class Runnner {
    public static void main(String[] args) {
//        List<User> list = new ArrayList<User>(100000);
//        while(true) {
//            Birthday b = generateBirthday();
//            User u = generateUser();
//            Birthday b2 = generateBirthday();
//            User u2 = generateUser();
//
//            list.add(generateUser());
//        }

//        List<SoftReference<User>> softList = new ArrayList<SoftReference<User>>(100000);
//        while(true) {
//            User user = generateUser();
//            SoftReference<User> softReference = new SoftReference<User>(user);
//            softList.add(softReference);
//        }

//        List<WeakReference<User>> weakList = new ArrayList<WeakReference<User>>(100000);
//        while(true) {
//            User user = generateUser();
//            WeakReference<User> weakReference = new WeakReference<User>(user);
//            weakList.add(weakReference);
//        }
    }

    private static Birthday generateBirthday() {
        return new Birthday(
                (int) (Math.random() * 2014), (int) (Math.random() * 12), (int) (Math.random() * 31)
        );
    }

    private static User generateUser() {
        return new User(
                "" + Math.random(), "" + Math.random(), (int)(Math.random() * 70), generateBirthday()
        );
    }
}
