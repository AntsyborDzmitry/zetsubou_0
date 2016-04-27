package uiversity.tasks;

import uiversity.tasks.api.CustomReflection;
import uiversity.tasks.impl.CustomReflectionImpl;
import uiversity.tasks.model.Edition;

public class Task13 {
    public static void main(String[] args) {
        CustomReflection reflection = new CustomReflectionImpl();
        Edition edition = new Edition("Java SE 8 for the Really Impatient by Cay S. Horstmann",
                "Addison-Wesley Professional; 1 edition (January 24, 2014)", 240);
        try {
            System.out.println(reflection.calculateMax(5, 3.3));
            reflection.createFile(Edition.class.getCanonicalName());
            System.out.println(reflection.methods(edition));
            System.out.println(reflection.invoke(edition, "getTitle", new Class[] {}, new Object[] {}));
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
