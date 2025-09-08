"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, DollarSign, Download, Trash2 } from "lucide-react";

// --- Types for backend response ---
interface InvoiceResultItem {
  Invoice: string;
  Invoice_Total: number;
  Sufficient: string;
  Vendor?: string;
  Due_Date?: string;
  Status?: string;
  Checks?: {
    "Line Items": boolean;
    "Sales Total": boolean;
    "Grand Total": boolean;
  };
}

interface InvoiceResult {
  PO_Total: number;
  Final_Remaining: number;
  Report_File: string;
  Results: InvoiceResultItem[];
  PO_Ref: string;
}

export default function InvoicingPage() {
  // --- State with correct typing ---
  const [poFile, setPoFile] = useState<File | null>(null);
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handlePoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPoFile(e.target.files[0]);
    }
  };

  const handleInvoiceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInvoiceFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeInvoiceFile = (index: number) => {
    setInvoiceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processInvoices = async () => {
    if (!poFile || invoiceFiles.length === 0) {
      setError("Please select both a PO image and at least one invoice PDF");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("po_file", poFile);
    invoiceFiles.forEach((file) => formData.append("invoices", file));

    try {
      const response = await fetch("http://127.0.0.1:8000/process_invoices/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: InvoiceResult = await response.json();
      setResult(data);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Vendor Invoicing</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, compliance, and financial reporting
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload PO image and invoice PDFs for validation. You can add multiple invoices over
              time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PO File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Purchase Order (Image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePoFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {poFile && <p className="text-sm text-green-600 mt-1">Selected: {poFile.name}</p>}
            </div>

            {/* Invoice Files Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Invoices (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleInvoiceFilesChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {invoiceFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Selected Invoices:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {invoiceFiles.map((file, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex justify-between items-center"
                      >
                        {file.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInvoiceFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Process Button */}
            <Button
              onClick={processInvoices}
              disabled={isProcessing || !poFile || invoiceFiles.length === 0}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Process Documents"}
              <Upload className="w-4 h-4 ml-2" />
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results Summary */}
            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-green-800">Processing Complete!</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">PO Reference:</span> {result.PO_Ref}
                  </div>
                  <div>
                    <span className="font-medium">PO Total:</span> {formatCurrency(result.PO_Total)}
                  </div>
                  <div>
                    <span className="font-medium">Final Remaining:</span>{" "}
                    {formatCurrency(result.Final_Remaining)}
                  </div>
                  <div>
                    <span className="font-medium">Report File:</span> {result.Report_File}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Track status of all invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result && result.Results ? (
              result.Results.map((inv, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {inv.Invoice} – {inv.Vendor || "Vendor"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(inv.Invoice_Total)} | Due: {inv.Due_Date || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {inv.Sufficient === "Yes" ? (
                        <Badge className="bg-green-600 text-white">Approved</Badge>
                      ) : (
                        <Badge variant="secondary">Pending Approval</Badge>
                      )}
                      <Button size="sm" variant="outline">
                        <DollarSign className="w-4 h-4 mr-1" /> Pay
                      </Button>
                    </div>
                  </div>
                  {inv.Checks && (
                    <div className="flex space-x-2 text-xs">
                      <Badge
                        variant={inv.Checks["Line Items"] ? "default" : "destructive"}
                        className={inv.Checks["Line Items"] ? "bg-green-500" : ""}
                      >
                        Line Items: {inv.Checks["Line Items"] ? "OK" : "Fail"}
                      </Badge>
                      <Badge
                        variant={inv.Checks["Sales Total"] ? "default" : "destructive"}
                        className={inv.Checks["Sales Total"] ? "bg-green-500" : ""}
                      >
                        Sales Total: {inv.Checks["Sales Total"] ? "OK" : "Fail"}
                      </Badge>
                      <Badge
                        variant={inv.Checks["Grand Total"] ? "default" : "destructive"}
                        className={inv.Checks["Grand Total"] ? "bg-green-500" : ""}
                      >
                        Grand Total: {inv.Checks["Grand Total"] ? "OK" : "Fail"}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Upload and process documents to see invoice results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
