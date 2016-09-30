package com.zetsubou_0.vadimtorus.vadim;

class Event2 extends Event1
{
	   
	  public Event2(float exam1, float exam2)
	  {
		  super(exam1, exam2);
		  
	  }
	  
	  public boolean result()
	  {
		  return a >= 6 && b >= 7;
	  }
	  
	  @Override
	  public String toString()
	  {
	  return "Event2:" + " " + "Exam1:" + a + " " + "Exam2:" + b;
      }
}