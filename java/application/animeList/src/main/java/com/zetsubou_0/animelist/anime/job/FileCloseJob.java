package com.zetsubou_0.animelist.anime.job;

import com.zetsubou_0.animelist.anime.exception.JobException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

/**
 * Created by zetsubou_0 on 18.07.15.
 */
public class FileCloseJob extends AbstractJob {
    Logger LOG = LoggerFactory.getLogger(FileCloseJob.class);

    @Override
    public void action() throws JobException {
        Closeable file = (Closeable) params.get(SourceContainer.STREAM);
        List<Job> jobs = (List<Job>) params.get(JobContainer.JOB_LIST);
        if(file != null) {
            if(jobs == null || jobs.size() == 0) {
                try {
                    file.close();
                } catch (IOException e) {
                    LOG.error(e.getMessage(), e);
                }
            }
        }
    }
}
