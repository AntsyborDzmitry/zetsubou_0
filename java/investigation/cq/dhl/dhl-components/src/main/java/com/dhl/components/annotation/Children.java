package com.dhl.components.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Children {

    /**
     * Expected type of models which all child resources will be mapped to. It
     * must be the same as used in generic type of the collection, or component
     * type for arrays.
     */
    Class<?> value();
}
