package com.zetsubou_0.scala.test

import java.io.{FileOutputStream, File}

import io.Source
import collection.immutable.StringOps

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
class FileTabReplace(path: String, count: Int) {
    val file = new File(path)
    val fileSource = Source.fromFile(file, "UTF-8")

    def change: Unit = {
        var read = 0;
        val str: String = fileSource.mkString.split("\t").map((s) => {
            if (read < count) {
                read += 1
                s
            } else {
                ""
            }
        }).filter(new StringOps(_).nonEmpty).mkString(" ")
        fileSource.close()

        val out = new FileOutputStream(file)
        out.write(str.getBytes)
        out.close()
    }

    def change2: Unit = {
        var read = 0;
        val bytes: Array[Byte] = (for (x <- fileSource) yield {
            if (read < count) {
                if('\t'.equals(x)) {
                    read += 1
                    ' '.toByte
                } else {
                    x.toByte
                }
            } else {
                '\u0000'.toByte
            }
        }).toArray
        fileSource.close()

        val out = new FileOutputStream(new File(file.getPath + "2"))
        out.write(bytes)
        out.close()
    }
}

object FileTabReplace {
    def apply(path: String, count: Int) = {
        new FileTabReplace(path, count)
    }
}
