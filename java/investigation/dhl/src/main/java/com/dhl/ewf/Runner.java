package com.dhl.ewf;

import com.dhl.ewf.resourcetype.ResourceTypeChanger;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Main class
 */
public class Runner {

    private static final String START_PROCESSING_OF = "Start processing \"%s\" component";

    private static final Map<String, OldNew> OLD_NEW_RESOURCES = new HashMap<>();

    static {
        OLD_NEW_RESOURCES.put("dhl-content-streaming", new OldNew("dhl/components/dhl-content-streaming",
                "dhl/components/content/dhl-content-streaming"));
        OLD_NEW_RESOURCES.put("dhl-country-selector/selector", new OldNew("dhl/components/dhl-country-selector/selector",
                "dhl/components/content/dhl-country-selector/selector"));
        OLD_NEW_RESOURCES.put("dhl-footer", new OldNew("dhl/components/dhl-footer",
                "dhl/components/content/dhl-footer"));
        OLD_NEW_RESOURCES.put("dhl-header/dhl-country-selector", new OldNew("dhl/components/dhl-header/dhl-country-selector",
                "dhl/components/content/dhl-header/dhl-country-selector"));
        OLD_NEW_RESOURCES.put("dhl-header/dhl-logo", new OldNew("dhl/components/dhl-header/dhl-logo",
                "dhl/components/content/dhl-header/dhl-logo"));
        OLD_NEW_RESOURCES.put("dhl-header/dhl-service-nav", new OldNew("dhl/components/dhl-header/dhl-service-nav",
                "dhl/components/content/dhl-header/dhl-service-nav"));
        OLD_NEW_RESOURCES.put("dhl-header/sub-nav-menus", new OldNew("dhl/components/dhl-header/sub-nav-menus",
                "dhl/components/content/dhl-header/sub-nav-menus"));
        OLD_NEW_RESOURCES.put("dhl-header/dhl-top-nav", new OldNew("dhl/components/dhl-header/dhl-top-nav",
                "dhl/components/content/dhl-header/dhl-top-nav"));
        OLD_NEW_RESOURCES.put("dhl-header/dhl-top-nav-links", new OldNew("dhl/components/dhl-header/dhl-top-nav-links",
                "dhl/components/content/dhl-header/dhl-top-nav-links"));
    }

    public static void main(String[] args) throws IOException {
        try (OutputWriter out = new OutputWriter(new File("process.log"))) {
            for (Map.Entry<String, OldNew> entry : OLD_NEW_RESOURCES.entrySet()) {
                out.println(String.format(START_PROCESSING_OF, entry.getKey()));
                OldNew oldNew = entry.getValue();
                ResourceTypeChanger changer = new ResourceTypeChanger(oldNew.getOldValue(), oldNew.getNewValue());
                changer.setOut(out);
                changer.change();
                out.println();
            }
        }
    }

    private static final class OldNew {

        private final String oldValue;

        private final String newValue;

        public OldNew(final String oldValue, final String newValue) {
            this.oldValue = oldValue;
            this.newValue = newValue;
        }

        public String getOldValue() {
            return oldValue;
        }

        public String getNewValue() {
            return newValue;
        }
    }
}
