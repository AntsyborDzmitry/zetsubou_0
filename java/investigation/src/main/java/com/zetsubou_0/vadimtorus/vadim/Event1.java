package com.zetsubou_0.vadimtorus.vadim;

class Event1 implements EventCount 
{
 private double mark1;
 private double mark2;
 final double totalScore = 15;

	 Event1(double mark1, double mark2)
	 {
	  this.mark1 = mark1;
	  this.mark2 = mark2;
	 }

	double getMark1()
	 {
	  return mark1;
	 }

	public void setMark1(double a)
     {
	  this.mark1 = a;
	 }

	double getMark2()
	{
		return mark2;
	}

	public void setMark2(double b)
	{
		this.mark2 = b;
	}

	@Override
	public boolean result()
	{
	 return (mark1+mark2) >= totalScore;
	}
	
	@Override
	public String toString()
    {
	  return "Event1:" + " " + "Exam1 - " + mark1 + " " + "Exam2 - " + mark2;
    }
    @Override
	public Double maxMark()
	{
		return mark1>mark2 ? mark1:mark2;
	}
}
 
  
 