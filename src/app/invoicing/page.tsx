"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, DollarSign, CheckCircle, XCircle, AlertTriangle, FileText, Download, FileCheck } from "lucide-react";

export default function InvoicingPage() {
  const [poData, setPoData] = useState<any | null>(null);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  const invoices = [
    { number: "INV-1001", vendor: "ACME Ltd", amount: "USD 50,000", due: "20 Sep 2025", status: "Pending Approval" },
    { number: "INV-1002", vendor: "TechCorp", amount: "EUR 80,000", due: "05 Oct 2025", status: "Approved" },
    { number: "INV-1003", vendor: "GlobalSys", amount: "USD 120,000", due: "10 Sep 2025", status: "Overdue" },
  ];

  // Simulate PO upload
  const handleUploadPO = () => {
    const uploadedPO = {
      number: "PO-2001",
      vendor: "ACME Ltd",
      amount: "USD 50,000",
      due: "20 Sep 2025",
      currency: "USD",
    };
    setPoData(uploadedPO);
  };

  // Compare PO with invoice
  const handleCompare = (invoice: any) => {
    if (!poData) {
      alert("Please upload a PO first");
      return;
    }

    const results = {
      vendorMatch: invoice.vendor === poData.vendor,
      amountMatch: invoice.amount === poData.amount,
      dueMatch: invoice.due === poData.due,
      currencyMatch: invoice.amount.startsWith(poData.currency),
    };

    setComparisonResult({ invoice, po: poData, results });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Vendor Invoicing</h1>
          <p className="text-muted-foreground">Manage invoices, payments, compliance, and financial reporting</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Invoice</CardTitle>
            <CardDescription>Upload PDF or document invoices for validation</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Upload Invoice</Button>
            <Button variant="secondary"><FileText className="w-4 h-4 mr-2" /> Generate Invoice</Button>
          </CardContent>
        </Card>

        {/* Upload PO Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Purchase Order</CardTitle>
            <CardDescription>Upload PO to validate against invoices</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button onClick={handleUploadPO} variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Upload PO
            </Button>
            {poData && <Badge className="bg-blue-600 text-white">PO Uploaded: {poData.number}</Badge>}
          </CardContent>
        </Card>

        {/* Invoice List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Track status of all invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-semibold">{inv.number} – {inv.vendor}</p>
                  <p className="text-sm text-muted-foreground">{inv.amount} | Due: {inv.due}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {inv.status === "Pending Approval" && <Badge variant="secondary">{inv.status}</Badge>}
                  {inv.status === "Approved" && <Badge className="bg-green-600 text-white">{inv.status}</Badge>}
                  {inv.status === "Overdue" && <Badge className="bg-red-600 text-white">{inv.status}</Badge>}
                  <Button size="sm" variant="outline"><DollarSign className="w-4 h-4 mr-1" /> Pay</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleCompare(inv)}>
                    <FileCheck className="w-4 h-4 mr-1" /> Compare with PO
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparisonResult && (
          <Card>
            <CardHeader>
              <CardTitle>PO vs Invoice Comparison</CardTitle>
              <CardDescription>Results of validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Invoice:</strong> {comparisonResult.invoice.number}</p>
              <p><strong>PO:</strong> {comparisonResult.po.number}</p>
              <div className="space-y-1">
                <p>Vendor Match: {comparisonResult.results.vendorMatch ? <CheckCircle className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-600" />}</p>
                <p>Amount Match: {comparisonResult.results.amountMatch ? <CheckCircle className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-600" />}</p>
                <p>Due Date Match: {comparisonResult.results.dueMatch ? <CheckCircle className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-600" />}</p>
                <p>Currency Match: {comparisonResult.results.currencyMatch ? <CheckCircle className="inline w-4 h-4 text-green-600" /> : <XCircle className="inline w-4 h-4 text-red-600" />}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Payment trends and cash flow monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p>Paid Invoices: 65%</p>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <p>Pending Invoices: 25%</p>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <p>Overdue Invoices: 10%</p>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Tax */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance & Tax</CardTitle>
            <CardDescription>Ensure invoices meet tax and regulatory requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>VAT / GST:</strong> Automatically validated on invoice upload</p>
            <p><strong>Withholding Tax:</strong> Applied as per vendor country rules</p>
            <p><strong>Cross-border Payments:</strong> FX rate applied on settlement date</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage invoice lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> Approve Invoice
            </Button>
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" /> Hold Invoice
            </Button>
            <Button variant="destructive">
              <XCircle className="w-4 h-4 mr-2" /> Reject Invoice
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" /> Export Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
