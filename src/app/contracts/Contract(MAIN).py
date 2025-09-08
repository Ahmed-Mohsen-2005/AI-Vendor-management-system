import re
import PyPDF2
import csv

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file page by page"""
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("❌ Error reading PDF:", e)
    return text

def check_contract(file_path, output_file="contract_clauses_status.csv", duration_file="contract_duration.csv"):
    # Arabic clauses mapped to English
    clause_map = {
        "شروط الدفع": "Payment Terms",
        "الغرامات والجزاءات": "Penalties",
        "أحكام العقد": "Contract Provisions",
        "مدة العقد": "Contract Duration"
    }

    clause_content = {eng: "" for eng in clause_map.values()}
    current_clause = None

    try:
        # 🔹 Extract text from PDF
        pdf_text = extract_text_from_pdf(file_path)
        lines = pdf_text.split("\n")

        for line in lines:
            trimmed = line.strip()
            normalized = re.sub(r"^[0-9.\-:()]+", "", trimmed).strip()

            # ✅ Check if line matches one of the Arabic clauses
            for ar_clause, en_clause in clause_map.items():
                if normalized.startswith(ar_clause):
                    current_clause = en_clause
                    clause_content[current_clause] = ""  # reset content
                    break
            else:
                if current_clause:
                    if normalized.startswith("البند"):  # start of a new clause
                        current_clause = None
                    else:
                        if clause_content[current_clause]:
                            clause_content[current_clause] += " " + trimmed
                        else:
                            clause_content[current_clause] = trimmed

        # ✅ Write results to main CSV with English names + English status
        with open(output_file, "w", encoding="utf-8-sig", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Clause", "Status"])
            for en_clause in clause_map.values():
                content = clause_content.get(en_clause)
                status = "Present" if content else "Missing"
                writer.writerow([en_clause, status])

        print(f"✅ Main table saved as {output_file}")

        # ✅ If Contract Duration exists, save it separately
        duration_text = clause_content.get("Contract Duration", "")
        if duration_text:
            with open(duration_file, "w", encoding="utf-8-sig", newline="") as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(["Clause", "Content"])
                writer.writerow(["Contract Duration", duration_text])
            print(f"✅ Contract Duration saved as {duration_file}")
        else:
            print("⚠ No Contract Duration found, so no separate file created.")

    except Exception as e:
        print("Error processing contract:", e)


if __name__ == "_main_":
    check_contract("contractnew.pdf")