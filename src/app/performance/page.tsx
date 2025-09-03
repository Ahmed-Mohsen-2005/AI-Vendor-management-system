import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Award,
  FileText,
  Eye,
  Download,
  Plus,
  Clock,
  DollarSign,
  Star,
  Zap,
  Shield
} from "lucide-react";

export default function PerformancePage() {
  const vendors = [
    {
      id: "VD-001",
      name: "ACME Corporation",
      overallScore: 92,
      trend: "up",
      performance: {
        delivery: 94,
        quality: 91,
        cost: 88,
        satisfaction: 95
      },
      kpis: {
        onTimeDelivery: 96,
        qualityScore: 93,
        costOptimization: 87,
        slaCompliance: 92
      },
      lastUpdated: "2024-01-15",
      contractValue: "$1,250,000"
    },
    {
      id: "VD-002",
      name: "TechCorp Solutions",
      overallScore: 76,
      trend: "stable",
      performance: {
        delivery: 75,
        quality: 77,
        cost: 82,
        satisfaction: 70
      },
      kpis: {
        onTimeDelivery: 78,
        qualityScore: 80,
        costOptimization: 85,
        slaCompliance: 72
      },
      lastUpdated: "2024-02-20",
      contractValue: "$850,000"
    },
    {
      id: "VD-003",
      name: "Global Systems Ltd",
      overallScore: 58,
      trend: "down",
      performance: {
        delivery: 60,
        quality: 62,
        cost: 45,
        satisfaction: 65
      },
      kpis: {
        onTimeDelivery: 65,
        qualityScore: 68,
        costOptimization: 40,
        slaCompliance: 58
      },
      lastUpdated: "2024-01-10",
      contractValue: "$650,000"
    },
    {
      id: "VD-004",
      name: "DataFlow Inc",
      overallScore: 89,
      trend: "up",
      performance: {
        delivery: 90,
        quality: 89,
        cost: 85,
        satisfaction: 92
      },
      kpis: {
        onTimeDelivery: 92,
        qualityScore: 90,
        costOptimization: 83,
        slaCompliance: 91
      },
      lastUpdated: "2024-03-01",
      contractValue: "$450,000"
    },
    {
      id: "VD-005",
      name: "InnovateLab",
      overallScore: 84,
      trend: "up",
      performance: {
        delivery: 86,
        quality: 82,
        cost: 88,
        satisfaction: 80
      },
      kpis: {
        onTimeDelivery: 88,
        qualityScore: 85,
        costOptimization: 90,
        slaCompliance: 82
      },
      lastUpdated: "2024-03-15",
      contractValue: "$1,100,000"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable":
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Satisfactory</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive vendor performance metrics and analytics dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
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
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">
                18% optimization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                +1.8% from target
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vendor Performance Overview</CardTitle>
              <CardDescription>
                Real-time performance metrics across all active vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(vendor.trend)}
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-muted-foreground">{vendor.contractValue}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Overall</p>
                        <p className={`text-lg font-bold ${getScoreColor(vendor.overallScore)}`}>
                          {vendor.overallScore}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Delivery</p>
                        <p className={`text-sm font-medium ${getScoreColor(vendor.performance.delivery)}`}>
                          {vendor.performance.delivery}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Quality</p>
                        <p className={`text-sm font-medium ${getScoreColor(vendor.performance.quality)}`}>
                          {vendor.performance.quality}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cost</p>
                        <p className={`text-sm font-medium ${getScoreColor(vendor.performance.cost)}`}>
                          {vendor.performance.cost}
                        </p>
                      </div>
                      <div>
                        {getPerformanceBadge(vendor.overallScore)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Vendor performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Excellent (90+)</span>
                    <span className="text-sm text-muted-foreground">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Good (80-89)</span>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Satisfactory (70-79)</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Needs Improvement (&lt;70)</span>
                    <span className="text-sm text-muted-foreground">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Top Performers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">ACME Corporation</span>
                    </div>
                    <span className="text-sm font-medium">92</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">DataFlow Inc</span>
                    </div>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">InnovateLab</span>
                    </div>
                    <span className="text-sm font-medium">84</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>
              Detailed KPI tracking and performance metrics across all vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Cost Optimization</TableHead>
                    <TableHead>SLA Compliance</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16">
                            <Progress value={vendor.kpis.onTimeDelivery} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(vendor.kpis.onTimeDelivery)}`}>
                            {vendor.kpis.onTimeDelivery}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16">
                            <Progress value={vendor.kpis.qualityScore} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(vendor.kpis.qualityScore)}`}>
                            {vendor.kpis.qualityScore}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16">
                            <Progress value={vendor.kpis.costOptimization} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(vendor.kpis.costOptimization)}`}>
                            {vendor.kpis.costOptimization}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16">
                            <Progress value={vendor.kpis.slaCompliance} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(vendor.kpis.slaCompliance)}`}>
                            {vendor.kpis.slaCompliance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(vendor.trend)}
                          <span className="text-sm capitalize">{vendor.trend}</span>
                        </div>
                      </TableCell>
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

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Quarterly performance analysis and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Q1 2024</p>
                    <p className="text-sm text-muted-foreground">Current Quarter</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">82.4</p>
                    <p className="text-sm text-green-600">+3.2%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Q4 2023</p>
                    <p className="text-sm text-muted-foreground">Previous Quarter</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">79.2</p>
                    <p className="text-sm text-blue-600">+1.8%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Q3 2023</p>
                    <p className="text-sm text-muted-foreground">Three Quarters Ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">77.4</p>
                    <p className="text-sm text-red-600">-0.5%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Q2 2023</p>
                    <p className="text-sm text-muted-foreground">Four Quarters Ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">77.9</p>
                    <p className="text-sm text-green-600">+2.1%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key findings and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Strong Delivery Performance</p>
                    <p className="text-sm text-muted-foreground">
                      87.3% on-time delivery rate shows improvement in vendor reliability
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Cost Optimization Success</p>
                    <p className="text-sm text-muted-foreground">
                      $2.4M in savings achieved through strategic vendor management
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">SLA Compliance Excellence</p>
                    <p className="text-sm text-muted-foreground">
                      94.2% compliance rate exceeds industry standards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <TrendingDown className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Areas for Improvement</p>
                    <p className="text-sm text-muted-foreground">
                      3 vendors require immediate attention for performance issues
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