package base.Comparator;

import base.Tank;
import java.util.Comparator;

public class SortDataTankWeight implements Comparator<Tank> {
    @Override
    public int compare(Tank tank1, Tank tank2) {
        return tank1.getWeight() - tank2.getWeight();
    }


}

