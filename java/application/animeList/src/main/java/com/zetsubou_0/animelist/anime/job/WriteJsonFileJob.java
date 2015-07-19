package com.zetsubou_0.animelist.anime.job;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.zetsubou_0.animelist.anime.bean.Anime;
import com.zetsubou_0.animelist.anime.constant.FileSystemConstant;
import com.zetsubou_0.animelist.anime.exception.JobException;
import org.apache.commons.lang3.StringUtils;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
* Created by zetsubou_0 on 24.05.15.
*/
public class WriteJsonFileJob extends AbstractJob {
    private static final int MAX_STORE_SIZE = 100;
    private static final Object fileSync = new Object();
    private static RandomAccessFile file;
    private static Map<String, Set<Anime>> store = new HashMap<>();

    public WriteJsonFileJob() {
    }

    @Override
    public void action() throws JobException {
        String path = (String) params.get(SourceContainer.RESOURCE_IN);
        List<Job> jobs = (List<Job>) params.get(JobContainer.JOB_LIST);
        Map<String, Set<Anime>> animeSeries = (Map<String, Set<Anime>>) params.get(SourceContainer.DATA);
        synchronized (store) {
            if(animeSeries != null || animeSeries.size() > 0) {
                store.putAll(animeSeries);
            }
        }

        if((jobs != null && jobs.size() == 0) || ((store.size() + 1) % MAX_STORE_SIZE == 0)) {
            if(StringUtils.isNotBlank(path)) {
                synchronized(fileSync) {
                    if(file == null) {
                        try {
                            // get stream from params
                            file = (RandomAccessFile) params.get(SourceContainer.STREAM);
                            if(file == null) {
                                // create new file with path from params
                                file = new RandomAccessFile(path + FileSystemConstant.JSON, FileSystemConstant.READ_WRITE);
                            }

                            params.put(SourceContainer.STREAM, file);

                            // save into file
                            try {
                                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                                String data = gson.toJson(store);
                                file.write(data.getBytes());
                            } catch (IOException e) {
                                throw new JobException(e);
                            }
                        } catch (FileNotFoundException e) {
                            throw new JobException(e);
                        }
                    }

                }
            }
        }
    }
}
