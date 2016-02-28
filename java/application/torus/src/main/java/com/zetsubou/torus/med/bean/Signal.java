package com.zetsubou.torus.med.bean;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Created by zetsubou_0 on 29.12.15.
 */
public class Signal {
    private final Examination examination;
    private final Map<Integer, byte[]> data = new TreeMap<>();
    private final List<byte[]> dataList = new ArrayList<>();

    public Signal(Examination examination) {
        this.examination = examination;
    }

    public void putData(Integer index, byte[] data) {
        this.data.put(index, data);
        this.dataList.add(data);
    }

    public byte[] getData() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
//        for (Integer key : data.keySet()) {
//            out.write(data.get(key));
//        }
        for (byte[] bytes : dataList) {
            out.write(bytes);
z        }
        return out.toByteArray();
    }
}
