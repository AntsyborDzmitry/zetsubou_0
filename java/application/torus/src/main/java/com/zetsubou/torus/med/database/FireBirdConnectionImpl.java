package com.zetsubou.torus.med.database;

import com.zetsubou.torus.med.api.FireBirdConnection;
import com.zetsubou.torus.med.bean.Examination;
import com.zetsubou.torus.med.bean.Signal;
import com.zetsubou.torus.med.exception.ConnectException;

import java.sql.*;

/**
 * Created by zetsubou_0 on 29.12.15.
 */
public class FireBirdConnectionImpl implements FireBirdConnection {
    private static final String FIRE_BIRD_DRIVER = "org.firebirdsql.jdbc.FBDriver";
    private static final String URL = "jdbc:firebirdsql://localhost:3050//home/zetsubou_0/windows/dataBase/test.fdb";
    private static final String USER = "sysdba";
    private static final String PASSWORD = "75f2d1e4";
    private static final String SIGNAL_QUERY = "SELECT r.EXAMINATION_ID, r.CREATION_DATE, r.NAME, r.SAMPLING, r.DATA, r.SAMPLE_LENGTH, r.STATUS FROM SIGNAL r WHERE r.EXAMINATION_ID = ?";

    private Connection connection;
    private PreparedStatement signalQuery;

    public FireBirdConnectionImpl() throws ConnectException {
        initConnection();
    }

    public Signal searchSignal(int id) throws ConnectException {
        return searchSignal(new Examination(id));
    }

    public Signal searchSignal(Examination examination) throws ConnectException {
        Signal signal = null;
        try {
            signalQuery.setInt(1, examination.getId());
            ResultSet resultSet = signalQuery.executeQuery();
            signal = new Signal(examination);
            while (resultSet.next()) {
                resultSet.getRow();
                signal.putData(resultSet.getInt(3), resultSet.getBytes(5));
            }
        } catch (SQLException e) {
            throw new ConnectException(e);
        }
        return signal;
    }

    private void initConnection() throws ConnectException {
        if (connection == null) {
            try {
                Class.forName(FIRE_BIRD_DRIVER);
                connection = DriverManager.getConnection( URL, USER, PASSWORD);
                createSignalQuery();
            } catch (ClassNotFoundException | SQLException e) {
                throw new ConnectException(e);
            }
        }

        if (signalQuery == null) {
            createSignalQuery();
        }
    }

    private void createSignalQuery() throws ConnectException {
        try {
            signalQuery = connection.prepareStatement(SIGNAL_QUERY);
        } catch (SQLException e) {
            throw new ConnectException(e);
        }
    }
}
