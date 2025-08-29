import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  Plus,
  UserPlus,
  FileText,
  BarChart3,
  Clock,
  Award,
  Bot,
  AlertTriangle,
  Info,
  Megaphone,
  Brain,
  Target,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from "lucide-react"

// Mock user role - in real app this would come from auth context
const currentUser = {
  role: 'admin', // 'admin' | 'faculty' | 'student' | 'parent'
  name: 'Dr. Jane Smith',
  department: 'Computer Science'
}

// Mock AI analytics data
const aiInsights = {
  atRiskStudents: 23,
  improvingStudents: 67,
  predictedGraduationRate: 89.5,
  recommendedInterventions: 5
}

export default function DashboardPage() {
  // RBAC: Filter content based on user role
  const canViewFinancials = ['admin', 'finance'].includes(currentUser.role)
  const canViewAIAnalytics = ['admin', 'faculty'].includes(currentUser.role)
  const canManageAnnouncements = ['admin'].includes(currentUser.role)

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header with Role-Specific Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to NPIPNG ERP</h1>
        <p className="text-muted-foreground">
          Comprehensive college management system dashboard
          {currentUser.role === 'admin' && ' - Administrator View'}
          {currentUser.role === 'faculty' && ` - Faculty Portal (${currentUser.department})`}
          {currentUser.role === 'student' && ' - Student Portal'}
        </p>
      </div>

      {/* College Announcements & Public Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              College Announcements
              <Badge variant="destructive" className="ml-auto">3 New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-red-500 pl-3 bg-red-50 p-3 rounded-r">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">Urgent: Final Exam Schedule Updated</p>
                  <p className="text-xs text-red-700 mt-1">Computer Science final exams moved to Dec 18-20. Check your updated schedule immediately.</p>
                  <p className="text-xs text-red-600 mt-2">Posted 2 hours ago by Academic Office</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-3 rounded-r">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">New Library Digital Resources Available</p>
                  <p className="text-xs text-blue-700 mt-1">Access to IEEE Xplore and ACM Digital Library now available for all students and faculty.</p>
                  <p className="text-xs text-blue-600 mt-2">Posted 1 day ago by Library Services</p>
                </div>
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-3 bg-green-50 p-3 rounded-r">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Student Achievement Recognition</p>
                  <p className="text-xs text-green-700 mt-1">Congratulations to our programming team for winning the National Coding Competition!</p>
                  <p className="text-xs text-green-600 mt-2">Posted 2 days ago by Principal's Office</p>
                </div>
                <Award className="h-4 w-4 text-green-600 flex-shrink-0" />
              </div>
            </div>

            {canManageAnnouncements && (
              <Button size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Announcement
              </Button>
            )}
          </CardContent>
        </Card>

        {/* College Information Portal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              College Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">Est. 1985</p>
                <p className="text-xs text-muted-foreground">Founded</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-xs text-muted-foreground">Graduate Employment</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Information</h4>
              <div className="text-sm space-y-1">
                <p><strong>Campus:</strong> 45-acre modern facility</p>
                <p><strong>Accreditation:</strong> NABTEB, NBTE Certified</p>
                <p><strong>Programs:</strong> 15 Diploma & Certificate programs</p>
                <p><strong>Industry Partners:</strong> 50+ companies</p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Contact Information</p>
              <p className="text-xs text-blue-700 mt-1">📞 +234-XXX-XXXX | 📧 info@npipng.edu.ng</p>
              <p className="text-xs text-blue-700">📍 National Productivity Institute PNG</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Academic Analytics (Faculty & Admin Only) */}
      {canViewAIAnalytics && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Academic Analytics
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Bot className="mr-1 h-3 w-3" />
                AI Powered
              </Badge>
            </CardTitle>
            <CardDescription>Machine learning insights for academic performance optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">{aiInsights.atRiskStudents}</span>
                </div>
                <p className="text-sm font-medium">At-Risk Students</p>
                <p className="text-xs text-muted-foreground">Predicted low performance</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">{aiInsights.improvingStudents}</span>
                </div>
                <p className="text-sm font-medium">Improving Students</p>
                <p className="text-xs text-muted-foreground">Positive trend detected</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">{aiInsights.predictedGraduationRate}%</span>
                </div>
                <p className="text-sm font-medium">Predicted Graduation</p>
                <p className="text-xs text-muted-foreground">Class of 2025</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600">{aiInsights.recommendedInterventions}</span>
                </div>
                <p className="text-sm font-medium">Interventions</p>
                <p className="text-xs text-muted-foreground">AI recommended actions</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                AI Recommendations
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 bg-red-50 rounded border-l-4 border-red-400">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Immediate Attention Required</p>
                    <p className="text-xs text-muted-foreground">5 students in CS101 showing 78% dropout probability. Schedule counseling sessions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Curriculum Optimization</p>
                    <p className="text-xs text-muted-foreground">Mathematics courses showing 23% higher engagement with practical examples. Consider curriculum update.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Success Pattern Identified</p>
                    <p className="text-xs text-muted-foreground">Students with 90%+ attendance show 95% pass rate. Implement attendance incentives.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12% </span>from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty & Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">98% </span>attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Across 8 departments
            </p>
          </CardContent>
        </Card>

        {canViewFinancials && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (This Month)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">K 245,300</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2% </span>from last month
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Enroll New Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
              <Badge variant="outline" className="ml-auto">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">45 new applications received</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">CS Department faculty meeting</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Fee payment deadline reminder sent</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">AI identified 3 at-risk students</p>
                <p className="text-xs text-muted-foreground">8 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
              <Badge variant="destructive" className="ml-auto">2 Critical</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-red-500 pl-3">
              <p className="text-sm font-medium">Final Examinations</p>
              <p className="text-xs text-muted-foreground">Dec 15-22, 2024</p>
              <Badge variant="destructive" className="mt-1">Critical</Badge>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-sm font-medium">Faculty Development Workshop</p>
              <p className="text-xs text-muted-foreground">Dec 10, 2024</p>
              <Badge variant="default" className="mt-1">Important</Badge>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-sm font-medium">New Student Orientation</p>
              <p className="text-xs text-muted-foreground">Jan 8, 2025</p>
              <Badge variant="secondary" className="mt-1">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial & Academic Performance (Role-based) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Financial Overview - Admin Only */}
        {canViewFinancials && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Financial Overview
              </CardTitle>
              <CardDescription>Current semester financial status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Fee Collection</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Budget Utilization</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Fees</p>
                  <p className="text-lg font-bold text-red-600">K 125,400</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-lg font-bold text-green-600">K 245,300</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Performance
            </CardTitle>
            <CardDescription>Current semester overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Overall Attendance</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Pass Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Average GPA</p>
                <p className="text-lg font-bold">3.24</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graduation Rate</p>
                <p className="text-lg font-bold">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Notifications Panel */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            Priority Notifications
            <Badge variant="destructive" className="ml-auto animate-pulse">5 Unread</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Critical: System Backup Failed</p>
                <p className="text-xs text-muted-foreground">Automatic backup failed at 2:00 AM. Manual backup required immediately.</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Bell className="h-4 w-4 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Fee payment deadline approaching</p>
                <p className="text-xs text-muted-foreground">125 students have pending payments due December 30th</p>
              </div>
              <Badge variant="outline">Reminder</Badge>
            </div>

            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Bot className="h-4 w-4 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI Alert: Performance Drop Detected</p>
                <p className="text-xs text-muted-foreground">3 students showing significant grade decline in Mathematics courses</p>
              </div>
              <Badge variant="default">AI Alert</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
