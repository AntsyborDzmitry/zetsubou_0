package com.zetsubou_0.carchooser.core.been.info;

import java.util.HashSet;
import java.util.Set;

public class AdvantagesDisadvantages {

    private Set<Info> advantages = new HashSet<Info>();

    private Set<Info> disadvantages = new HashSet<Info>();

    public AdvantagesDisadvantages addAdvantages(final Info info) {
        advantages.add(info);
        return this;
    }

    public AdvantagesDisadvantages addDisadvantages(final Info info) {
        disadvantages.add(info);
        return this;
    }

    private enum Type {

    }

    private static final class Info {

        private final Type type;

        private final String description;

        private final int ratio;

        public Info(final Type type, final String description, final int ratio) {
            this.type = type;
            this.description = description;
            this.ratio = ratio;
        }

        public Type getType() {
            return type;
        }

        public String getDescription() {
            return description;
        }

        public int getRatio() {
            return ratio;
        }

        @Override
        public boolean equals(final Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            Info info = (Info) o;
            return type == info.type;

        }

        @Override
        public int hashCode() {
            return type != null ? type.hashCode() : 0;
        }
    }
}
