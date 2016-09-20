package com.zetsubou_0.java8.investigation.methodreference;

import com.zetsubou_0.java8.investigation.bean.Employee;
import com.zetsubou_0.java8.investigation.defaultmethod.EmployeeService;

public class Test {

    public static void main(String[] args) {
        Employee employee = new Employee();
        employee.setName("X");
        employee.setAge(20);
        employee.setPosition(Employee.Position.DEVELOPER);

        // str -> System.out.println(x)
        A a = System.out::println;

        // (x, y) -> Math.pow(x, y)
        B b = Math::pow;

        // employee -> employeeService.convertAge(employee)
        C c = EmployeeService::convertAge;

        a.print(employee);
        System.out.println(b.pow(2, 10));
        System.out.println(c.age(employee));

        WorldGreeting worldGreeting = new WorldGreeting();
        worldGreeting.greeting();
    }

    interface A {
        void print(Employee employee);
    }

    interface B {
        double pow(double x, double y);
    }

    interface C {
        double age(Employee employee);
    }
}
