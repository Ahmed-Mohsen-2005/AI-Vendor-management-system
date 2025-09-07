import pdfplumber

def validate_quotation(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        all_tables = []
        for page in pdf.pages:
            tables = page.extract_tables()
            all_tables.extend(tables)

    # Assume first big table is the quotation table
    quotation_table = all_tables[0]

    # Clean table (remove empty rows and headers if duplicated)
    rows = [row for row in quotation_table if any(row)]
    
    # Detect header and data rows
    header = rows[0]
    data_rows = rows[1:]

    # Try to standardize column names
    col_map = {col.lower(): idx for idx, col in enumerate(header)}

    # Expected columns
    required_cols = ["description", "quantity", "unit price", "total price"]
    for col in required_cols:
        if col not in col_map:
            raise ValueError(f"Missing column: {col}")

    errors = []
    computed_sum = 0

    for row_num, row in enumerate(data_rows, start=1):
        try:
            qty = float(str(row[col_map["quantity"]]).replace(",", "").strip())
            unit_price = float(str(row[col_map["unit price"]]).replace(",", "").strip())
            total_price = float(str(row[col_map["total price"]]).replace(",", "").strip())
        except Exception:
            continue  # Skip if row is not valid numeric data

        expected_total = round(qty * unit_price, 2)
        if abs(expected_total - total_price) > 0.01:  # Allow small rounding difference
            errors.append(f"Row {row_num}: Expected {expected_total}, Found {total_price}")

        computed_sum += total_price

    # Find "Price Excluding VAT" line in the table/footer
    excluding_vat_value = None
    for row in rows:
        for cell in row:
            if cell and "excluding vat" in str(cell).lower():
                try:
                    excluding_vat_value = float(str(row[-1]).replace(",", "").strip())
                except:
                    pass

    if excluding_vat_value is None:
        errors.append("Could not find 'Price Excluding VAT' in the PDF.")
    else:
        if abs(computed_sum - excluding_vat_value) > 0.01:
            errors.append(
                f"Sum of item totals {computed_sum} does not match 'Price Excluding VAT' {excluding_vat_value}"
            )

    if errors:
        return {"status": "FAILED", "errors": errors}
    else:
        return {"status": "PASSED", "message": "All prices are consistent."}




if __name__ == "__main__":
    result = validate_quotation("Sample Quotations\\quotation_faulty.pdf")
    print(result)