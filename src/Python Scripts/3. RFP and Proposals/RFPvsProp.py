# pip install scikit-learn pdfplumber

import pdfplumber
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ----------------------------
# Helper function to extract text from PDF
# ----------------------------
def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

# ----------------------------
# Compute Cosine Similarity
# ----------------------------
def compute_similarity(rfp_path, proposal_path):
    # Extract text
    rfp_text = extract_text_from_pdf(rfp_path)
    proposal_text = extract_text_from_pdf(proposal_path)
    
    # Vectorize using TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform([rfp_text, proposal_text])
    
    # Compute cosine similarity
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return similarity

# ----------------------------
# Example Usage
# ----------------------------
if __name__ == "__main__":
    rfp_file = "3. RFP and Proposals\\Sample RFPs\\RFP_Complete.pdf"
    proposal_file = "3. RFP and Proposals\\Sample RFPs\\sample_proposal.pdf"

    similarity_score = compute_similarity(rfp_file, proposal_file)
    print(f"Cosine Similarity between RFP and Proposal: {similarity_score:.4f}")
