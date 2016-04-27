package uiversity.tasks.api;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public interface CustomReflection {
    double calculateMax(double val1, double val2) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException;

    void createFile(String className) throws ClassNotFoundException, IOException;

    List<String> methods(Object instance);

    Object invoke(Object instance, String methodName, Class[] types, Object[] arguments) throws Exception;
}
