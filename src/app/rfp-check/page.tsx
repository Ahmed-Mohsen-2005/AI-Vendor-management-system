"use client";

import React, { useCallback, useMemo, useState } from "react";

/** ---- Types ---- **/
type SectionKey =
  | "Submission Date"
  | "Payment Terms"
  | "Currency"
  | "Timeline"
  | "Governing Law";

type SectionResult = {
  found: boolean;
  value?: string;
  confidence: number; // 0..100
  notes?: string;
};

type Analysis = Record<SectionKey, SectionResult>;

/** ---- Constants ---- **/
const REQUIRED_SECTIONS: SectionKey[] = [
  "Submission Date",
  "Payment Terms",
  "Currency",
  "Timeline",
  "Governing Law",
];

const INITIAL_ANALYSIS: Analysis = {
  "Submission Date": { found: false, confidence: 0 },
  "Payment Terms": { found: false, confidence: 0 },
  Currency: { found: false, confidence: 0 },
  Timeline: { found: false, confidence: 0 },
  "Governing Law": { found: false, confidence: 0 },
};

/** ---- Helpers: Parsing ---- **/
const readFileAsText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ""));
    // Best effort: real PDF/DOCX parsing should be done server-side
    if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      // Fallback: try as text anyway (for demo). Replace with server parsing later.
      reader.readAsText(file);
    }
  });

