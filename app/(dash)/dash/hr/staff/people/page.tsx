'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../../lib/auth/auth-context'
import {
  getEmployees,
  getLeaveRecords,
  getDepartments,
  createLeaveRequest,
  updateLeaveRecord,
  getHRStatistics,
  getPendingLeaveRequests,
  getLeaveBalance,
  type Employee,
  type LeaveRecord,
  type Department,
  type EmployeeFilters,
  type LeaveFilters
} from '../../../../../../lib/api/hr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../../components/ui/card'
import { Button } from '../../../../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../../components/ui/tabs'
import { Badge } from '../../../../../../components/ui/badge'
import { Input } from '../../../../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../../components/ui/dialog'
import { Textarea } from '../../../../../../components/ui/textarea'
import { AdvancedSearch } from '../../../../../../components/search/AdvancedSearch'
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Award,
  User,
  CalendarDays,
  Download,
  Edit2
} from 'lucide-react'

export default function HREmployeeManagementPage() {
  const { user, hasPermission } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRecord[]>([])
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    averageSalary: 0
  })
  const [loading, setLoading] = useState(true)
  const [employeeFilters, setEmployeeFilters] = useState<EmployeeFilters>({})
  const [leaveFilters, setLeaveFilters] = useState<LeaveFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('employees')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [leaveDialog, setLeaveDialog] = useState(false)
  const [approvalDialog, setApprovalDialog] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
  const [leaveFormData, setLeaveFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  })

  useEffect(() => {
    loadData()
  }, [currentPage, employeeFilters, leaveFilters, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load statistics
      const stats = await getHRStatistics()
      setStatistics(stats)

      // Load departments
      const depts = await getDepartments()
      setDepartments(depts)

      // Load pending leave requests if user is manager
      if (hasPermission('manage_employees')) {
        const pending = await getPendingLeaveRequests(user?.id || '')
        setPendingLeaves(pending)
      }

      if (activeTab === 'employees') {
        const { data, totalPages: pages } = await getEmployees(employeeFilters, currentPage, 20)
        setEmployees(data)
        setTotalPages(pages)
      } else if (activeTab === 'leaves') {
        const { data, totalPages: pages } = await getLeaveRecords(leaveFilters, currentPage, 20)
        setLeaveRecords(data)
        setTotalPages(pages)
      }
    } catch (error) {
      console.error('Error loading HR data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLeave = async () => {
    if (!selectedEmployee || !leaveFormData.leave_type || !leaveFormData.start_date || !leaveFormData.end_date) return

    try {
      await createLeaveRequest({
        employee_id: selectedEmployee.id,
        leave_type: leaveFormData.leave_type,
        start_date: leaveFormData.start_date,
        end_date: leaveFormData.end_date,
        reason: leaveFormData.reason
      })

      setLeaveDialog(false)
      setSelectedEmployee(null)
      setLeaveFormData({ leave_type: '', start_date: '', end_date: '', reason: '' })
      loadData() // Refresh data
    } catch (error) {
      console.error('Error creating leave request:', error)
    }
  }

  const handleLeaveApproval = async (approved: boolean) => {
    if (!selectedLeave || !user) return

    try {
      await updateLeaveRecord(selectedLeave.id, {
        status: approved ? 'approved' : 'rejected',
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })

      setApprovalDialog(false)
      setSelectedLeave(null)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error updating leave record:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive': case 'rejected': case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Not disclosed'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HR Employee Management</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive employee records, leave management, and performance tracking
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {hasPermission('manage_employees') && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalEmployees}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.activeEmployees}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.inactiveEmployees}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.pendingLeaves}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Leaves</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.approvedLeaves}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatSalary(statistics.averageSalary)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Leave Requests Alert */}
        {pendingLeaves.length > 0 && hasPermission('manage_employees') && (
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-yellow-800">
                    {pendingLeaves.length} Leave Requests Pending Approval
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" className="border-yellow-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Review All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pendingLeaves.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="bg-white p-3 rounded border border-yellow-200">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {leave.employee?.user?.full_name}
                    </h4>
                    <p className="text-xs text-gray-600">{leave.leave_type}</p>
                    <p className="text-xs text-yellow-600 font-medium">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-auto grid-cols-4">
                  <TabsTrigger value="employees" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Employees</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaves" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Leave Records</span>
                  </TabsTrigger>
                  <TabsTrigger value="departments" className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Departments</span>
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Performance</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-3">
                  <AdvancedSearch
                    onSearch={(searchFilters) => {
                      if (activeTab === 'employees') {
                        setEmployeeFilters({
                          ...employeeFilters,
                          search: searchFilters.query,
                          is_active: searchFilters.status === 'active' ? true : searchFilters.status === 'inactive' ? false : undefined
                        })
                      } else if (activeTab === 'leaves') {
                        setLeaveFilters({
                          ...leaveFilters,
                          search: searchFilters.query,
                          status: searchFilters.status,
                          date_from: searchFilters.dateFrom,
                          date_to: searchFilters.dateTo
                        })
                      }
                      setCurrentPage(1)
                    }}
                    placeholder="Search employees..."
                    statusOptions={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'rejected', label: 'Rejected' }
                    ]}
                  />
                </div>
              </div>

              {/* Employees Tab */}
              <TabsContent value="employees" className="space-y-4">
                <div className="space-y-4">
                  {employees.length > 0 ? (
                    <>
                      {employees.map((employee) => (
                        <Card key={employee.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {employee.user?.full_name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {employee.position} | ID: {employee.employee_id}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {employee.department?.name} - {employee.employment_type}
                                    </p>
                                  </div>
                                  <div>
                                    <Badge className={getStatusColor(employee.is_active ? 'active' : 'inactive')}>
                                      {employee.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Email:</span>
                                    <div className="font-semibold">{employee.user?.email}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Phone:</span>
                                    <div className="font-semibold">{employee.user?.phone || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Hire Date:</span>
                                    <div className="font-semibold">
                                      {new Date(employee.hire_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Salary:</span>
                                    <div className="font-semibold">{formatSalary(employee.salary)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Office:</span>
                                    <div className="font-semibold">{employee.office_location || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Manager:</span>
                                    <div className="font-semibold">
                                      {employee.manager?.user?.full_name || 'None'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedEmployee(employee)
                                    setLeaveDialog(true)
                                  }}
                                  disabled={!hasPermission('manage_employees')}
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Request Leave
                                </Button>
                                <Button size="sm" variant="outline">
                                  <User className="w-4 h-4 mr-2" />
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Pagination */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Showing page {currentPage} of {totalPages}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                      <p className="text-gray-600">No employees match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Leave Records Tab */}
              <TabsContent value="leaves" className="space-y-4">
                <div className="space-y-4">
                  {leaveRecords.length > 0 ? (
                    leaveRecords.map((leave) => (
                      <Card key={leave.id} className={`border-l-4 ${
                        leave.status === 'pending' ? 'border-l-yellow-500' :
                        leave.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {leave.employee?.user?.full_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {leave.leave_type} | {leave.employee?.employee_id}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {leave.employee?.department?.name}
                                  </p>
                                </div>
                                <div>
                                  <Badge className={getStatusColor(leave.status)}>
                                    {leave.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Start Date:</span>
                                  <div className="font-semibold">
                                    {new Date(leave.start_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">End Date:</span>
                                  <div className="font-semibold">
                                    {new Date(leave.end_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Days:</span>
                                  <div className="font-semibold">{leave.days_requested}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Approved By:</span>
                                  <div className="font-semibold">
                                    {leave.approved_by_user?.full_name || 'Pending'}
                                  </div>
                                </div>
                              </div>

                              {leave.reason && (
                                <div className="mt-3">
                                  <span className="text-gray-500 text-sm">Reason:</span>
                                  <p className="text-sm text-gray-700 mt-1">{leave.reason}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2">
                              {leave.status === 'pending' && hasPermission('manage_employees') && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLeave(leave)
                                    setApprovalDialog(true)
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Review
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leave records found</h3>
                      <p className="text-gray-600">No leave records match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-4">
                <div className="space-y-4">
                  {departments.map((department) => (
                    <Card key={department.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {department.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Code: {department.code}
                                </p>
                                {department.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {department.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Head:</span>
                                <div className="font-semibold">
                                  {department.head_of_department?.user?.full_name || 'Not assigned'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Building:</span>
                                <div className="font-semibold">{department.building || 'N/A'}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Employees:</span>
                                <div className="font-semibold">{department.employees_count || 0}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Budget:</span>
                                <div className="font-semibold">{formatSalary(department.budget)}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button size="sm" variant="outline">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Management</h3>
                  <p className="text-gray-600">Performance evaluation module coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Leave Request Dialog */}
        <Dialog open={leaveDialog} onOpenChange={setLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Leave Request</DialogTitle>
              <DialogDescription>
                Submit a leave request for {selectedEmployee?.user?.full_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Leave Type</label>
                <Select value={leaveFormData.leave_type} onValueChange={(value) =>
                  setLeaveFormData({ ...leaveFormData, leave_type: value })
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <Input
                    type="date"
                    value={leaveFormData.start_date}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, start_date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <Input
                    type="date"
                    value={leaveFormData.end_date}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, end_date: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {leaveFormData.start_date && leaveFormData.end_date && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Total days: {calculateLeaveDays(leaveFormData.start_date, leaveFormData.end_date)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Reason (Optional)</label>
                <Textarea
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  placeholder="Provide additional details for the leave request..."
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
                  setLeaveDialog(false)
                  setSelectedEmployee(null)
                  setLeaveFormData({ leave_type: '', start_date: '', end_date: '', reason: '' })
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateLeave}
                  disabled={!leaveFormData.leave_type || !leaveFormData.start_date || !leaveFormData.end_date}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Leave Approval Dialog */}
        <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Leave Request</DialogTitle>
              <DialogDescription>
                Approve or reject leave request from {selectedLeave?.employee?.user?.full_name}
              </DialogDescription>
            </DialogHeader>

            {selectedLeave && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Employee:</span>
                      <div className="font-semibold">{selectedLeave.employee?.user?.full_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Leave Type:</span>
                      <div className="font-semibold">{selectedLeave.leave_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-semibold">
                        {new Date(selectedLeave.start_date).toLocaleDateString()} - {new Date(selectedLeave.end_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Days:</span>
                      <div className="font-semibold">{selectedLeave.days_requested}</div>
                    </div>
                  </div>

                  {selectedLeave.reason && (
                    <div className="mt-3">
                      <span className="text-gray-500 text-sm">Reason:</span>
                      <p className="text-sm text-gray-700 mt-1">{selectedLeave.reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setApprovalDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleLeaveApproval(false)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleLeaveApproval(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
