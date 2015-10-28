package com.zetsubou_0.scala.test

import java.io.File
import java.net.URL

import collection.immutable.StringOps

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object Test {
    val path = "d:/temp/00"

    def main (args: Array[String]): Unit = {
        val REG_EXP = new StringOps(""".*["].*""").r
        for (m <- REG_EXP.findAllIn("Name \"qwe\"")) {
            println(m)
        }
    }

    def script: Unit = {
        import sys.process._

        val dirName = "dirs"

        val file = new File(path + "/" + "dirs")
        val index = new File(path + "/index.html")

        "ls -al d:/temp/00" #| ("grep " + dirName) #> file !;
//        "grep dirs" #< file !
        index #< new URL("http://horstmann.com/index.html") !;
    }
}
