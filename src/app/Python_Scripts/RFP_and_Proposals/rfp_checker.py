# pip install pdfplumber python-docx rapidfuzz

import pdfplumber
from docx import Document
import re
from rapidfuzz import fuzz, process

# ----------------------------
# Required sections/keywords
# ----------------------------
required_sections = [
    "Submission Date",
    "Payment Terms",
    "Currency",
    "Timeline",
    "Governing Law"
]

SIMILARITY_THRESHOLD = 80  # percentage

# ----------------------------
# Helper functions
# ----------------------------
def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def is_section_heading(line, required_sections):
    """
    Detect if a line is a section heading.
    Uses fuzzy partial matching to handle cases like 'Submission Date: 15 Oct'.
    """
    for sec in required_sections:
        if fuzz.partial_ratio(line.lower(), sec.lower()) >= SIMILARITY_THRESHOLD:
            return sec
    return None

def extract_sections(text):
    """Extract sections and their contents into a dictionary."""
    sections = {}
    text_lines = text.splitlines()

    current_section = None
    buffer = []

    for line in text_lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        matched_section = is_section_heading(line_stripped, required_sections)

        if matched_section:
            # Save previous section if any
            if current_section:
                sections[current_section] = " ".join(buffer).strip()
            # Start new section
            current_section = matched_section
            # If heading has inline content (e.g. "Submission Date: 15 Oct"), capture it
            inline_content = line_stripped.replace(matched_section, "").strip(": -")
            buffer = [inline_content] if inline_content else []
        else:
            if current_section:
                buffer.append(line_stripped)

    # Save last section
    if current_section:
        sections[current_section] = " ".join(buffer).strip()

    return sections

def check_sections(text):
    sections = extract_sections(text)
    missing_sections = []
    too_short_sections = []

    for sec in required_sections:
        if sec not in sections:
            missing_sections.append(sec)
        else:
            if len(sections[sec]) < 30:
                too_short_sections.append(sec)

    return sections, missing_sections, too_short_sections

# ----------------------------
# Main function
# ----------------------------
def check_rfp_file(file_path):
    ext = file_path.split(".")[-1].lower()

    if ext == "pdf":
        text = extract_text_from_pdf(file_path)
    elif ext in ["docx", "doc"]:
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")

    sections, missing_sections, too_short_sections = check_sections(text)

    # Return structured JSON-like results instead of only printing
    return {
        "file": file_path,
        "sections": sections,
        "missing": missing_sections,
        "too_short": too_short_sections,
        "status": (
            "All required sections are present and sufficiently detailed."
            if not missing_sections and not too_short_sections else "Some issues found."
        )
    }

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    file_path = "Sample RFPs\RFP_Too_Short.pdf"
    result = check_rfp_file(file_path)
    print(result)
