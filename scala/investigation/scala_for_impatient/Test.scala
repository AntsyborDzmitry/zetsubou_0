var sum: Int = 0;
for (ch <- "Hello world") {
  println("ch = " + ch);
  sum += ch;
}
println(sum);