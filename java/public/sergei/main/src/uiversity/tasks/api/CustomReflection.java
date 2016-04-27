package uiversity.tasks.api;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public interface CustomReflection {
    double calculateMax(double val1, double val2) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException;

    void createFile(String className) throws ClassNotFoundException, IOException;

    <T extends Object> List<String> methods(T instance);

    <T extends Object> Object invoke(T instance, String methodName, Class[] types, Object[] arguments) throws Exception;
}
