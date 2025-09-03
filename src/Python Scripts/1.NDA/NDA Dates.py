import pdfplumber
import re
import io
from datetime import datetime
import sys

# Regex patterns
COMPANY_REGEX = re.compile(
    r"\b([A-Z][A-Za-z0-9&,\.\s]+?\s(?:Ltd|Ltd\.|Corp|Corp\.|Inc|Inc\.|LLC|PLC|GmbH|S\.A\.|SARL))\b"
)
TAX_ID_REGEX = re.compile(r"\b\d{8,15}\b")
DATE_REGEX = re.compile(
    r"(\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|"
    r"\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b|"
    r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2},?\s?\d{4}\b|"
    r"\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s?\d{4}\b)"
)

LEGAL_SUFFIXES = ["Ltd", "Ltd.", "Corp", "Corp.", "Inc", "Inc.", "LLC", "PLC", "GmbH", "S.A.", "SARL"]

def clean_company_name(name: str) -> str:
    name = name.strip()
    name = re.sub(r"^(between|and)\s+", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s+Tax.*$", "", name, flags=re.IGNORECASE)
    for suffix in LEGAL_SUFFIXES:
        if name.endswith(suffix):
            return name
    return ""

def normalize_date(date_str: str) -> str:
    date_formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d",
        "%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%d %B %Y",
        "%b %d %Y", "%B %d %Y"
    ]
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return date_str

def classify_dates_fuzzy(text: str) -> dict:
    text_lower = text.lower()
    date_matches = []

    for match in DATE_REGEX.finditer(text):
        raw_date = match.group()
        start, end = match.start(), match.end()
        snippet = text_lower[max(0, start-100): end+100]
        try:
            dt_obj = datetime.strptime(normalize_date(raw_date), "%Y-%m-%d")
            date_matches.append({"raw": raw_date, "dt": dt_obj, "start": start, "snippet": snippet})
        except ValueError:
            continue

    effective_date = expiration_date = license_issue = license_expiry = None

    for d in date_matches:
        snippet = d["snippet"]
        if effective_date is None and ("effective" in snippet or "commence" in snippet):
            effective_date = d["dt"]
        elif expiration_date is None and ("expir" in snippet or "term" in snippet):
            expiration_date = d["dt"]
        elif license_issue is None and "business license" in snippet and ("issue" in snippet or "issued" in snippet):
            license_issue = d["dt"]
        elif license_expiry is None and "business license" in snippet and ("valid until" in snippet or "expire" in snippet or "until" in snippet):
            license_expiry = d["dt"]

    assigned = [d for d in [effective_date, expiration_date, license_issue, license_expiry] if d]
    remaining = sorted([d["dt"] for d in date_matches if d["dt"] not in assigned])

    if effective_date is None and remaining:
        effective_date = remaining.pop(0)
    if expiration_date is None and remaining:
        expiration_date = remaining.pop(0)
    if license_issue is None and remaining:
        license_issue = remaining.pop(0)
    if license_expiry is None and remaining:
        license_expiry = remaining.pop(0)

    def fmt(dt):
        return dt.strftime("%Y-%m-%d") if dt else ""

    return {
        "effective_date": fmt(effective_date),
        "expiration_date": fmt(expiration_date),
        "license_issue_date": fmt(license_issue),
        "license_expiry_date": fmt(license_expiry)
    }

def extract_entities_from_pdf(pdf_path: str) -> dict:
    """Extract company names, tax IDs, and classified dates from a PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        text = " ".join([page.extract_text() or "" for page in pdf.pages])

    raw_companies = COMPANY_REGEX.findall(text)
    companies = list({clean_company_name(c) for c in raw_companies if clean_company_name(c)})
    tax_ids = list({tid for tid in TAX_ID_REGEX.findall(text) if tid.isdigit()})
    classified_dates = classify_dates_fuzzy(text)

    return {
        "text": text,
        "entities": {
            "company_names": companies,
            "tax_ids": tax_ids,
            "dates": classified_dates
        }
    }

if __name__ == "__main__":
    # 🔹 Write your PDF path here
    pdf_path = "sample.pdf"

    result = extract_entities_from_pdf(pdf_path)
    print(result)

