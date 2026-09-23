package com.reconciliation.normalizer;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class AmountNormalizer {

    private static final Pattern NUMERIC_PATTERN = Pattern.compile("([\\d,]+\\.?\\d*)");

    public Double normalizeAmount(String amountStr) {
        if (amountStr == null || amountStr.trim().isEmpty()) {
            return null;
        }

        String cleaned = amountStr.trim().toUpperCase();

        // Strip currency symbols, commas, and trailing Dr/Cr flags
        cleaned = cleaned.replaceAll("[₹\\$,\\(\\)]", "").replaceAll("(?i)(DR|CR)", "").trim();

        Matcher matcher = NUMERIC_PATTERN.matcher(cleaned);
        if (matcher.find()) {
            try {
                double val = Double.parseDouble(matcher.group(1));
                return Math.abs(val);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }

    public String detectTransactionType(String debitStr, String creditStr, String amountStr) {
        if (debitStr != null && !debitStr.trim().isEmpty() && normalizeAmount(debitStr) != null && normalizeAmount(debitStr) > 0) {
            return "DEBIT";
        }
        if (creditStr != null && !creditStr.trim().isEmpty() && normalizeAmount(creditStr) != null && normalizeAmount(creditStr) > 0) {
            return "CREDIT";
        }
        if (amountStr != null) {
            String upper = amountStr.toUpperCase();
            if (upper.contains("DR") || upper.contains("NAVE") || upper.contains("-")) return "DEBIT";
            if (upper.contains("CR") || upper.contains("JAMA")) return "CREDIT";
        }
        return "CREDIT";
    }
}
