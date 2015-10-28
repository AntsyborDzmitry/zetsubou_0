package com.zetsubou_0.scala.test

import collection.mutable.ArrayBuffer

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
class Bundle extends Item {
    val items: ArrayBuffer[Item] = new ArrayBuffer()

    override def price: Int = {
        items.foldLeft(0) { (x, y) =>
            x + y.price
        }
    }

    override def description: String = {
        items.foldLeft("") { (x, y) =>
            x + y.description + " "
        }
    }

    def add(item: Item): Unit = {
        items += item
    }

    def remove(item: Item): Unit = {
        items -= item
    }
}
