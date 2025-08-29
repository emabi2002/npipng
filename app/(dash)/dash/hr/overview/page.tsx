import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Plus,
  UserPlus,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Award,
  Building,
  Target
} from "lucide-react"

// Mock HR data - in real app this would come from database
const hrMetrics = {
  totalStaff: 187,
  academicStaff: 89,
  nonAcademicStaff: 67,
  laborers: 31,
  activeRecruitment: 12,
  pendingLeaveRequests: 8,
  upcomingAppraisals: 23,
  attendanceRate: 94.5,
  monthlyPayroll: 2847500, // In PNG Kina
  turnoverRate: 5.2
}

const staffCategories = [
  {
    category: 'Academic Staff',
    count: 89,
    icon: GraduationCap,
    color: 'blue',
    roles: ['Professors: 12', 'Lecturers: 45', 'Researchers: 18', 'Lab Assistants: 14'],
    avgSalary: 'K 4,500',
    href: '/dash/hr/academic-staff'
  },
  {
    category: 'Non-Academic Staff',
    count: 67,
    icon: Users,
    color: 'green',
    roles: ['Admin Staff: 25', 'IT Support: 8', 'Library Staff: 12', 'Finance: 10', 'Others: 12'],
    avgSalary: 'K 2,800',
    href: '/dash/hr/non-academic-staff'
  },
  {
    category: 'Laborers & Support',
    count: 31,
    icon: UserCheck,
    color: 'purple',
    roles: ['Cleaners: 15', 'Security: 8', 'Maintenance: 5', 'Drivers: 3'],
    avgSalary: 'K 1,200',
    href: '/dash/hr/laborers'
  }
]

const recentActivities = [
  { type: 'recruitment', message: '5 new applications for Lecturer positions', time: '2 hours ago', status: 'info' },
  { type: 'leave', message: '3 annual leave requests awaiting approval', time: '4 hours ago', status: 'warning' },
  { type: 'payroll', message: 'September payroll processed successfully', time: '1 day ago', status: 'success' },
  { type: 'performance', message: '12 staff appraisals due this month', time: '2 days ago', status: 'info' },
  { type: 'training', message: 'IT training session completed - 25 attendees', time: '3 days ago', status: 'success' }
]

export default function HROverviewPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Human Resources Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive HR management for NPIPNG - Academic, Non-Academic & Support Staff
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrMetrics.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5% </span>from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K {hrMetrics.monthlyPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              September 2024 total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrMetrics.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1% </span>this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recruitment</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrMetrics.activeRecruitment}</div>
            <p className="text-xs text-muted-foreground">
              Open positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Staff Categories</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {staffCategories.map((category) => (
            <Card key={category.category} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md bg-${category.color}-100`}>
                      <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                    </div>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {category.count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Staff Breakdown:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {category.roles.map((role, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Avg Salary:</span>
                  <span className="font-medium text-gray-900">{category.avgSalary}</span>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <a href={category.href}>
                    Manage {category.category}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Employee
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate HR Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appraisal
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent HR Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance & Leave */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance & Leave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Overall Attendance</span>
                <span className="text-sm font-medium">{hrMetrics.attendanceRate}%</span>
              </div>
              <Progress value={hrMetrics.attendanceRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Pending Leave</p>
                <p className="text-lg font-bold text-orange-600">{hrMetrics.pendingLeaveRequests}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave Today</p>
                <p className="text-lg font-bold text-blue-600">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance & Recruitment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance & Recruitment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Staff Retention</span>
                <span className="text-sm font-medium">{100 - hrMetrics.turnoverRate}%</span>
              </div>
              <Progress value={100 - hrMetrics.turnoverRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Appraisals</p>
                <p className="text-lg font-bold text-purple-600">{hrMetrics.upcomingAppraisals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-lg font-bold text-green-600">{hrMetrics.activeRecruitment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            HR Alerts & Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Urgent: 3 employment contracts expiring this month</p>
                <p className="text-xs text-muted-foreground">Requires immediate renewal or termination action</p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Payroll processing due in 5 days</p>
                <p className="text-xs text-muted-foreground">September 2024 payroll should be processed by 25th</p>
              </div>
              <Button size="sm" variant="outline">Process</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
