package com.zetsubou_0.lyambda;

import com.zetsubou_0.lyambda.api.ConstantGetter;
import com.zetsubou_0.lyambda.api.Operation;
import com.zetsubou_0.lyambda.api.StringAction;

/**
 * Created by zetsubou_0 on 14.03.16.
 */
public class Lyambda {

    public static void main(String[] args) {
        ConstantGetter constantGetter = () -> 123;
        System.out.println(constantGetter.defaultNumber());
        System.out.println(constantGetter.getNumber());

        Operation operation = (x, y) -> x / y;
        System.out.println(operation.doAction(10, 2.5));

        StringAction action = StringOperations::upper;
        System.out.println(action.operation("lower"));
        System.out.println(invoke("UPPER", StringOperations::first));
    }

    public static String invoke(final String string, final StringAction stringAction) {
        return stringAction.operation(string);
    }
}
