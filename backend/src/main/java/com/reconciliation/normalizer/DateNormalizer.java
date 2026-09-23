package com.reconciliation.normalizer;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

@Component
public class DateNormalizer {

    private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yy"),    // Added 01/04/25 format
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd-MM-yy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd-MMM-yyyy"),
            DateTimeFormatter.ofPattern("dd-MMM-yy"),
            DateTimeFormatter.ofPattern("dd MMM yyyy"),
            DateTimeFormatter.ofPattern("d MMM yyyy"),
            DateTimeFormatter.ofPattern("d-MMM-yyyy"),
            DateTimeFormatter.ofPattern("dd.MM.yyyy"),
            DateTimeFormatter.ofPattern("dd.MM.yy"),
            DateTimeFormatter.ofPattern("yyyy.MM.dd")
    );

    public LocalDate normalizeDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        String cleaned = dateStr.trim();
        if (cleaned.contains(" ")) {
            String firstPart = cleaned.split(" ")[0];
            if (firstPart.length() >= 6) {
                cleaned = firstPart;
            }
        }

        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDate.parse(cleaned, formatter);
            } catch (DateTimeParseException ignored) {
            }
        }

        // RegEx fallback for date embedded inside string
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("(\\d{1,2}[/\\.\\-]\\d{1,2}[/\\.\\-]\\d{2,4})").matcher(dateStr);
        if (matcher.find()) {
            String extracted = matcher.group(1);
            for (DateTimeFormatter formatter : FORMATTERS) {
                try {
                    return LocalDate.parse(extracted, formatter);
                } catch (DateTimeParseException ignored) {
                }
            }
        }

        return null;
    }
}
