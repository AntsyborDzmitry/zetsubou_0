package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */

class Person {
  private val MIN_AGE = 18
  private var privateAge = 0
  private val counter = new Counter(0)

  def this(age: Int) {
    this()
    privateAge = age
  }

  def age = privateAge

  def age_=(newValue: Int) {
    if (newValue > MIN_AGE) privateAge = newValue
  }

  def action(person: Person): Unit = {
    person.counter.increment()
    Console.println(person.counter.current)
  }
}
