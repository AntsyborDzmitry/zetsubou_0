package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
class LabelPoint(label: String, x: Int, y: Int) extends Point(x, y) {

}

object LabelPoint {
    def apply(label: String, x: Int, y: Int) = {
        new LabelPoint(label, x, y)
    }
}
