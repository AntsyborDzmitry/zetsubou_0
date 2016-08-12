package com.zetsubou_0.project.test;

import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PatternFileSearch {

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.println("Path and/or pattern as arguments were not found");
            return;
        }
        String path = args[0];
        String pattern = args[1];
        if (StringUtils.isEmpty(path) || StringUtils.isEmpty(pattern)) {
            System.err.println("Path and/or pattern as arguments were blank");
            return;
        }
        search(path, pattern);
    }

    private static void search(final String path, final String patternString) {
        File baseDir = new File(path);
        if (!baseDir.isDirectory()) {
            System.err.println("File under path was not directory");
            return;
        }
        Pattern pattern = Pattern.compile(patternString);
        List<String> errors = new LinkedList<>();
        System.out.println("Found:");
        searchInDir(errors, baseDir, pattern);
        System.err.println("Paths with errors:");
        for (String errorPath : errors) {
            System.err.println(errorPath);
        }
    }

    private static void searchInDir(final List<String> errorPaths, final File dir, final Pattern pattern) {
        for (File file : dir.listFiles()) {
            String filePath = file.getAbsolutePath();
            if (filePath.contains("/target/") || filePath.contains("\\target\\")) {
                continue;
            }
            if (file.isDirectory()) {
                searchInDir(errorPaths, file, pattern);
            } else if (pattern.matcher(filePath).find()) {
                actionWithFoundPaths(filePath);
            } else {
                searchPatternInFile(errorPaths, file, pattern);
            }
        }
    }

    private static void searchPatternInFile(final List<String> errorPaths, final File file, final Pattern pattern) {
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                Matcher matcher = pattern.matcher(line);
                if (matcher.find()) {
                    System.out.println(file.getAbsolutePath());
                    break;
                }
            }
        } catch (IOException e) {
            errorPaths.add(file.getAbsolutePath());
        }
    }

    private static void actionWithFoundPaths(final String filePath) {
        System.out.println(filePath);
    }
}