function extractSubmissionDate(text: string): SectionResult {
  // Look for explicit label then a date, else any date
  const labeledDate =
    /(submission\s*date|due\s*date|deadline)\s*[:\-–]\s*([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i.exec(
      text
    );
  if (labeledDate) {
    return {
      found: true,
      value: labeledDate[2],
      confidence: 95,
      notes: "Found near explicit label.",
    };
  }

  const anyDate =
    /([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/.exec(
      text
    );
  if (anyDate) {
    return { found: true, value: anyDate[1], confidence: 60, notes: "Generic date match." };
  }
  return { found: false, confidence: 0, notes: "No date found." };
}

function extractPaymentTerms(text: string): SectionResult {
  const label =
    /(payment\s*terms|payment\s*schedule|terms\s*of\s*payment)\s*[:\-–]\s*([^\n\r]+)/i.exec(
      text
    );
  if (label) {
    return { found: true, value: label[2].trim(), confidence: 90, notes: "Found near label." };
  }
  const net = /(net\s*\d+\s*days?)/i.exec(text);
  if (net) {
    return { found: true, value: net[1], confidence: 75, notes: "Detected 'Net N' terms." };
  }
  return { found: false, confidence: 0, notes: "No payment terms detected." };
}

function extractCurrency(text: string): SectionResult {
  // Symbols and codes
  const map: Record<string, string> = {
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
    EGP: "EGP",
    AED: "AED",
    SAR: "SAR",
    "UAE Dirham": "AED",
    "Saudi Riyal": "SAR",
    "Egyptian Pound": "EGP",
  };
  const symbolMap: Record<string, string> = {
    $: "USD",
    "€": "EUR",
    "£": "GBP",
    "E£": "EGP",
    "SAR": "SAR",
    "AED": "AED",
  };

  // Look for words/codes
  for (const k of Object.keys(map)) {
    const re = new RegExp(`\\b${k}\\b`, "i");
    if (re.test(text)) return { found: true, value: map[k], confidence: 85, notes: "Code/word match." };
  }
  // Look for symbols
  for (const sym of Object.keys(symbolMap)) {
    if (text.includes(sym)) return { found: true, value: symbolMap[sym], confidence: 70, notes: "Symbol match." };
  }
  return { found: false, confidence: 0, notes: "No currency found." };
}

function extractTimeline(text: string): SectionResult {
  const label =
    /(timeline|project\s*schedule|delivery\s*schedule|milestones?)\s*[:\-–]\s*([\s\S]{0,220})/i.exec(
      text
    );
  if (label) {
    const v = label[2].split(/\r?\n/)[0].trim();
    return { found: true, value: v, confidence: 85, notes: "Found near label." };
  }
  const duration = /(\b\d+\s*(days?|weeks?|months?|quarters?)\b)/i.exec(text);
  if (duration) {
    return { found: true, value: duration[1], confidence: 65, notes: "Duration phrase detected." };
  }
  return { found: false, confidence: 0, notes: "No timeline found." };
}

function extractGoverningLaw(text: string): SectionResult {
  const label =
    /(governing\s*law|law\s*of|governed\s*by\s*the\s*laws?\s*of)\s*[:\-–]?\s*([^\n\r]+)/i.exec(
      text
    );
  if (label) {
    const value = label[2].replace(/^the\s+/i, "").trim();
    return { found: true, value, confidence: 90, notes: "Found near phrase 'governing law'." };
  }
  return { found: false, confidence: 0, notes: "No governing law detected." };
}

function parseRFP(text: string): Analysis {
  const subDate = extractSubmissionDate(text);
  const pay = extractPaymentTerms(text);
  const curr = extractCurrency(text);
  const time = extractTimeline(text);
  const law = extractGoverningLaw(text);
  return {
    "Submission Date": subDate,
    "Payment Terms": pay,
    Currency: curr,
    Timeline: time,
    "Governing Law": law,
  };
}

/** ---- Helpers: UI/Export ---- **/
function percentComplete(a: Analysis) {
  const found = Object.values(a).filter((v) => v.found).length;
  return Math.round((found / REQUIRED_SECTIONS.length) * 100);
}

function toCSV(a: Analysis) {
  const headers = ["Section", "Found", "Value", "Confidence", "Notes"];
  const rows = REQUIRED_SECTIONS.map((k) => {
    const r = a[k];
    return [
      k,
      r.found ? "Yes" : "No",
      (r.value ?? "").replace(/"/g, '""'),
      String(r.confidence),
      (r.notes ?? "").replace(/"/g, '""'),
    ];
  });
  return [headers, ...rows]
    .map((row) => row.map((c) => `"${c}"`).join(","))
    .join("\n");
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function classNames(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

/** ---- Component ---- **/
export default function RFPCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const completeness = useMemo(() => (analysis ? percentComplete(analysis) : 0), [analysis]);

  const handleFiles = useCallback(async (f: File) => {
    setFile(f);
    setIsChecking(true);
    try {
      const text = (pasteText && pasteText.trim().length > 0)
        ? pasteText
        : await readFileAsText(f);

      // Simulate processing delay; replace with real API call later
      const parsed = parseRFP(text || "");
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
      setAnalysis({ ...INITIAL_ANALYSIS });
    } finally {
      setIsChecking(false);
    }
  }, [pasteText]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFiles(f);
    },
    [handleFiles]
  );

  const onExportJSON = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    downloadBlob("rfp-analysis.json", blob);
  };

  const onExportCSV = () => {
    if (!analysis) return;
    const blob = new Blob([toCSV(analysis)], { type: "text/csv" });
    downloadBlob("rfp-analysis.csv", blob);
  };

  const copyMissing = async () => {
    if (!analysis) return;
    const missing = REQUIRED_SECTIONS.filter((k) => !analysis[k].found);
    const text = missing.length
      ? `Missing RFP items:\n- ${missing.join("\n- ")}`
      : "All required RFP items are present.";
    await navigator.clipboard.writeText(text);
  };

  const submissionCountdown = useMemo(() => {
    if (!analysis?.["Submission Date"].found) return null;
    const raw = analysis["Submission Date"].value || "";
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return { label: raw, days: null };
    const now = new Date();
    const ms = parsed.getTime() - now.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return { label: raw, days };
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Main */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">RFP Compliance Checker</h1>
          <p className="text-slate-500 mt-1">
            Upload an RFP or paste text to verify required sections: Submission Date, Payment Terms, Currency, Timeline, and Governing Law.
          </p>
        </header>

        {/* Upload / Paste */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Upload card */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Upload RFP Document</h2>

            <label
              htmlFor="fileUpload"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={onDrop}
              className={classNames(
                "flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-44 cursor-pointer transition",
                dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
              )}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">📁</div>
                {!file ? (
                  <p className="text-gray-600">
                    Drag & Drop or <span className="text-indigo-600 font-semibold">Click</span> to Upload
                  </p>
                ) : (
                  <p className="text-gray-700">
                    ✅ <span className="font-medium">{file.name}</span> selected
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Supports TXT, PDF, DOCX (demo parses text only)</p>
              </div>
            </label>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFiles(f);
              }}
            />

            <div className="mt-4 flex items-center gap-2">
              <button
                disabled={!file || isChecking}
                onClick={() => file && handleFiles(file)}
                className={classNames(
                  "px-4 py-2 rounded-md text-white",
                  isChecking ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
                )}
                aria-busy={isChecking}
              >
                {isChecking ? "Checking…" : "Re-run Check"}
              </button>
              {analysis && (
                <span className="text-sm text-gray-500" aria-live="polite">
                  {completeness}% complete
                </span>
              )}
            </div>
          </div>

          {/* Paste text card */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Or Paste RFP Text</h2>
            <textarea
              className="w-full h-44 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Paste relevant RFP sections here (e.g., payment terms, submission deadline, governing law)...`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={async () => {
                  setIsChecking(true);
                  try {
                    const parsed = parseRFP(pasteText || "");
                    setAnalysis(parsed);
                    setFile(null);
                  } finally {
                    setIsChecking(false);
                  }
                }}
                disabled={!pasteText.trim() || isChecking}
                className={classNames(
                  "px-4 py-2 rounded-md text-white",
                  isChecking ? "bg-emerald-300" : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                Analyze Pasted Text
              </button>
              <button
                onClick={() => {
                  setPasteText("");
                  setAnalysis(null);
                  setFile(null);
                }}
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        {analysis && (
          <section className="mt-6">
            {/* Submission countdown card */}
            {submissionCountdown && (
              <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Submission Date</div>
                  <div className="text-lg font-semibold text-slate-800">{submissionCountdown.label}</div>
                </div>
                <div>
                  {submissionCountdown.days == null ? (
                    <span className="text-amber-600 text-sm">Unrecognized date format</span>
                  ) : submissionCountdown.days < 0 ? (
                    <span className="text-red-600 font-semibold">{Math.abs(submissionCountdown.days)} days past deadline</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">{submissionCountdown.days} days remaining</span>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Compliance Analysis Results</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onExportJSON}
                      className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900"
                    >
                      ⬇ JSON
                    </button>
                    <button
                      onClick={onExportCSV}
                      className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900"
                    >
                      ⬇ CSV
                    </button>
                    <button
                      onClick={copyMissing}
                      className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                      title="Copy missing items to clipboard"
                    >
                      📋 Copy Missing
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Review Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Section", "Status", "Extracted Value", "Confidence", "Notes"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 border-b">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REQUIRED_SECTIONS.map((key) => {
                    const r = analysis[key];
                    return (
                      <tr key={key} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-3 border-b font-medium text-slate-800">{key}</td>
                        <td className="px-4 py-3 border-b">
                          {r.found ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-emerald-700 bg-emerald-100 border border-emerald-200">
                              ✅ Found
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-red-700 bg-red-100 border border-red-200">
                              ❌ Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {r.value ? (
                            <span className="text-slate-800">{r.value}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span
                            className={classNames(
                              "font-semibold",
                              r.confidence >= 80
                                ? "text-emerald-700"
                                : r.confidence >= 50
                                ? "text-amber-600"
                                : "text-slate-500"
                            )}
                          >
                            {r.confidence}%
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-slate-500">{r.notes ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Note: This client-side parser is heuristic. For production-grade accuracy, connect a server-side extractor (PDF/DOCX parsing) or an AI model and keep an audit trail of the extracted fields.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
