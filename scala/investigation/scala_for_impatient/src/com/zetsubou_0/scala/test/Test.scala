package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object Test {
    def main (args: Array[String]) {
        val account = Account(50)
        Console.println(account.withdraw(23))
    }
}
