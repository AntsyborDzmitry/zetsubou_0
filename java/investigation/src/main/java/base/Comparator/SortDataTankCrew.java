package base.Comparator;

import base.Tank;
import java.util.Comparator;

public class SortDataTankCrew implements Comparator<Tank> {
    @Override
    public int compare(Tank tank1, Tank tank2) {
        return tank1.getCrew() - tank2.getCrew();
    }
}
