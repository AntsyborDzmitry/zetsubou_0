package com.zetsubou_0.vadimtorus.vadim;

class Event1 implements EventCount 
{
 float a;
 float b;

	public Event1(float exam1, float exam2)
	 {
	  a = exam1;
	  b = exam2;
	 }
	
	public boolean result()
	{
	 return (a+b) >= 15;
	}
	
	@Override
	public String toString()
    {
	  return "Event1:" + " " + "Exam1 - " + a + " " + "Exam2 - " + b;
    }

	public Float maxMark()
	{
		return a>b ? a:b;
	}
}
 
  
 