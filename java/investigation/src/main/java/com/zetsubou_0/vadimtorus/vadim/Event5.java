package com.zetsubou_0.vadimtorus.vadim;

class Event5 implements EventCount 
{
	private boolean mark1;
	private boolean mark2;
	private double mark3;
    final double successMark3 = 70;
	   
	   Event5(boolean mark1, boolean mark2, double mark3)
	   {
		this.mark1 = mark1;
		this.mark2 = mark2;
		this.mark3 = mark3;
	   }
	   @Override
	   public boolean result()
	   {
		return mark1 && mark2 && mark3 >= successMark3;
	   }
	   
	   @Override
	   public String toString()
	   {
	    return "Event5:" + " " + "Exam1 - " + mark1 + " " + "Exam2 - " + mark2 + " " + "Exam3 - " + mark3;
       }
       @Override
	   public Double maxMark()
	   {
		return mark3;
	   }
}