package com.zetsubou_0.proxy;

import com.zetsubou_0.proxy.api.FileReader;
import com.zetsubou_0.proxy.api.PersonInfo;
import com.zetsubou_0.proxy.bean.Person;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class Runner {

    public static void main(String[] args) {
        try {
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(new File(FileReader.PATH)));
            Person person = new Person();
            person.setName("somebody");
            person.setAge(22);
            out.writeObject(person);

            FileReader<Person> fileReader = ProxyFileReaderFactory.newInstance(new FileReaderImpl<Person>(), FileReader.class, PersonInfo.class);
            System.out.println("Info: " + fileReader.getInfo());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
