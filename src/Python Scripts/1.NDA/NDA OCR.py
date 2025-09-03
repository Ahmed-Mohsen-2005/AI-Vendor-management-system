import fitz  # PyMuPDF
import numpy as np
import cv2
import os

def pdf_to_images(pdf_path, dpi=200):
    """Convert PDF to list of RGB images using PyMuPDF."""
    doc = fitz.open(pdf_path)
    images = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        zoom = dpi / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        if pix.n == 4:  # has alpha channel
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 4)
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
        else:
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3)
        images.append(img)
    return images

def detect_stamps(image, page_num, debug=False, debug_dir="debug_stamps"):
    """
    Detects two largest rectangular stamp-like shapes in the bottom 25% of the page.
    Always returns results for Stamp A (left) and Stamp B (right).
    """
    h, w, _ = image.shape
    crop_y = int(h * 0.75)
    img_bottom = image[crop_y:h, :, :]

    # Step 1: Preprocess
    gray = cv2.cvtColor(img_bottom, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(gray, 30, 120)

    # Morphological cleanup
    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    edges = cv2.erode(edges, kernel, iterations=1)

    # Step 2: Contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    candidates = []
    for cnt in contours:
        x, y, w_box, h_box = cv2.boundingRect(cnt)
        area = w_box * h_box

        # Skip very small stuff (signatures, noise)
        if area < 10000:
            continue

        # Rectangle-like aspect ratio
        aspect_ratio = w_box / float(h_box)
        if not (0.5 < aspect_ratio < 2.5):
            continue

        candidates.append((x, y + crop_y, w_box, h_box, area))

    # Step 3: Sort by area and keep top 2
    candidates = sorted(candidates, key=lambda b: b[4], reverse=True)[:2]

    stamp_a, stamp_b = None, None
    if len(candidates) == 2:
        # Assign leftmost = A, rightmost = B
        if candidates[0][0] < candidates[1][0]:
            stamp_a, stamp_b = candidates[0], candidates[1]
        else:
            stamp_a, stamp_b = candidates[1], candidates[0]
    elif len(candidates) == 1:
        # Only one found → decide whether it's A or B
        stamp_a = candidates[0]

    # Debug
    if debug:
        os.makedirs(debug_dir, exist_ok=True)
        debug_img = image.copy()
        if stamp_a:
            x, y, w_box, h_box, _ = stamp_a
            cv2.rectangle(debug_img, (x, y), (x + w_box, y + h_box), (0, 255, 0), 3)
            cv2.putText(debug_img, "Stamp A", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        if stamp_b:
            x, y, w_box, h_box, _ = stamp_b
            cv2.rectangle(debug_img, (x, y), (x + w_box, y + h_box), (255, 0, 0), 3)
            cv2.putText(debug_img, "Stamp B", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)
        out_path = os.path.join(debug_dir, f"page_{page_num+1}_debug.png")
        cv2.imwrite(out_path, cv2.cvtColor(debug_img, cv2.COLOR_RGB2BGR))
        print(f"[DEBUG] Saved: {out_path}")

    return {
        "Stamp A": bool(stamp_a),
        "Stamp B": bool(stamp_b)
    }

def validate_nda(pdf_path, debug=False):
    images = pdf_to_images(pdf_path)
    results = []
    for i, img in enumerate(images):
        stamp_result = detect_stamps(img, i, debug=debug)
        print(f"Page {i+1}: {stamp_result}")
        results.append(stamp_result)
    return results

# Example usage
if __name__ == "__main__":
    pdf_path = "C:\\Users\\youss\\Documents\\Stage 1\\asset nda copy 2.pdf" 
    validate_nda(pdf_path, debug=True)
