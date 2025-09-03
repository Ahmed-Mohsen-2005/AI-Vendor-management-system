import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  FileText,
  Eye,
  Download,
  Plus,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react";

export default function EvaluationsPage() {
  const evaluations = [
    {
      id: "EV-001",
      vendor: "ACME Corporation",
      project: "Cloud Infrastructure Services",
      overallScore: 92,
      status: "completed",
      evaluator: "John Smith",
      evaluationDate: "2024-01-15",
      criteria: {
        technical: 95,
        commercial: 88,
        delivery: 94,
        quality: 91
      },
      recommendation: "strong_approve"
    },
    {
      id: "EV-002",
      vendor: "TechCorp Solutions",
      project: "Software Development",
      overallScore: 76,
      status: "in_progress",
      evaluator: "Sarah Johnson",
      evaluationDate: "2024-02-20",
      criteria: {
        technical: 82,
        commercial: 70,
        delivery: 75,
        quality: 77
      },
      recommendation: "pending"
    },
    {
      id: "EV-003",
      vendor: "Global Systems Ltd",
      project: "Network Security Services",
      overallScore: 58,
      status: "completed",
      evaluator: "Mike Chen",
      evaluationDate: "2024-01-10",
      criteria: {
        technical: 65,
        commercial: 45,
        delivery: 60,
        quality: 62
      },
      recommendation: "reject"
    },
    {
      id: "EV-004",
      vendor: "DataFlow Inc",
      project: "Data Analytics Platform",
      overallScore: 89,
      status: "completed",
      evaluator: "Emily Davis",
      evaluationDate: "2024-03-01",
      criteria: {
        technical: 92,
        commercial: 85,
        delivery: 90,
        quality: 89
      },
      recommendation: "approve"
    },
    {
      id: "EV-005",
      vendor: "InnovateLab",
      project: "R&D Services",
      overallScore: 84,
      status: "pending",
      evaluator: "Unassigned",
      evaluationDate: "2024-03-15",
      criteria: {
        technical: 0,
        commercial: 0,
        delivery: 0,
        quality: 0
      },
      recommendation: "pending"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "strong_approve":
        return <Badge className="bg-green-100 text-green-800">Strong Approve</Badge>;
      case "approve":
        return <Badge className="bg-blue-100 text-blue-800">Approve</Badge>;
      case "reject":
        return <Badge className="bg-red-100 text-red-800">Reject</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{recommendation}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <Target className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Evaluations</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive vendor assessment and scoring system for procurement decisions
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New Evaluation
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12% this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.4</div>
              <p className="text-xs text-muted-foreground">
                +3.2 from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Vendors</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                81.4% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Search</CardTitle>
            <CardDescription>Search evaluations by vendor, project, or evaluator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search evaluations by vendor, project, or evaluator..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Status</Button>
                <Button variant="outline">Score Range</Button>
                <Button variant="outline">Date Range</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Evaluation Results</CardTitle>
            <CardDescription>
              Detailed scoring and assessment results for vendor evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evaluation ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Technical</TableHead>
                    <TableHead>Commercial</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.id}</TableCell>
                      <TableCell>{evaluation.vendor}</TableCell>
                      <TableCell className="max-w-xs truncate">{evaluation.project}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(evaluation.overallScore)}
                          <span className={`font-semibold ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${getScoreColor(evaluation.criteria.technical)}`}>
                            {evaluation.criteria.technical || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${getScoreColor(evaluation.criteria.commercial)}`}>
                            {evaluation.criteria.commercial || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${getScoreColor(evaluation.criteria.delivery)}`}>
                            {evaluation.criteria.delivery || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                      <TableCell>{getRecommendationBadge(evaluation.recommendation)}</TableCell>
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

        {/* Evaluation Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>Key assessment areas for vendor evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Technical Capability</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Weight: 30%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Technical expertise, innovation, solution quality, and technical infrastructure assessment
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Commercial Viability</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Weight: 25%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pricing competitiveness, financial stability, cost structure, and value for money analysis
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Delivery Performance</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Weight: 25%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Project management, timeline adherence, resource availability, and delivery capability
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Quality & Service</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Weight: 20%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Service quality, customer support, responsiveness, and overall satisfaction metrics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scoring Distribution</CardTitle>
              <CardDescription>Breakdown of evaluation scores across all vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Excellent (90-100)</span>
                    <span className="text-sm text-muted-foreground">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Good (80-89)</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Satisfactory (70-79)</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Needs Improvement (60-69)</span>
                    <span className="text-sm text-muted-foreground">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Poor (Below 60)</span>
                    <span className="text-sm text-muted-foreground">3%</span>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Recent Evaluations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">ACME Corporation</p>
                      <p className="text-xs text-muted-foreground">Cloud Infrastructure</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">92</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Strong Approve</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">DataFlow Inc</p>
                      <p className="text-xs text-muted-foreground">Data Analytics</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">89</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Approve</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">TechCorp Solutions</p>
                      <p className="text-xs text-muted-foreground">Software Development</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-blue-500" />
                        <span className="text-sm font-medium">76</span>
                      </div>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
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