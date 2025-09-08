"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RFPCheck {
  found: boolean;
  value?: string;
  confidence: number;
}

interface RFPAnalysis {
  "Submission Date": RFPCheck;
  "Payment Terms": RFPCheck;
  Currency: RFPCheck;
  Timeline: RFPCheck;
  "Governing Law": RFPCheck;
}

const INITIAL_ANALYSIS: RFPAnalysis = {
  "Submission Date": { found: false, confidence: 0 },
  "Payment Terms": { found: false, confidence: 0 },
  Currency: { found: false, confidence: 0 },
  Timeline: { found: false, confidence: 0 },
  "Governing Law": { found: false, confidence: 0 },
};

export default function RFPCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [analysis, setAnalysis] = useState<RFPAnalysis>(INITIAL_ANALYSIS);
  const [isChecking, setIsChecking] = useState(false);

  // Ref for hidden input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open the hidden file input
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Transform backend result → frontend analysis
  const transformResult = (result: any): RFPAnalysis => {
    const transformed: RFPAnalysis = { ...INITIAL_ANALYSIS };

    (Object.keys(INITIAL_ANALYSIS) as (keyof RFPAnalysis)[]).forEach((sec) => {
      if (result.sections[sec]) {
        transformed[sec] = {
          found: true,
          value: result.sections[sec],
          confidence: result.too_short.includes(sec) ? 50 : 90,
        };
      } else {
        transformed[sec] = { found: false, confidence: 0 };
      }
    });

    return transformed;
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setIsChecking(true);

      try {
        const formData = new FormData();
        formData.append("file", f);

        const res = await fetch("http://localhost:8000/analyze-rfp", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setAnalysis(transformResult(data.result));
      } catch (err) {
        console.error(err);
        setAnalysis(INITIAL_ANALYSIS);
      } finally {
        setIsChecking(false);
      }
    }
  };

  // Handle pasted text
  const analyzePasted = async () => {
    if (!pasteText.trim()) return;
    setIsChecking(true);

    try {
      const formData = new FormData();
      formData.append("text", pasteText);

      const res = await fetch("http://localhost:8000/analyze-rfp", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAnalysis(transformResult(data.result));
      setFile(null);
    } catch (err) {
      console.error(err);
      setAnalysis(INITIAL_ANALYSIS);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-500" />
        RFP Document Checker
      </h1>

      {/* Upload & Paste Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="p-6 border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-gray-600 text-center">
              Drag & drop or click to upload RFP (PDF/Word/Text)
            </p>

            {/* Hidden input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Trigger button */}
            <Button variant="outline" onClick={handleChooseFile}>
              Choose File
            </Button>

            {file && <p className="text-sm text-gray-500">Selected: {file.name}</p>}
          </CardContent>
        </Card>

        {/* Paste Text */}
        <Card className="p-6">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold">Paste RFP Text</h2>
            </div>
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste RFP text here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <Button onClick={analyzePasted} disabled={isChecking}>
              {isChecking ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Analyze Text
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Object.entries(analysis).map(([key, result]) => (
          <Card
            key={key}
            className="p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{key}</h3>
                {result.found ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              {result.found && result.value && (
                <p className="mt-2 text-gray-700">{result.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
