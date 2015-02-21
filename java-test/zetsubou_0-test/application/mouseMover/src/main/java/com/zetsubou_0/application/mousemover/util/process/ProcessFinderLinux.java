package com.zetsubou_0.application.mousemover.util.process;

import com.zetsubou_0.application.mousemover.util.operation.OperaionLinux;
import com.zetsubou_0.application.mousemover.util.operation.Operation;

import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by zetsubou_0 on 14.02.15.
 */
public class ProcessFinderLinux implements ProcessFinder {
    Operation operation;

    @Override
    public boolean isActive(String procName) {
        String sysProc = getSystemProcessList().toLowerCase();
        Pattern p = Pattern.compile(procName.toLowerCase());
        Matcher m = p.matcher(sysProc);

        return m.find();
    }

    private String getSystemProcessList() {
        try {
            operation = new OperaionLinux();
            operation.setOperation(OperaionLinux.GET_PROCESS_LIST);
            operation.perform();

            Process process = (Process) operation.getResult();
            process.waitFor();

            return getProcessListString(process);

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private String getProcessListString(Process process) throws IOException {
        InputStream in = process.getInputStream();
        int countBytes = in.available();
        byte[] buf = new byte[countBytes];
        in.read(buf);
        return new String(buf);
    }
}
