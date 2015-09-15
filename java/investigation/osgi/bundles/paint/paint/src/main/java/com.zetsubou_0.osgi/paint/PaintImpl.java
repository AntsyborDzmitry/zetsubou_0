package com.zetsubou_0.osgi.paint;

import com.zetsubou_0.osgi.api.paint.Figure;
import com.zetsubou_0.osgi.api.paint.Paint;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/14/2015.
 */
public class PaintImpl implements Paint {
    private List<Figure> figures = new ArrayList<>();

    @Override
    public void addFigure(Figure figure) {
        figures.add(figure);
    }

    @Override
    public void printFiguresList() {
        for(Figure figure : figures) {
            figure.printInfo();
        }
    }
}
