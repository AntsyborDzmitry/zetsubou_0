package uiversity.tasks.impl;

import uiversity.tasks.api.CustomReflection;

import java.io.IOException;
import java.lang.reflect.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;

public class CustomReflectionImpl implements CustomReflection {

    private static final String MAX_METHOD = "max";

    @Override
    public double calculateMax(final double val1, final double val2)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Method method = Math.class.getMethod(MAX_METHOD, double.class, double.class);
        return (double) method.invoke(null, val1, val2);
    }

    @Override
    public void createFile(final String className) throws ClassNotFoundException, IOException {
        String name = className.replaceAll(".+[.]", "");
        Class cl = Class.forName(className);

        Path path = Paths.get(name + ".java");
        List<String> lines = new LinkedList<>();

        lines.add(Modifier.toString(cl.getModifiers()) + " class " + name + " {");
        appendFieldInfo(cl, lines);
        appendConstructorInfo(cl, lines);
        appendMethodInfo(cl, lines);
        lines.add("}");

        Files.write(path, lines);
    }

    @Override
    public List<String> methods(final Object instance) {
        List<String> methods = new LinkedList<>();
        Class cl = instance.getClass();
        for (Method method : cl.getDeclaredMethods()) {
            methods.add(method.getName());
        }
        return methods;
    }

    @Override
    public Object invoke(final Object instance, final String methodName,
                             final Class[] types, final Object[] arguments) throws Exception {
        Class<?> cl = instance.getClass();
        Method method =cl.getMethod(methodName, types);
        if (method == null) {
            throw new Exception("Class " + cl.getName() + " doesn't contains " + methodName + " method");
        }
        return method.invoke(instance, arguments);
    }

    private void appendMethodInfo(final Class cl, final List<String> lines) {
        Method[] methods = cl.getDeclaredMethods();
        for (Method method : methods) {
            String modifiers = Modifier.toString(method.getModifiers());
            StringBuilder methodString = new StringBuilder();
            methodString.append("\t");
            methodString.append(modifiers);
            methodString.append(" ");
            methodString.append(method.getName());
            methodString.append("(");
            int index = 1;
            boolean hasArguments = false;
            for (Class argument : method.getParameterTypes()) {
                methodString.append(argument.getCanonicalName());
                methodString.append(" ");
                methodString.append("arg");
                methodString.append(index++);
                methodString.append(",");
                hasArguments = true;
            }
            if (hasArguments) {
                methodString.deleteCharAt(methodString.length() - 1);
            }
            methodString.append(");");
            lines.add(methodString.toString());
        }
        lines.add("");
    }

    private void appendConstructorInfo(final Class cl, final List<String> lines) {
        Constructor[] constructors = cl.getConstructors();
        for (Constructor constructor : constructors) {
            String modifiers = Modifier.toString(constructor.getModifiers());
            StringBuilder constructorString = new StringBuilder();
            constructorString.append("\t");
            constructorString.append(modifiers);
            constructorString.append(" ");
            constructorString.append(constructor.getName());
            constructorString.append("(");
            int index = 1;
            boolean hasArguments = false;
            for (Class argument : constructor.getParameterTypes()) {
                constructorString.append(argument.getCanonicalName());
                constructorString.append(" ");
                constructorString.append("arg");
                constructorString.append(index++);
                constructorString.append(",");
                hasArguments = true;
            }
            if (hasArguments) {
                constructorString.deleteCharAt(constructorString.length() - 1);
            }
            constructorString.append(");");
            lines.add(constructorString.toString());
        }
        lines.add("");
    }

    private void appendFieldInfo(final Class cl, final List<String> lines) {
        Field[] fields = cl.getDeclaredFields();
        for (Field field : fields) {
            String modifiers = Modifier.toString(field.getModifiers());
            lines.add("\t" + modifiers + " " + field.getAnnotatedType().getType().getTypeName()
                    + " " + field.getName() + ";");
        }
        lines.add("");
    }
}
