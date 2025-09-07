import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Target
} from "lucide-react";

export default function Dashboard() {
  const workflowSteps = [
    { id: 1, name: "NDA", category: "Legal", status: "completed", description: "Non-disclosure agreements" },
    { id: 2, name: "Screening", category: "Compliance", status: "completed", description: "Background & compliance checks" },
    { id: 3, name: "RFP", category: "Tendering", status: "completed", description: "Request for proposal" },
    { id: 4, name: "Review", category: "Evaluation", status: "active", description: "Technical & commercial review" },
    { id: 5, name: "Evaluation", category: "Evaluation", status: "pending", description: "Scoring & analysis" },
    { id: 6, name: "Awarding", category: "Contracting", status: "pending", description: "Vendor selection" },
    { id: 7, name: "Contracting", category: "Contracting", status: "pending", description: "Contract finalization" },
    { id: 8, name: "Invoicing", category: "Operations", status: "pending", description: "Payment processing" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "active": return "bg-blue-500";
      case "pending": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "active": return "In Progress";
      case "pending": return "Pending";
      default: return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Management Overview</h1>
            <p className="text-muted-foreground mt-1">
              End-to-end vendor procurement and management workflow
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              New RFQ
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84.2</div>
              <p className="text-xs text-muted-foreground">
                +2.1 from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">
                +18% cost optimization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Procurement Workflow Progress</CardTitle>
            <CardDescription>
              Current status of vendor onboarding and procurement processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">50% Complete</span>
              </div>
              <Progress value={50} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">4</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <div className="text-sm text-muted-foreground">At Risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
            <CardDescription>
              Detailed breakdown of procurement process stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflowSteps.map((step) => (
                <Card key={step.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={step.status === "active" ? "default" : "secondary"}>
                        {step.category}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{step.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(step.status)}
                      </span>
                      {step.id < workflowSteps.length && (
                    step.name === "NDA" ? (
                      <Link href="/nda">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ) : step.name === "RFP" ? (
                      <Link href="/rfp-check">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ) : step.name === "Screening" ? (
                      <Link href="/screening">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ): step.name === "Contracting" ? (
                      <Link href="/contracts">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ) : step.name === "Evaluation" ? (
                      <Link href="/evaluations">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ) : step.name === "Awarding" ? (
                      <Link href="/awarding">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ): step.name === "Review" ? (
                      <Link href="/review">
                        <ArrowRight className="h-3 w-3 text-blue-500 cursor-pointer hover:scale-110 transition" />
                      </Link>
                    ): (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )
                    )}

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest vendor management actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ACME Ltd - Contract Signed</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">TechCorp - Evaluation Pending</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">GlobalSys - Compliance Review Required</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Critical dates requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Vendor Evaluation</p>
                    <p className="text-xs text-muted-foreground">3 vendors pending</p>
                  </div>
                  <Badge variant="destructive">2 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Contract Renewal</p>
                    <p className="text-xs text-muted-foreground">ACME Ltd agreement</p>
                  </div>
                  <Badge variant="outline">5 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Compliance Audit</p>
                    <p className="text-xs text-muted-foreground">Annual review</p>
                  </div>
                  <Badge variant="secondary">1 week</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}