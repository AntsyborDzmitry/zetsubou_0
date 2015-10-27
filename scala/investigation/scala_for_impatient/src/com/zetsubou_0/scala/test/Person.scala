package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */

class Person(private[this] val name: String) {
    private val MIN_AGE = 18
    private var privateAge = 0
    private val counter = new Counter(0)
    private[this] val names: Array[String] = name.split(" ")

    def firstName = names(0)

    def lastName = names(1)

    def age = privateAge

    def age_=(newValue: Int) {
        if (newValue > MIN_AGE) privateAge = newValue
    }

    def action(person: Person): Unit = {
        person.counter.increment()
        Console.println(person.counter.current)
    }
}
