import pdfplumber
import pandas as pd
import os

def extract_net_price(pdf_path):
    """Extract 'Price Excluding VAT' value from a quotation PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        all_tables = []
        for page in pdf.pages:
            tables = page.extract_tables()
            all_tables.extend(tables)

    # Look for "Price Excluding VAT" row
    for table in all_tables:
        for row in table:
            if not row:
                continue
            for cell in row:
                if cell and "excluding vat" in str(cell).lower():
                    try:
                        return float(str(row[-1]).replace(",", "").strip())
                    except:
                        pass
    return None


def summarize_quotations(pdf_files):
    """Generate a summary DataFrame with vendor names and net prices."""
    summary = []

    for pdf_file in pdf_files:
        vendor = os.path.splitext(os.path.basename(pdf_file))[0]  # use filename as vendor
        net_price = extract_net_price(pdf_file)
        summary.append({"Vendor": vendor, "Net Price": net_price})

    return pd.DataFrame(summary)


# Example usage
pdf_list = [
    "Sample Quotations\quotation.pdf",
    "Sample Quotations\quotation_2.pdf"
]

df_summary = summarize_quotations(pdf_list)
print(df_summary)
