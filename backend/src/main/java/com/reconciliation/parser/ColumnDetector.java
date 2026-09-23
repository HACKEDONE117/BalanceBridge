package com.reconciliation.parser;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ColumnDetector {

    private static final List<String> DATE_HEADERS = Arrays.asList(
            "date", "transaction date", "txn date", "value date", "value dt", "post date", "trans date", "dt"
    );

    private static final List<String> DESC_HEADERS = Arrays.asList(
            "description", "narration", "particulars", "particular", "remarks", "transaction details", "details", "summary", "party name"
    );

    private static final List<String> DEBIT_HEADERS = Arrays.asList(
            "debit", "withdrawal", "withdrawals", "withdrawal amt", "withdrawal amt.", "dr", "debit amount", "debit(nave)", "nave", "paid out", "outflow"
    );

    private static final List<String> CREDIT_HEADERS = Arrays.asList(
            "credit", "deposit", "deposits", "deposit amt", "deposit amt.", "cr", "credit amount", "credit(jama)", "jama", "paid in", "inflow"
    );

    private static final List<String> AMOUNT_HEADERS = Arrays.asList(
            "amount", "txn amount", "net amount", "total", "val"
    );

    private static final List<String> REF_HEADERS = Arrays.asList(
            "reference", "utr", "ref no", "ref.no.", "chq./ref.no.", "chq/ref.no.", "chq./ref.no", "reference number", "utr number", "chq no", "cheque no", "instrument no", "txn id"
    );

    private static final List<String> BALANCE_HEADERS = Arrays.asList(
            "balance", "closing balance", "running balance", "bal", "available balance"
    );

    public Map<String, Integer> autoDetectColumns(List<String> headers) {
        Map<String, Integer> mapping = new HashMap<>();

        for (int i = 0; i < headers.size(); i++) {
            String header = headers.get(i).toLowerCase().trim().replaceAll("[^a-z0-9 ()./-]", "");

            if (!mapping.containsKey("date") && containsAny(header, DATE_HEADERS)) {
                mapping.put("date", i);
            } else if (!mapping.containsKey("description") && containsAny(header, DESC_HEADERS)) {
                mapping.put("description", i);
            } else if (!mapping.containsKey("debit") && containsAny(header, DEBIT_HEADERS)) {
                mapping.put("debit", i);
            } else if (!mapping.containsKey("credit") && containsAny(header, CREDIT_HEADERS)) {
                mapping.put("credit", i);
            } else if (!mapping.containsKey("amount") && containsAny(header, AMOUNT_HEADERS)) {
                mapping.put("amount", i);
            } else if (!mapping.containsKey("reference") && containsAny(header, REF_HEADERS)) {
                mapping.put("reference", i);
            } else if (!mapping.containsKey("balance") && containsAny(header, BALANCE_HEADERS)) {
                mapping.put("balance", i);
            }
        }

        return mapping;
    }

    private boolean containsAny(String input, List<String> keywords) {
        for (String kw : keywords) {
            if (input.equals(kw) || input.contains(kw)) {
                return true;
            }
        }
        return false;
    }
}
