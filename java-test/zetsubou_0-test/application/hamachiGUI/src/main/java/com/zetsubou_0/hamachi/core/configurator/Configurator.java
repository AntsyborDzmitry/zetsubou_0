package com.zetsubou_0.hamachi.core.configurator;

import com.zetsubou_0.hamachi.core.bean.Configuration;

/**
 * Created by zetsubou_0 on 21.2.15.
 */
public interface Configurator {
    Configuration getConfiguration(String name);
    void setConfiguration(Configuration configuration, String name);
}
