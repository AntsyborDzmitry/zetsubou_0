package com.zetsubou_0.animelist.anime.jcr;

import com.zetsubou_0.animelist.anime.enums.AnimeType;
import org.apache.jackrabbit.ocm.manager.atomictypeconverter.AtomicTypeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFactory;

/**
 * Created by zetsubou_0 on 19.07.15.
 */
public class AnimeTypeConverter implements AtomicTypeConverter {
    private static final Logger LOG = LoggerFactory.getLogger(AnimeTypeConverter.class);

    @Override
    public Value getValue(ValueFactory valueFactory, Object o) {
        if (o == null) {
            return null;
        }

        AnimeType type = (AnimeType) o;

        String jcrValue = type.toString();
        return valueFactory.createValue(jcrValue);
    }

    @Override
    public Object getObject(Value value) {
        try {
            String stringValue = value.getString();
            return AnimeType.valueOf(stringValue);
        } catch (RepositoryException e) {
            LOG.error(e.getMessage(), e);
        }
        return null;
    }

    @Override
    public String getXPathQueryValue(ValueFactory valueFactory, Object o) {
        return null;
    }
}
