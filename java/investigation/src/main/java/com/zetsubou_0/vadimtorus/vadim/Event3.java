package com.zetsubou_0.vadimtorus.vadim;

class Event3 extends Event2
{
		boolean c;
	     
		 public Event3(float exam1, float exam2, boolean exam3)
		 {
		  super(exam1, exam2);		 
		  c = exam3;
		 } 
	    
		public boolean result()
		{
		 return a >= 7.5 && b >= 8.5 && c == true;
		}
		
		@Override
		public String toString()
		{
	     return "Event3:" + " " + "Exam1:" + a + " " + "Exam2:" + b + " " + "Exam3:" + c;
        }
} 