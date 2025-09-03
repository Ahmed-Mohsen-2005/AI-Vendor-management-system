#!/usr/bin/env python3
"""
Detect Arabic blue-ink signatures in an NDA PDF and generate an annotated PDF with highlighted boxes.

This version:
- Uses only blue mask for detection (since signatures are always blue).
- Excludes square/rectangular shapes (stamps, logos).
- Keeps irregular/wide handwriting regions (signatures).
- Processes **only the last page** of the PDF and outputs a single annotated page.

Dependencies:
- pip install opencv-python pdf2image pillow numpy
- Install poppler for pdf2image

Run: python detect_arabic_signatures.py
"""

import os
import sys
from pdf2image import convert_from_path
import cv2
import numpy as np
from PIL import Image, ImageDraw


def pil_to_cv2(pil_img):
    arr = np.array(pil_img)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)


def detect_handwritten_regions(page_img_bgr, debug=False):
    img = page_img_bgr.copy()
    h, w = img.shape[:2]

    # Convert to HSV for blue detection
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower_blue = np.array([80, 40, 30])
    upper_blue = np.array([150, 255, 255])
    blue_mask = cv2.inRange(hsv, lower_blue, upper_blue)

    # Clean up mask
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    cleaned = cv2.morphologyEx(blue_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel, iterations=1)

    # Find contours in blue mask
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    candidates = []
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        area = cv2.contourArea(cnt)
        if area < 150:  # ignore tiny specks
            continue

        aspect_ratio = cw / float(ch)
        hull = cv2.convexHull(cnt)
        hull_area = cv2.contourArea(hull)
        solidity = area / (hull_area + 1e-6)

        # Reject square/rectangular stamps/logos
        if 0.7 < aspect_ratio < 1.3:  # square-ish
            continue
        if 0.5 < aspect_ratio < 2.0 and cw * ch > 5000:  # rectangular blocky stamp
            continue

        # Keep signature-like: wide & low, or irregular
        if aspect_ratio > 2.5 or solidity < 0.8:
            candidates.append((x, y, cw, ch))

        if debug:
            print(f"Box {(x,y,cw,ch)} area={area:.0f} AR={aspect_ratio:.2f} solidity={solidity:.2f}")

    return candidates


def annotate_pdf(input_pdf, output_pdf, tmp_dir, debug=False):
    print(f"Converting PDF to images: {input_pdf}")
    pages = convert_from_path(input_pdf, dpi=300)

    if not pages:
        print("No pages found in PDF.")
        return

    # Take only the last page
    pil_page = pages[-1]
    print(f"Processing last page only")
    cv_page = pil_to_cv2(pil_page)
    boxes = detect_handwritten_regions(cv_page, debug=debug)

    pil_annot = pil_page.convert("RGBA")
    overlay = Image.new("RGBA", pil_annot.size, (255,255,255,0))
    draw = ImageDraw.Draw(overlay)

    for (x, y, w, h) in boxes:
        draw.rectangle([x, y, x + w, y + h], outline=(255,0,0,200), width=3)
        draw.rectangle([x, y, x + w, y + h], fill=(255,255,0,64))

    combined = Image.alpha_composite(pil_annot, overlay).convert("RGB")

    interim_path = os.path.join(tmp_dir, "last_page_annot.png")
    combined.save(interim_path)

    # Save only this single annotated page to the output PDF
    combined.save(output_pdf)
    print(f"Annotated PDF saved to {output_pdf}")


if __name__ == '__main__':
    INPUT_PDF = "1.NDA\\Sample NDAs\\asset nda.pdf"   # hardcoded input PDF path
    OUTPUT_PDF = "1.NDA\\Sample NDAs\\asset nda annotated.pdf"  # hardcoded output annotated PDF path
    TMP_DIR = "./tmp_pages"  # temporary folder for intermediate images

    os.makedirs(TMP_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUTPUT_PDF) or '.', exist_ok=True)

    if not os.path.exists(INPUT_PDF):
        print(f"Input file not found: {INPUT_PDF}")
        sys.exit(1)
    annotate_pdf(INPUT_PDF, OUTPUT_PDF, TMP_DIR, debug=True)
