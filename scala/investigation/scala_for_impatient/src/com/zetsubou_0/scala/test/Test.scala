package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object Test {
    def main (args: Array[String]): Unit = {
        val item1: Item = new SimpleItem(400, "apple")
        Console.println(item1.price)
        Console.println(item1.description)
    }
}
