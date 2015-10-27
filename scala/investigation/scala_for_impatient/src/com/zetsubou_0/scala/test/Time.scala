package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */
class Time(val h: Int, val m: Int) {
    if ((h < 0 || h > 23) && (m < 0 || m > 59)) throw new IllegalArgumentException()

    def before(other: Time): Boolean = {
        other.minutes - minutes > 0
    }

    private def minutes = {
        h * 100 + m
    }
}
