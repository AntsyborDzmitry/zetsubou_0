package com.dhl.services.model;

public final class CqLocale {

    private final String countryCode;
    private final String languageCode;

    public CqLocale(String countryCode, String languageCode) {
        this.countryCode = countryCode;
        this.languageCode = languageCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getLanguageCode() {
        return this.languageCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CqLocale cqLocale = (CqLocale) o;

        if (countryCode != null ? !countryCode.equals(cqLocale.countryCode) : cqLocale.countryCode != null) {
            return false;
        }

        return !(languageCode != null ? !languageCode.equals(cqLocale.languageCode) : cqLocale.languageCode != null);

    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((countryCode == null) ? 0 : countryCode.hashCode());
        result = prime * result + ((languageCode == null) ? 0 : languageCode.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "CqLocale{" +
                "countryCode='" + countryCode + '\'' +
                ", languageCode='" + languageCode + '\'' +
                '}';
    }
}
