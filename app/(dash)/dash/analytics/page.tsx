'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../lib/auth/auth-context'
import { getDashboardMetrics, getModuleAnalytics, subscribeToAnalytics, type DashboardMetrics, type ModuleAnalytics } from '../../../../lib/api/analytics'
import { MetricCard } from '../../../../components/analytics/MetricCard'
import { TrendChart, AreaTrendChart, BarChart, DonutChart, HorizontalBarChart } from '../../../../components/analytics/Charts'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import {
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user, hasRole } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [analytics, setAnalytics] = useState<ModuleAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [metricsData, analyticsData] = await Promise.all([
        getDashboardMetrics(),
        getModuleAnalytics()
      ])
      setMetrics(metricsData)
      setAnalytics(analyticsData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAnalytics(() => {
      loadDashboardData()
    })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading analytics dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics || !analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-gray-500 mb-4">There was an error loading the dashboard data.</p>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const libraryCirculationData = [
    { name: 'Total Books', value: metrics.library.totalBooks },
    { name: 'Active Loans', value: metrics.library.activeLoans },
    { name: 'Available', value: metrics.library.totalBooks - metrics.library.activeLoans }
  ]

  const staffDistributionData = analytics.staffPerformance.map(item => ({
    name: item.date,
    value: item.value
  }))

  const popularBooksData = metrics.library.popularBooks.map(book => ({
    date: book.title,
    value: book.loans
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights across all ERP modules</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button variant="outline" onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {hasRole('admin') && (
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={metrics.students.total}
          change={5.2}
          changeType="increase"
          icon={<Users className="w-5 h-5" />}
          description={`${metrics.students.active} active, ${metrics.students.newThisMonth} new this month`}
        />

        <MetricCard
          title="Total Revenue"
          value={metrics.finance.totalRevenue}
          change={8.1}
          changeType="increase"
          icon={<DollarSign className="w-5 h-5" />}
          format="currency"
          description={`${metrics.finance.collectionRate.toFixed(1)}% collection rate`}
        />

        <MetricCard
          title="Library Books"
          value={metrics.library.totalBooks}
          change={2.3}
          changeType="increase"
          icon={<BookOpen className="w-5 h-5" />}
          description={`${metrics.library.activeLoans} currently on loan`}
        />

        <MetricCard
          title="Active Staff"
          value={metrics.hr.activeStaff}
          change={-1.2}
          changeType="decrease"
          icon={<GraduationCap className="w-5 h-5" />}
          description={`${metrics.hr.onLeave} currently on leave`}
        />
      </div>

      {/* Alerts and Important Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-red-600">Attention Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Fees</span>
              <Badge variant="destructive">
                ${metrics.finance.overdueFees.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Books</span>
              <Badge variant="destructive">
                {metrics.library.overdueBooks}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Leave Requests</span>
              <Badge variant="secondary">
                {metrics.hr.pendingLeaves}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-green-600">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Students Graduating</span>
              <Badge variant="default">
                {metrics.students.graduatingThisYear}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Collection Rate</span>
              <Badge variant="default">
                {metrics.finance.collectionRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Library Utilization</span>
              <Badge variant="default">
                {((metrics.library.activeLoans / metrics.library.totalBooks) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Trends
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          title="Student Enrollment Trend"
          data={analytics.enrollmentTrend}
          height={300}
        />

        <AreaTrendChart
          title="Financial Performance"
          data={analytics.financialPerformance}
          height={300}
        />

        <BarChart
          title="Library Usage"
          data={analytics.libraryUsage}
          height={300}
        />

        <DonutChart
          title="Library Book Distribution"
          data={libraryCirculationData}
          height={300}
        />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          title="Popular Books (Most Borrowed)"
          data={popularBooksData}
          height={300}
        />

        <DonutChart
          title="Staff by Department"
          data={staffDistributionData}
          height={300}
        />
      </div>

      {/* Summary Footer */}
      <Card>
        <CardHeader>
          <CardTitle>System Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{metrics.students.total}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${metrics.finance.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{metrics.library.totalBooks}</p>
              <p className="text-sm text-gray-500">Library Books</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{metrics.hr.totalStaff}</p>
              <p className="text-sm text-gray-500">Staff Members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
