import com.zetsubou_0.scala.test._

//var a: Array[Int] = Array(-24, -9, -20, 13, 24, 7, -6, -13, -21, 1, 6, 2, -6, -13, -19, -2, 11, 20, 2, -17, 29, 14, 19, 8, 3, 0, -2, -21, 23, 14);
//a.filter(_ > 0).toBuffer ++= a.filter(_ <= 0)
//
//
//val str = Array("<", "=", ">")
//val num = Array(2, 10, 2)
//for ((k, v) <- str.zip(num)) {
//  print(k * v)
//}
//
//
//java.util.TimeZone.getAvailableIDs.
//  filter(_.startsWith("America")).
//  map(_.diff("America/")).
//  sorted
//
//
//val prices = Map("a" -> 100.0, "b" -> 250.0, "c" -> 80.50)
//// scala.collection.immutable.Map[String,Double] = Map(a -> 90.0, b -> 225.0, c -> 72.45)
//val pricesDiscount = for ((k, v) <- prices) yield (k, v * 0.9)
//
//val in = new java.util.Scanner(new java.io.File("d:\\temp\\scala\\incomplete"))
//val m: scala.collection.mutable.Map[String, Int] = scala.collection.mutable.Map()
//while (in.hasNext) {
//  val word: String = in.next;
//  m += (word -> (m.getOrElse(word, 0) + 1))
//}
//in.close()
//m

val account = Account(100)
Console.println(account.withdraw(10))
Console.println(account.withdraw(20))