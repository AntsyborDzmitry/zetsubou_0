package com.zetsubou.torus.med;

import com.zetsubou.torus.med.api.FireBirdConnection;
import com.zetsubou.torus.med.database.FireBirdConnectionImpl;
import com.zetsubou.torus.med.exception.ConnectException;

import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by zetsubou_0 on 29.12.15.
 */
public class MedMain {

    public static final String RESULT_FILE = "/home/zetsubou_0/windows/dataBase/result";

    public static void main(String[] args) {
        try (FileOutputStream out = new FileOutputStream(RESULT_FILE)) {
            FireBirdConnection connection = new FireBirdConnectionImpl();
            byte[] data = connection.searchSignal(8109).getData();
            out.write(data);
        } catch (ConnectException | IOException e) {
            e.printStackTrace();
        }
    }
}
