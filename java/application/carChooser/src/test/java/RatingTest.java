import com.zetsubou_0.carchooser.core.api.RatingService;
import com.zetsubou_0.carchooser.core.api.impl.RatingServiceImpl;
import com.zetsubou_0.carchooser.core.been.car.Car;
import com.zetsubou_0.carchooser.core.been.car.Model;
import com.zetsubou_0.carchooser.core.been.car.Motor;
import com.zetsubou_0.carchooser.core.been.metric.Mileage;
import com.zetsubou_0.carchooser.core.comparator.RatingComparator;
import org.junit.Test;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;

public class RatingTest {

    @Test
    public void shouldReturnRating() {
        Model model = new Model("Jeep", "Grand Cherokee", Calendar.getInstance());
        Motor motor = new Motor(Motor.MotorType.DIZEL);
        Car car1 = new Car(model, motor);
        Mileage mileage = new Mileage(123000);
        car1.setMileage(mileage);

        model = new Model("Infinity", "CX35", Calendar.getInstance());
        motor = new Motor(Motor.MotorType.GASOLINE);
        Car car2 = new Car(model, motor);
        mileage = new Mileage(100000);
        car2.setMileage(mileage);

        model = new Model("Opel", "Frontera", Calendar.getInstance());
        motor = new Motor(Motor.MotorType.DIZEL);
        Car car3 = new Car(model, motor);
        mileage = new Mileage(175000);
        car3.setMileage(mileage);

        Set<Car> cars = new HashSet<Car>();
        cars.add(car1);
        cars.add(car2);
        cars.add(car3);

        RatingService ratingService = new RatingServiceImpl(cars);
        System.out.println(ratingService.getTotalRating(car1, false));
        System.out.println(ratingService.getTotalRating(car2, false));
        System.out.println(ratingService.getTotalRating(car3, false));
    }
}
