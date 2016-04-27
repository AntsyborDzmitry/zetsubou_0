package uiversity.tasks.model;

public class Journal extends Edition {

    private Type type;

    public Journal() {
    }

    public Journal(final String title, final String publisher, final int pages, final Type type) {
        super(title, publisher, pages);
        this.type = type;
    }

    public Type getType() {
        return type;
    }

    public void setType(final Type type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return super.toString() + "\nType: " + type;
    }

    public enum Type {
        SIMPLE("Simple"), GLOSSY("Glossy");

        private String description;

        Type(final String description) {
            this.description = description;
        }

        @Override
        public String toString() {
            return description;
        }
    }
}
