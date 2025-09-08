"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";

export default function NDAManagementPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-nda", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error uploading NDA:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">NDA Management</h1>
          <p className="text-muted-foreground">
            Upload and validate NDA documents (expiry, stamps, signatures, metadata).
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload NDA</CardTitle>
            <CardDescription>Upload signed NDA documents for compliance validation</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex items-center space-x-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Choose NDA file</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </CardContent>
        </Card>

        {/* Results */}
        {loading && <p>Processing NDA... please wait.</p>}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Automated checks for this NDA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Extracted Entities</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify(results.entities, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Stamps</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify(results.stamps, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Annotated NDA</h3>
                <a
                  href={`http://127.0.0.1:8000${results.annotated_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <Download className="w-4 h-4" /> <span>Download Annotated PDF</span>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
