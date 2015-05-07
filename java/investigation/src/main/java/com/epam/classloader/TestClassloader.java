package com.epam.classloader;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by Kiryl_Lutsyk on 12/15/2014.
 */
public class TestClassloader extends ClassLoader {
    private final String DEFAULT_PATH = "/d:/temp/java/";
    private final String EXT = ".class";
    private String path;

    public TestClassloader(ClassLoader parent, String path) {
        super(parent);
        this.path = path;
    }

    public TestClassloader(String path) {
        this(TestClassloader.class.getClassLoader(), path);
    }

    public TestClassloader(ClassLoader parent) {
        super(parent);
    }

    public TestClassloader() {
        this(TestClassloader.class.getClassLoader());
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        Class<?> c = findLoadedClass(name);
        if(c != null) {
            return c;
        }

        try {
            URL url = new URL("file", "localhost", getFilePath(name));
            c = getaClassFromUrl(name, url);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return c;
    }

    private String getFilePath(String name) {
        StringBuilder sb = new StringBuilder();
        sb.append((path != null) ? path : DEFAULT_PATH);
        sb.append(name.replace(".", "/"));
        sb.append(EXT);
        return sb.toString();
    }

    private Class<?> getaClassFromUrl(String name, URL url) throws IOException {
        URLConnection urlConnection = url.openConnection();
        InputStream in = urlConnection.getInputStream();
        int length = in.available();
        byte[] bytes = new byte[length];
        in.read(bytes);
        return defineClass(name, bytes, 0, length);
    }

}
