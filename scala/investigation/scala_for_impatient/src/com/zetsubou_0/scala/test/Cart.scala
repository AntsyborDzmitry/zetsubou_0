package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
class Cart(val suit: String) {

}

object Cart extends Enumeration {
    val RHOMBUS = Value("♦")
    val SPADES = Value("♠")

    def isRed(cart: Cart): Boolean = {
        if (cart.suit.toLowerCase.equals("red")) true else false
    }
}

