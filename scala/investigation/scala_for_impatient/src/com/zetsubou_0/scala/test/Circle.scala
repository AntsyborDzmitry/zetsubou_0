package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
class Circle(r: Int) extends Shape {
    override def centerPoint: Point = {
        new Point(r, r)
    }
}
