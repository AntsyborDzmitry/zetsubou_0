package com.dhl.components.module;

import com.cognifide.slice.cq.mapper.CQMapperFactory;
import com.dhl.components.module.factory.DHLMapperFactory;
import com.dhl.components.module.provider.OsgiServiceProvider;
import com.dhl.services.dao.SlingDao;
import com.google.inject.AbstractModule;

public class DHLModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(SlingDao.class).toProvider(new OsgiServiceProvider<>(SlingDao.class));
        bind(CQMapperFactory.class).to(DHLMapperFactory.class);
    }
}
