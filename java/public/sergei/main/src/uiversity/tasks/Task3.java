package uiversity.tasks;

import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

        Map<Integer, String> matrix = new TreeMap<>();
        while (matrixReader.hasNextLine()) {
            String line = matrixReader.nextLine();
            Scanner integerLine = new Scanner(line);
            int sum = 0;
            while (integerLine.hasNextInt()) {
                sum += integerLine.nextInt();
            }
            matrix.put(sum, line);
        }

        System.out.println(createMatrix(matrix));
    }

    private static void createSpareMatrix() {
        SpareMatrix matrix = null;
        try {
            matrix = SpareMatrix.build(new File(FILE_PATH_COORDINATES));
        } catch (Exception e) {
            System.err.println("Error occurred while creating matrix.");
        }
        if (matrix == null) {
            System.err.println("Error occurred while creating matrix.");
            return;
        }
        int[][] integerMatrix = new int[matrix.getWidth()][matrix.getHeight()];
        for (Point point : matrix.getNotNullPoints()) {

        }
    }

    private static List<String> createMatrix(final Map<Integer, String> inputMap) {
        SortedMap<Integer, String> map = new TreeMap<>(inputMap);
        Integer lastKey = map.lastKey();
        Integer firstKey = map.firstKey();
        String firstLine = map.get(lastKey);
        String lastLine = map.get(firstKey);
        map.remove(lastKey);
        map.remove(firstKey);
        List<String> result = new ArrayList<>();
        result.add(firstLine);
        result.addAll(map.values());
        result.add(lastLine);
        return result;
    }

    private static final class SpareMatrix {

        private static final String COORDINATE = "\\D*(\\d)\\D*(\\d)\\D*";

        private static final Pattern COORDINATE_PATTERN = Pattern.compile(COORDINATE);

        private int width = 1;

        private int height = 1;

        private final List<Point> notNullPoints = new ArrayList<>();

        private SpareMatrix() {}

        public static SpareMatrix build(final File input) throws Exception {
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
                Matcher matcher = COORDINATE_PATTERN.matcher();
                if (matcher.find()) {
                    int xPosition = Integer.parseInt(matcher.group(1));
                    int yPosition = Integer.parseInt(matcher.group(2));
                    matrix.width = matrix.width > xPosition ? matrix.width : xPosition;
                    matrix.height = matrix.height > yPosition ? matrix.height : yPosition;
                    matrix.notNullPoints.add(new Point(xPosition, yPosition));
                    continue;
                }
                throw new Exception("Error occurred while parsing string. Not valid string: " + line);
            }
            return matrix;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }

        public List<Point> getNotNullPoints() {
            return notNullPoints;
        }
    }
}
