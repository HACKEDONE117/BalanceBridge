package com.reconciliation.normalizer;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DescriptionNormalizer {

    private static final Pattern CHEQUE_PATTERN = Pattern.compile("\\b(CHQ|CHEQUE|CHQN)?\\s*[:#-]?\\s*(\\d{6})\\b");

    public String normalizeDescription(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return "";
        }

        String cleaned = raw.toUpperCase().trim();
        // Clean common bank transaction prefixes while retaining business party name
        cleaned = cleaned.replaceAll("(?i)^(NEFT DR-|NEFT CR-|NEFT-|RTGS-|IMPS-|UPI-|BY|TO|INB|NKN|TRANSFER|CMS)/?", "");
        cleaned = cleaned.replaceAll("[^A-Z0-9\\s]", " ");
        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        return cleaned;
    }

    public String extractReferenceNumber(String raw) {
        if (raw == null) return null;
        String upper = raw.toUpperCase();

        // 1. Search for HDFC / Bank UTR patterns (e.g. HDFCN52025040150521296)
        Matcher hdfcMatcher = Pattern.compile("([A-Z]{4}N[0-9]{12,20})").matcher(upper);
        if (hdfcMatcher.find()) {
            return hdfcMatcher.group(1);
        }

        // 2. Search for standard UTR/Ref prefixes
        Matcher uTrMatcher = Pattern.compile("(?:UTR|REF|TXN|ID)[:/\\s-]*([A-Z0-9]{8,22})").matcher(upper);
        if (uTrMatcher.find()) {
            return uTrMatcher.group(1);
        }

        // 3. Generic 12+ digit alphanumeric transaction reference IDs
        Matcher numMatcher = Pattern.compile("\\b([A-Z0-9]{12,22})\\b").matcher(upper);
        if (numMatcher.find()) {
            return numMatcher.group(1);
        }

        return null;
    }

    public String extractChequeNumber(String raw) {
        if (raw == null) return null;
        Matcher matcher = CHEQUE_PATTERN.matcher(raw.toUpperCase());
        if (matcher.find()) {
            return matcher.group(2);
        }
        return null;
    }
}
