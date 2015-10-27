package com.zetsubou_0.scala.test

/**
 * Created by Kiryl_Lutsyk on 10/27/2015.
 */
class Account private(val id: Int, initialBalance: Int) {
    private var balance = initialBalance

    def deposit(value: Int): Unit = {
        balance += value;
    }

    def withdraw(value: Int): Int = {
        if (value <= balance) {
            balance -= value;
            Console.println("Available amount: " + balance)
            value
        } else {
            0
        }
    }
}

object Account {
    private var id = 0;

    def generateId: Int = {
        id += 1
        id
    }

    def apply(initBalance: Int) = {
        new Account(generateId, initBalance)
    }
}
