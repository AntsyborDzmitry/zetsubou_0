package com.zetsubou_0.pattern.journaldev.chainofresponsibility;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public interface Chain {
    void setNextChain(Chain chain);
    void perform(Integer amount) throws Exception;
}
