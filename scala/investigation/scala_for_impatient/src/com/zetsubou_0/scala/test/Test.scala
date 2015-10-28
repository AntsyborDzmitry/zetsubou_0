package com.zetsubou_0.scala.test

import java.io.{FileInputStream, ObjectInputStream, FileOutputStream, ObjectOutputStream}

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object Test {
    def main (args: Array[String]): Unit = {
        val path = "d:\\temp\\00\\person.obj"

        val person = new Person("Nick White")
        val out = new ObjectOutputStream(new FileOutputStream(path))
        out.writeObject(person)
        out.close()
        val in = new ObjectInputStream(new FileInputStream(path))
        val readPerson = in.readObject().asInstanceOf[Person]
        in.close()
        println(readPerson.firstName)
        println(readPerson.lastName)
    }
}
