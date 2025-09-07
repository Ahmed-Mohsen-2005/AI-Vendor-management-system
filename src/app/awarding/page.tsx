"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, FileText, Users, BarChart, Send, Clock } from "lucide-react";

export default function AwardingPage() {
  const vendors = [
    { name: "ACME Ltd", technical: 85, commercial: 90, compliance: true, total: 92, status: "Selected" },
    { name: "TechCorp", technical: 82, commercial: 80, compliance: true, total: 85, status: "Shortlisted" },
    { name: "GlobalSys", technical: 70, commercial: 75, compliance: false, total: 0, status: "Rejected" },
  ];

  const approvals = [
    { role: "Legal Department", status: "Approved" },
    { role: "Finance Department", status: "Pending" },
    { role: "Procurement Committee", status: "Pending" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Awarding Dashboard</h1>
          <p className="text-muted-foreground">Vendor selection, comparison, and award justification</p>
        </div>

        {/* Decision Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Summary</CardTitle>
            <CardDescription>Overview of bids and final selection</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Bids Received</p>
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Shortlisted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-muted-foreground">Awarded</p>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Comparison</CardTitle>
            <CardDescription>Side-by-side evaluation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vendors.map((vendor, i) => (
              <div key={i} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Technical: {vendor.technical} | Commercial: {vendor.commercial} | Compliance:{" "}
                    {vendor.compliance ? "✔" : "❌"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={vendor.total} className="w-32" />
                  <Badge
                    variant={
                      vendor.status === "Selected"
                        ? "default"
                        : vendor.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {vendor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Justification Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Award Justification</CardTitle>
            <CardDescription>Reasoning behind vendor selection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              ACME Ltd selected due to best technical score and competitive pricing. TechCorp was close but exceeded budget.
            </p>
            <Button variant="outline">Edit Justification</Button>
          </CardContent>
        </Card>

        {/* Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Workflow</CardTitle>
            <CardDescription>Track mandatory sign-offs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvals.map((approval, i) => (
              <div key={i} className="flex items-center justify-between">
                <span>{approval.role}</span>
                <Badge
                  variant={
                    approval.status === "Approved"
                      ? "default"
                      : approval.status === "Rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {approval.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Finalize awarding process</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button className="bg-green-600 text-white">
              <FileText className="w-4 h-4 mr-2" /> Generate Award Letter
            </Button>
            <Button variant="outline">
              <Send className="w-4 h-4 mr-2" /> Notify Vendors
            </Button>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Selection transparency record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-500" />
              <p>ACME Ltd marked as selected (2 hours ago)</p>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="text-red-500" />
              <p>GlobalSys rejected due to compliance issues (1 day ago)</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-500" />
              <p>Evaluation scores finalized (3 days ago)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
