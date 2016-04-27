package uiversity.tasks.model;

public class Newspaper extends Edition {

    private Color color;

    public Newspaper() {
    }

    public Newspaper(final String title, final String publisher, final int pages, final Color color) {
        super(title, publisher, pages);
        this.color = color;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(final Color color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return super.toString() + "\nColor: " + color;
    }

    public enum Color {
        COLOR("Color"), BLACK_WHITE("Black-white");

        private String description;

        Color(final String description) {
            this.description = description;
        }

        @Override
        public String toString() {
            return description;
        }
    }
}
