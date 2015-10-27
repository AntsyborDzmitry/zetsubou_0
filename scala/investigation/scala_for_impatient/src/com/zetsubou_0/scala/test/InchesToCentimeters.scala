package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
object InchesToCentimeters extends UnitConversion {
    override def inchesToCentimeters(v: Double): Double = {
        v * 0.23
    }
}