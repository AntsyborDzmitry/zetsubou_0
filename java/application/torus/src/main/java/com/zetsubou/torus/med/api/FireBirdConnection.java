package com.zetsubou.torus.med.api;

import com.zetsubou.torus.med.bean.Examination;
import com.zetsubou.torus.med.bean.Signal;
import com.zetsubou.torus.med.exception.ConnectException;

/**
 * Created by zetsubou_0 on 29.12.15.
 */
public interface FireBirdConnection {
    Signal searchSignal(int id) throws ConnectException;
    Signal searchSignal(Examination examination) throws ConnectException;
}
