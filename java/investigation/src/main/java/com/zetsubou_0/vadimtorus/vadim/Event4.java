package com.zetsubou_0.vadimtorus.vadim;

class Event4 extends Event1 
{
	   float c;
	    
		public Event4(float exam1, float exam2, float exam3)
		{
		  super(exam1, exam2);
		  c = exam3;
		}
	    
		public boolean result()
		{
		  return (a+b+c) >= 25;
	    }
	   
	   @Override
	   public String toString()
	   {
	    return "Event4:" + " " + "Exam1:" + a + " " + "Exam2:" + b + " " + "Exam3" + c;
       }
} 