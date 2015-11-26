package com.dhl.components.module.factory;

import javax.inject.Inject;

import com.cognifide.slice.cq.mapper.CQMapperFactory;
import com.cognifide.slice.mapper.SlingMapperFactory;
import com.cognifide.slice.mapper.api.Mapper;
import com.dhl.components.module.processor.ChildrenFieldProcessor;

public class DHLMapperFactory extends CQMapperFactory {

    @Inject
    private ChildrenFieldProcessor processor;
    
    @Inject
    public DHLMapperFactory(final SlingMapperFactory slingMapperFactory) {
        super(slingMapperFactory);
    }

    public Mapper getMapper() {
        final Mapper mapper = super.getMapper();
        mapper.registerFieldProcessor(processor);
        return mapper;
    }

}
