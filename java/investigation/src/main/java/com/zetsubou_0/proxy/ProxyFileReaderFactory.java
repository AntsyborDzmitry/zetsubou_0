package com.zetsubou_0.proxy;

import com.zetsubou_0.proxy.api.FileReader;
import com.zetsubou_0.proxy.api.PersonInfo;
import com.zetsubou_0.proxy.bean.Person;

import java.io.Serializable;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class ProxyFileReaderFactory<T extends Serializable> implements InvocationHandler {
    private final FileReader fileReader;

    private ProxyFileReaderFactory(FileReader<T> fileReader) {
        this.fileReader = fileReader;
    }

    public static <V extends Serializable> FileReader<V> newInstance(FileReader<V> fileReader, Class<?> ... interfaces) {
        return (FileReader) Proxy.newProxyInstance(fileReader.getClass().getClassLoader(), interfaces, new ProxyFileReaderFactory(fileReader));
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (method.getName().startsWith("getInfo")) {
            fileReader.open(FileReader.PATH);
            PersonInfo<Person> personInfo = new PersonInfoImpl<Person>((Person) fileReader.read());
            fileReader.close();
            return personInfo.getInfo();
        }

        return method.invoke(fileReader, args);
    }
}
