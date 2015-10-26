package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/26/2015.
 */
class BankAccount(val name: String) {
  private var balanceValue: Int = 0

  def deposit(value: Int): Unit = {
    balanceValue += value;
  }

  def withdraw(value: Int): Int = {
    if(value <= balanceValue) {
      balanceValue -= value;
      value
    } else {
      0
    }
  }

  def balance = balanceValue;
}
