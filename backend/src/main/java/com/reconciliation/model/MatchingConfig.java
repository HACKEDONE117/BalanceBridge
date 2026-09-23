package com.reconciliation.model;

public class MatchingConfig {

    private int dateToleranceDays = 2; // Default: 2 days tolerance
    private double exactMatchThreshold = 90.0;
    private double possibleMatchThreshold = 70.0;
    private double minDescriptionSimilarity = 65.0;
    private boolean allowOneToMany = false;

    public MatchingConfig() {}

    public MatchingConfig(int dateToleranceDays, double exactMatchThreshold, double possibleMatchThreshold) {
        this.dateToleranceDays = dateToleranceDays;
        this.exactMatchThreshold = exactMatchThreshold;
        this.possibleMatchThreshold = possibleMatchThreshold;
    }

    public int getDateToleranceDays() { return dateToleranceDays; }
    public void setDateToleranceDays(int dateToleranceDays) { this.dateToleranceDays = dateToleranceDays; }

    public double getExactMatchThreshold() { return exactMatchThreshold; }
    public void setExactMatchThreshold(double exactMatchThreshold) { this.exactMatchThreshold = exactMatchThreshold; }

    public double getPossibleMatchThreshold() { return possibleMatchThreshold; }
    public void setPossibleMatchThreshold(double possibleMatchThreshold) { this.possibleMatchThreshold = possibleMatchThreshold; }

    public double getMinDescriptionSimilarity() { return minDescriptionSimilarity; }
    public void setMinDescriptionSimilarity(double minDescriptionSimilarity) { this.minDescriptionSimilarity = minDescriptionSimilarity; }

    public boolean isAllowOneToMany() { return allowOneToMany; }
    public void setAllowOneToMany(boolean allowOneToMany) { this.allowOneToMany = allowOneToMany; }
}
