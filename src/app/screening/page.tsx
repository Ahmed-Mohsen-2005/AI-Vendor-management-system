import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Plus,
  Users,
  Target
} from "lucide-react";

export default function ScreeningPage() {
  const vendors = [
    {
      id: "VD-001",
      name: "ACME Corporation",
      status: "approved",
      riskLevel: "low",
      overallScore: 92,
      checks: {
        financial: 95,
        compliance: 88,
        security: 94,
        references: 91
      },
      lastScreened: "2024-01-15",
      nextReview: "2024-07-15"
    },
    {
      id: "VD-002",
      name: "TechCorp Solutions",
      status: "pending",
      riskLevel: "medium",
      overallScore: 76,
      checks: {
        financial: 82,
        compliance: 70,
        security: 75,
        references: 77
      },
      lastScreened: "2024-02-20",
      nextReview: "2024-08-20"
    },
    {
      id: "VD-003",
      name: "Global Systems Ltd",
      status: "review",
      riskLevel: "high",
      overallScore: 58,
      checks: {
        financial: 65,
        compliance: 45,
        security: 60,
        references: 62
      },
      lastScreened: "2024-01-10",
      nextReview: "2024-07-10"
    },
    {
      id: "VD-004",
      name: "DataFlow Inc",
      status: "approved",
      riskLevel: "low",
      overallScore: 89,
      checks: {
        financial: 92,
        compliance: 85,
        security: 90,
        references: 89
      },
      lastScreened: "2024-03-01",
      nextReview: "2024-09-01"
    },
    {
      id: "VD-005",
      name: "SecureNet Technologies",
      status: "rejected",
      riskLevel: "critical",
      overallScore: 35,
      checks: {
        financial: 40,
        compliance: 25,
        security: 35,
        references: 40
      },
      lastScreened: "2024-02-15",
      nextReview: "N/A"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "review":
        return <Badge className="bg-orange-100 text-orange-800">Under Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High Risk</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical Risk</Badge>;
      default:
        return <Badge variant="secondary">{risk}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Screening</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive vendor due diligence and compliance screening process
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New Screening
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                In screening database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">
                76.5% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Awaiting assessment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Screening Search</CardTitle>
            <CardDescription>Search vendors and filter by screening status or risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search vendors by name, ID, or compliance status..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Status</Button>
                <Button variant="outline">Risk Level</Button>
                <Button variant="outline">Industry</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Screening Results</CardTitle>
            <CardDescription>
              Comprehensive vendor assessment with compliance and risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Last Screened</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.id}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>{getRiskBadge(vendor.riskLevel)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getScoreColor(vendor.overallScore)}`}>
                            {vendor.overallScore}
                          </span>
                          <div className="w-16">
                            <Progress 
                              value={vendor.overallScore} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${getScoreColor(vendor.checks.compliance)}`}>
                            {vendor.checks.compliance}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${getScoreColor(vendor.checks.security)}`}>
                            {vendor.checks.security}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{vendor.lastScreened}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Screening Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Screening Categories</CardTitle>
              <CardDescription>Key areas assessed during vendor screening</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Financial Stability</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Critical</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Credit analysis, financial statements, revenue stability, and debt assessment
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Compliance & Legal</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Critical</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regulatory compliance, certifications, licenses, and legal history
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Security Assessment</span>
                    </div>
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Information security policies, data protection, and cybersecurity measures
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">References & Reputation</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Medium</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Client references, market reputation, and industry standing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Screening Activities</CardTitle>
              <CardDescription>Latest vendor screening updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ACME Corporation - Approved</p>
                    <p className="text-xs text-muted-foreground">
                      All compliance checks passed • 2 hours ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">TechCorp Solutions - Under Review</p>
                    <p className="text-xs text-muted-foreground">
                      Awaiting additional documentation • 5 hours ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Global Systems Ltd - High Risk Flagged</p>
                    <p className="text-xs text-muted-foreground">
                      Compliance issues identified • 1 day ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">SecureNet Technologies - Rejected</p>
                    <p className="text-xs text-muted-foreground">
                      Failed security assessment • 2 days ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">DataFlow Inc - Approved</p>
                    <p className="text-xs text-muted-foreground">
                      Successfully completed screening • 3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}