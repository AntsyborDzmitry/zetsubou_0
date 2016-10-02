package com.zetsubou_0.vadimtorus.vadim;

class Event4 extends Event1
{
	   private double mark3;
	   final double totalScore = 25;

	    
		Event4(double mark1, double mark2, double mark3)
		{
		  super(mark1, mark2);
		  this.mark3 = mark3;
		}
	    @Override
		public boolean result()
		{
		  return (getMark1() + getMark2() + mark3) >= totalScore;
	    }
	   
	   @Override
	   public String toString()
	   {
	    return "Event4:" + " " + "Exam1 - " + getMark1() + " " + "Exam2 - " + getMark2() + " " + "Exam3 - " + mark3;
       }

	   @Override
	   public Double maxMark() {
		Double max;
		max = (getMark1() > getMark2()) ? getMark1() : getMark2();
		return max > mark3 ? max : mark3;
	}
}