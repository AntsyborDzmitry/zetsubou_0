package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */
class Network(val name: String) { outer =>
  class Member(val name: String) {
    def description = {
      "Member name = " + name + ", name = " + outer.name
    }
  }

  val member = new Member("Member " + name)
}
