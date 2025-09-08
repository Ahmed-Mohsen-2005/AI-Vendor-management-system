# pip install pdfplumber transformers torch

import pdfplumber
from transformers import pipeline

# Load summarization pipeline (free model from Hugging Face)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file using pdfplumber."""
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def summarize_with_local_model(text, max_chunk=1000):
    """
    Summarize long text by splitting into chunks.
    Hugging Face models usually have a max input length (~1024 tokens).
    """
    chunks = []
    words = text.split()
    for i in range(0, len(words), max_chunk):
        chunk = " ".join(words[i:i+max_chunk])
        chunks.append(chunk)

    summaries = []
    for chunk in chunks:
        summary = summarizer(chunk, max_length=200, min_length=50, do_sample=False)
        summaries.append(summary[0]['summary_text'])

    return "\n\n".join(summaries)

if __name__ == "__main__":
    pdf_path = "3. RFP and Proposals\\Sample RFPs\\sample_proposal.pdf"  # Path to your proposal PDF

    # Step 1: Extract text
    proposal_text = extract_text_from_pdf(pdf_path)
    
    # Step 2: Summarize locally
    summary = summarize_with_local_model(proposal_text)
    
    print("=== Proposal Summary ===")
    print(summary)
