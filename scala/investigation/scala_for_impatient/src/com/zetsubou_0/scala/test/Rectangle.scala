package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
class Rectangle(width: Int, height: Int) extends Shape {
    override def centerPoint: Point = {
        new Point(width / 2, height / 2)
    }
}
