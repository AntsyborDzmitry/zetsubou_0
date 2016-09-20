package com.zetsubou_0.java8.investigation.defaultmethod;

import com.zetsubou_0.java8.investigation.bean.Employee;

public interface EmployeeService {

    static double convertAge(Employee employee) {
        return (double) employee.getAge();
    }

    default String getInfo(Employee employee) {
        return new StringBuilder()
                .append("name: ").append(employee.getName()).append(", ")
                .append("age: ").append(employee.getAge()).append(", ")
                .append("position: ").append(employee.getPosition()).append(", ")
                .toString();
    }
}
