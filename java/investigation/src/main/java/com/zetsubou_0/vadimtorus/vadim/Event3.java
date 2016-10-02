package com.zetsubou_0.vadimtorus.vadim;

	class Event3 extends Event2
	{
		private boolean mark3;
        final double successMark1 =  7.5;
        final double successMark2 =  8.5;

		    Event3(double mark1, double mark2, boolean mark3)
				 {
				  super(mark1, mark2);

					this.mark3 = mark3;
				 }


		    @Override
			public boolean result()
				{
				 return getMark1() >= successMark1 && getMark2() >= successMark2 && mark3;
				}

			@Override
			public String toString()
				{
				 return "Event3:" + " " + "Exam1 - " + getMark1() + " " + "Exam2 - " + getMark2() + " " + "Exam3 - " + mark3;
				}

		    @Override
			public Double maxMark()
			    {
				 return getMark1() > getMark2() ? getMark1() : getMark2();
			    }
	}