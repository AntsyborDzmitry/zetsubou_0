package com.zetsubou_0.pattern.journaldev.builder;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class Computer {
    // requered
    private String cpu;
    private String hd;
    private String ram;
    // optional
    private String modelName;

    private Computer(ComputerBuilder computerBuilder) {
        cpu = computerBuilder.cpu;
        hd = computerBuilder.hd;
        ram = computerBuilder.ram;
        modelName = computerBuilder.modelName;
    }

    public static class ComputerBuilder {
        // requered
        private String cpu;
        private String hd;
        private String ram;
        // optional
        private String modelName;

        public ComputerBuilder(String cpu, String hd, String ram) {
            this.cpu = cpu;
            this.hd = hd;
            this.ram = ram;
        }

        public ComputerBuilder setModelName(String modelName) {
            this.modelName = modelName;
            return this;
        }

        public Computer build() {
            return new Computer(this);
        }
    }
}
