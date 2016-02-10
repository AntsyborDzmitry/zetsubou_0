package base.Comparator;

import base.Tank;
import java.util.Comparator;

public class SortDataTankModel implements Comparator<Tank> {
    @Override
    public int compare(Tank tank1, Tank tank2) {
        return tank1.getModel().compareTo(tank2.getModel());
    }
}

