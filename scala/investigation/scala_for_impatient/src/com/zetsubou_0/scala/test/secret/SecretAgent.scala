package com.zetsubou_0.scala.test.secret

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
class SecretAgent(codename: String) extends Person(codename) {
    override val name = "secret" // Don’t want to reveal name . . .
    override val toString = "secret" // . . . or class name
}
