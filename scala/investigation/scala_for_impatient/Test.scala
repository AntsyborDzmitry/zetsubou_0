var a: Array[Int] = Array(-24, -9, -20, 13, 24, 7, -6, -13, -21, 1, 6, 2, -6, -13, -19, -2, 11, 20, 2, -17, 29, 14, 19, 8, 3, 0, -2, -21, 23, 14);
a.filter(_ > 0).toBuffer ++= a.filter(_ <= 0)