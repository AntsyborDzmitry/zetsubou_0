package com.zetsubou_0.pattern.journaldev.interpreter;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class MultiLanguageGreeting implements GreetingInterpreter {

    @Override
    public void sayHello(String name) {
        StringBuilder greeting = new StringBuilder();
        GreetingType type = GreetingType.ENG;

        for(char ch : name.toCharArray()) {
            if(name.charAt(0) >= (int)'А' && name.charAt(0) <= (int)'я') {
                type = GreetingType.RUS;
            } else {
                type = GreetingType.ENG;
                break;
            }
        }

        greeting.append(GreetingType.getGreeting(type));
        greeting.append(name);

        System.out.println(greeting.toString());
    }
}
