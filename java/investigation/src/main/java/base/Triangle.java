package base;

public class Triangle {

    private long a;
    private long b;
    private long c;

    private double angleA;
    private double angleB;
    private double angleY;

    public Triangle(long a, long b, long c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public Triangle(long b, long c, double angleA) {
        this.a = Math.round(Math.sqrt(c * c + b * b + 2 * c * b * Math.cos(Math.toRadians(angleA))));
        this.b = b;
        this.c = c;
        this.angleA = angleA;
    }

    public Triangle(long c, double angleA, double angleB) {
        this.a = Math.round(c * (Math.sin(Math.toRadians(angleA))/Math.sin(Math.toRadians(180 - angleA - angleB ))));
        this.b = Math.round(c * (Math.sin(Math.toRadians(angleB))/Math.sin(Math.toRadians(180 - angleA - angleB ))));
        this.c = c;
        this.angleA = angleA;
        this.angleB = angleB;
    }

    public boolean checkTriangle() {
        return (a < (b + c)) && (b < (a + c)) && (c < (a + b));
    }

    public long getA() {
        return a;
    }

    public long getB() {
        return b;
    }

    public long getC() {
        return c;
    }
}