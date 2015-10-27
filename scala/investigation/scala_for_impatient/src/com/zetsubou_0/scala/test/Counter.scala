package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */
class Counter(private var value: Int) {
    Console.println("Counter value = " + {
        increment(); current
    })

    def increment() {
        value += 1
    }

    def current = value
}
