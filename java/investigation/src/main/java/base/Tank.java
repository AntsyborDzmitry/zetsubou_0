package base;

public class Tank {

    private String model;
    private String type;
    private int crew;
    private int mainCannon;
    private int weight;

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getModel() {
        return model;
    }

    public String setModel (String model) {
        return this.model = model;
    }

    public int getCrew() {
        return crew;
    }

    public void setCrew(int crew) {
        this.crew = crew;
    }

    public int getMainCannon() {
        return mainCannon;
    }

    public void setMainCannon(int mainCannon) {
        this.mainCannon = mainCannon;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

}
