package com.zetsubou_0.vadimtorus.vadim;

class Event2 extends Event1
{
    final double successMark1 = 6;
    final double successMark2 = 7;


    Event2(double mark1, double mark2)
	{
		super(mark1, mark2);

	}


	@Override
	public boolean result()
	{
		return getMark1() >= successMark1 && getMark2() >= successMark2;
	}

	@Override
	public String toString()
	{
		return "Event2:" + " " + "Exam1 - " + getMark1() + " " + "Exam2 - " + getMark2();
	}

	@Override
	public Double maxMark()
	{
		return getMark1() > getMark2() ? getMark1() : getMark2();
	}
}
