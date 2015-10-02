package com.zetsubou_0.pattern.journaldev.chainofresponsibility;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public abstract class AbstractChain implements Chain {
    protected int defaultAmount = 1;
    protected Chain nextChain;

    @Override
    public void setNextChain(Chain nextChain) {
        this.nextChain = nextChain;
    }

    @Override
    public void perform(Integer amount) throws Exception{
        int val = amount;
        int count = val / defaultAmount;
        int rest = val % defaultAmount;
        if(count > 0) {
            System.out.println("Count of \"" + defaultAmount + "\" is " + count);
        }
        if(rest > 0) {
            if(nextChain == null) {
                throw new IllegalArgumentException("Not valid value");
            } else {
                nextChain.perform(rest);
            }
        }
    }
}
