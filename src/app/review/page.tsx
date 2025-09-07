"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, AlertTriangle, XCircle, Users, Shield, DollarSign, BarChart } from "lucide-react";

export default function ReviewPage() {
  const vendor = {
    name: "ACME Ltd",
    country: "USA",
    sector: "IT Solutions",
    complianceScore: 92,
    nda: {
      expiry: "15 Oct 2026",
      governingLaw: "Delaware, USA",
      status: "Signed",
      signedBy: "John Doe",
    },
    screening: {
      aml: "Clear",
      sanctions: "No Match",
      risk: "Low Risk",
    },
    rfp: {
      technical: "Cloud-based ERP with AI-enhanced modules",
      commercial: "USD 2.1M, Net 60 payment terms, 24-month support",
      techScore: 85,
      commScore: 90,
      total: 88,
    },
  };

  const competitors = [
    { name: "TechCorp", tech: 80, comm: 85, total: 83 },
    { name: "GlobalSys", tech: 78, comm: 70, total: 74 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Vendor Review</h1>
          <p className="text-muted-foreground">Consolidated review of NDA, Screening, RFP and compliance data</p>
        </div>

        {/* Vendor Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Snapshot</CardTitle>
            <CardDescription>Basic profile and compliance score</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">{vendor.name}</p>
              <p className="text-xs text-muted-foreground">{vendor.sector}</p>
            </div>
            <div>
              <p className="font-semibold">{vendor.country}</p>
              <p className="text-xs text-muted-foreground">Country</p>
            </div>
            <div>
              <p className="font-semibold">{vendor.complianceScore}%</p>
              <Progress value={vendor.complianceScore} className="h-2 mt-1" />
              <p className="text-xs text-muted-foreground">Compliance Score</p>
            </div>
            <div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* NDA Review */}
        <Card>
          <CardHeader>
            <CardTitle>NDA Review</CardTitle>
            <CardDescription>Summary of signed NDA</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li><strong>Status:</strong> {vendor.nda.status}</li>
              <li><strong>Expiry Date:</strong> {vendor.nda.expiry}</li>
              <li><strong>Governing Law:</strong> {vendor.nda.governingLaw}</li>
              <li><strong>Signed By:</strong> {vendor.nda.signedBy}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Screening & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Screening</CardTitle>
            <CardDescription>AML, Sanctions, and risk evaluation</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Shield className="h-5 w-5 text-green-500" />
              <p className="font-semibold">AML: {vendor.screening.aml}</p>
            </div>
            <div>
              <Shield className="h-5 w-5 text-green-500" />
              <p className="font-semibold">Sanctions: {vendor.screening.sanctions}</p>
            </div>
            <div>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <p className="font-semibold">Risk: {vendor.screening.risk}</p>
            </div>
          </CardContent>
        </Card>

        {/* RFP Review */}
        <Card>
          <CardHeader>
            <CardTitle>RFP Review</CardTitle>
            <CardDescription>Technical and commercial proposal review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Technical Proposal:</strong> {vendor.rfp.technical}</p>
            <p><strong>Commercial Proposal:</strong> {vendor.rfp.commercial}</p>
            <div className="flex items-center justify-between">
              <p>Technical Score: {vendor.rfp.techScore}</p>
              <p>Commercial Score: {vendor.rfp.commScore}</p>
              <p>Total Score: {vendor.rfp.total}</p>
            </div>
            <Progress value={vendor.rfp.total} className="h-2" />
          </CardContent>
        </Card>

        {/* Competitor Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Competitor Benchmark</CardTitle>
            <CardDescription>Comparison with other vendors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {competitors.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span>{c.name}</span>
                <Progress value={c.total} className="w-40" />
                <span className="text-sm">{c.total}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviewer Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Reviewer Decision</CardTitle>
            <CardDescription>Final review and recommendation</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" /> Request Clarification
            </Button>
            <Button variant="destructive">
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
