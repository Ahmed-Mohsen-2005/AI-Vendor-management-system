"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, DollarSign, CheckCircle, XCircle, AlertTriangle, FileText, Download } from "lucide-react";

export default function InvoicingPage() {
  const invoices = [
    { number: "INV-1001", vendor: "ACME Ltd", amount: "USD 50,000", due: "20 Sep 2025", status: "Pending Approval" },
    { number: "INV-1002", vendor: "TechCorp", amount: "EUR 80,000", due: "05 Oct 2025", status: "Approved" },
    { number: "INV-1003", vendor: "GlobalSys", amount: "USD 120,000", due: "10 Sep 2025", status: "Overdue" },
  ];

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
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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
