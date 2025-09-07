"use client";
import { useState } from "react";

export default function RFPCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const res = await fetch("http://localhost:8000/rfp-check", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze RFP");

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing RFP. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <a href="/" className="block hover:text-indigo-400">
            📄 NDA Management
          </a>
          <a href="/rfp-check" className="block text-indigo-400 font-semibold">
            📑 RFP Check
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">RFP Compliance Checker</h1>

        {/* Upload */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Upload RFP Document</h2>
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:border-indigo-400 transition"
          >
            {file ? (
              <p className="text-gray-700">✅ {file.name} uploaded</p>
            ) : (
              <p className="text-gray-500">
                Drag & Drop or <span className="text-indigo-600">Click</span> to
                Upload
              </p>
            )}
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Loader */}
        {loading && <p className="text-indigo-600">Analyzing RFP...</p>}

        {/* Results */}
        {analysis && (
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Compliance Analysis Results
            </h2>

            <div className="space-y-4">
              {Object.keys(analysis.sections).map((sec) => (
                <div
                  key={sec}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="font-medium">{sec}</span>
                  {analysis.sections[sec] ? (
                    <span className="text-green-600 font-semibold">
                      ✅ {analysis.sections[sec]}
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Missing</span>
                  )}
                </div>
              ))}
            </div>

            {/* Extra warnings */}
            {analysis.too_short?.length > 0 && (
              <div className="mt-4 text-yellow-600">
                ⚠️ Sections too short: {analysis.too_short.join(", ")}
              </div>
            )}
            {analysis.missing?.length > 0 && (
              <div className="mt-2 text-red-600">
                ❌ Missing sections: {analysis.missing.join(", ")}
              </div>
            )}

            {/* Status */}
            <div className="mt-6 font-semibold">
              Overall Status:{" "}
              <span
                className={
                  analysis.status.includes("All required")
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {analysis.status}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
