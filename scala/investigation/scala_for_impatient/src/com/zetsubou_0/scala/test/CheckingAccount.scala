package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
class CheckingAccount(name: String) extends BankAccount(name){
    private val SERVICE_COST = 1;

    override def deposit(v: Int): Unit = {
        super.deposit(v - SERVICE_COST)
    }

    override def withdraw(v: Int): Int = {
        super.withdraw(v - SERVICE_COST)
    }
}
