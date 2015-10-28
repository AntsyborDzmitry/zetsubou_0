package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object Test {
    def main (args: Array[String]): Unit = {
        val item1 = new SimpleItem(400, "apple")
        Console.println(item1.price)
        Console.println(item1.description)
        val item2 = new SimpleItem(350, "banana")
        Console.println(item2.price)
        Console.println(item2.description)
        val item3 = new Bundle()
        item3.add(item1)
        item3.add(item2)
        item3.add(item2)
        Console.println(item3.price)
        Console.println(item3.description)
    }
}
