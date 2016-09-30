package com.zetsubou_0.vadimtorus.vadim;

class Event5 implements EventCount 
{
	boolean a;
	boolean b;
	float c;
	   
	   public Event5(boolean exam1, boolean exam2, float exam3)
	   {
		a = exam1;
		b = exam2;
		c = exam3;
	   }
	   
	   public boolean result()
	   {
		return a == true && b == true && c >= 70;
	   }
	   
	   @Override
	   public String toString()
	   {
	    return "Event5:" + " " + "Exam1:" + a + " " + "Exam2:" + b + " " + "Exam3:" + c;
       }
}