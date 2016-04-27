package uiversity.tasks.model;

public class Edition {

    private String title;

    private String publisher;

    private int pages;

    public Edition() {
    }

    public Edition(final String title, final String publisher, final int pages) {
        this.title = title;
        this.publisher = publisher;
        this.pages = pages;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(final String publisher) {
        this.publisher = publisher;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(final int pages) {
        this.pages = pages;
    }

    @Override
    public String toString() {
        return new StringBuilder()
                .append("Title: ")
                .append(title)
                .append("\nPublisher: ")
                .append(publisher)
                .append("\nPages: ")
                .append(pages)
                .toString();
    }
}
