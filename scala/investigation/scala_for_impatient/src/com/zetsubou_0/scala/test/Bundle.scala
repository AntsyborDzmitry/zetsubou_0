package com.zetsubou_0.scala.test

import collection.mutable.ArrayBuffer

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
class Bundle extends Item {
    val items: ArrayBuffer[Item] = ArrayBuffer[Item]

    override def price: Int = {0}

    override def description: String = {""}

    def add(item: Item): Unit = {
        items += item
    }
}
