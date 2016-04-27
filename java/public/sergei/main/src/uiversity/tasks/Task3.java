package uiversity.tasks;

import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Task3 {

    private static final String FILE_PATH = "matrix";

    private static final String FILE_PATH_COORDINATES = "coordinatesMatrix";

    private static final String FILE_PATH_SPARSE = "sparseMatrix";

    public static void main(String[] args) {
        readWriteMatrix();
        createSpareMatrix();
    }

    private static void readWriteMatrix() {
        Scanner matrixReader;
        try {
            matrixReader = new Scanner(new File(FILE_PATH));
        } catch (FileNotFoundException e) {
            System.err.println("Error occurred while processing file. File not found." + e.getMessage());
            return;
        }

        List<String> matrix = new ArrayList<>();
        MaxMin maxMin = new MaxMin();
        while (matrixReader.hasNextLine()) {
            String line = matrixReader.nextLine();
            Scanner integerLine = new Scanner(line);
            int sum = 0;
            while (integerLine.hasNextInt()) {
                sum += integerLine.nextInt();
            }
            matrix.add(line);
            if (sum < maxMin.getMinValue()) {
                maxMin.setMinIndex(matrix.size() - 1);
                maxMin.setMinValue(sum);
            } else if (sum > maxMin.getMaxValue()) {
                maxMin.setMaxIndex(matrix.size() - 1);
                maxMin.setMaxValue(sum);
            }
        }
        Collections.swap(matrix, maxMin.getMinIndex(), maxMin.getMaxIndex());
        System.out.println(matrix);
    }

    private static void createSpareMatrix() {
        SpareMatrix matrix;
        try {
            matrix = SpareMatrix.build(new File(FILE_PATH_COORDINATES));
        } catch (Exception e) {
            System.err.println("Error occurred while creating matrix." + e.getMessage());
            return;
        }
        if (matrix == null) {
            System.err.println("Error occurred while creating matrix.");
            return;
        }
        Integer[][] integerMatrix = getIntegerMatrix(matrix);
        List<String> resultMatrix = new ArrayList<>();
        for (Integer[] anIntegerMatrix : integerMatrix) {
            List<Integer> row = Arrays.asList(anIntegerMatrix);
            String matrixLine = row.stream()
                    .map(Object::toString)
                    .collect(Collectors.joining(" "));
            resultMatrix.add(matrixLine);
        }
        try {
            Files.write(Paths.get(FILE_PATH_SPARSE), resultMatrix);
        } catch (IOException e) {
            System.err.println("Error occurred while creating result matrix." + e.getMessage());
        }
    }

    private static Integer[][] getIntegerMatrix(final SpareMatrix matrix) {
        Integer[][] integerMatrix = new Integer[matrix.getWidth()][matrix.getHeight()];
        for (Integer[] row : integerMatrix) {
            Arrays.fill(row, 0);
        }
        matrix.getNotNullPoints().forEach(point ->
                integerMatrix[(int) point.getX()][(int) point.getY()] = 1);
        return integerMatrix;
    }

    private static final class SpareMatrix {

        private static final String COORDINATE = "\\D*(\\d)\\D*(\\d)\\D*";

        private static final Pattern COORDINATE_PATTERN = Pattern.compile(COORDINATE);

        private int width = 1;

        private int height = 1;

        private final List<Point> notNullPoints = new ArrayList<>();

        private SpareMatrix() {}

        private static SpareMatrix build(final File input) throws Exception {
            SpareMatrix matrix = new SpareMatrix();
            Scanner matrixReader = null;
            try {
                matrixReader = new Scanner(input);
            } catch (FileNotFoundException e) {
                System.err.println("Error occurred while processing file. File not found." + e.getMessage());
            }
            if (matrixReader == null) {
                throw new Exception("Error occurred while creating new instance of scanner.");
            }
            while (matrixReader.hasNextLine()) {
                String line = matrixReader.nextLine();
                Matcher matcher = COORDINATE_PATTERN.matcher(line);
                if (matcher.find()) {
                    int xPosition = Integer.parseInt(matcher.group(1));
                    int yPosition = Integer.parseInt(matcher.group(2));
                    matrix.width = matrix.width > xPosition + 1 ? matrix.width : xPosition + 1;
                    matrix.height = matrix.height > yPosition + 1 ? matrix.height : yPosition + 1;
                    matrix.notNullPoints.add(new Point(xPosition, yPosition));
                    continue;
                }
                throw new Exception("Error occurred while parsing string. Not valid string: " + line);
            }
            return matrix;
        }

        private int getWidth() {
            return width;
        }

        private int getHeight() {
            return height;
        }

        private List<Point> getNotNullPoints() {
            return notNullPoints;
        }
    }

    private static final class MaxMin {

        private int maxValue = Integer.MIN_VALUE;

        private int maxIndex;

        private int minValue = Integer.MAX_VALUE;

        private int minIndex;

        public int getMaxValue() {
            return maxValue;
        }

        public void setMaxValue(final int maxValue) {
            this.maxValue = maxValue;
        }

        public int getMaxIndex() {
            return maxIndex;
        }

        public void setMaxIndex(final int maxIndex) {
            this.maxIndex = maxIndex;
        }

        public int getMinValue() {
            return minValue;
        }

        public void setMinValue(final int minValue) {
            this.minValue = minValue;
        }

        public int getMinIndex() {
            return minIndex;
        }

        public void setMinIndex(final int minIndex) {
            this.minIndex = minIndex;
        }
    }
}
