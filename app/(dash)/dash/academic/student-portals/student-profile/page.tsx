'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../../lib/auth/auth-context'
import { getStudentByUserId, getStudentEnrollments, getStudentFinancialRecords, getStudentLibraryLoans } from '../../../../../../lib/api/students'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../../components/ui/card'
import { Button } from '../../../../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../../components/ui/tabs'
import { Badge } from '../../../../../../components/ui/badge'
import { Input } from '../../../../../../components/ui/input'
import { Textarea } from '../../../../../../components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../../components/ui/avatar'
import {
  User,
  BookOpen,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Star,
  DollarSign,
  Library,
  Clock,
  AlertCircle,
  Edit2,
  Save,
  X
} from 'lucide-react'

interface StudentData {
  id: string
  student_id: string
  program: {
    name: string
    code: string
    department: {
      name: string
    }
  }
  year_level: number
  section: string
  gpa: number
  total_credits: number
  enrollment_status: string
  user: {
    full_name: string
    email: string
    phone: string
    status: string
  }
}

export default function StudentProfilePage() {
  const { user, hasRole } = useAuth()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [enrollments, setEnrollments] = useState([])
  const [financialRecords, setFinancialRecords] = useState([])
  const [libraryLoans, setLibraryLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      loadStudentData()
    }
  }, [user])

  const loadStudentData = async () => {
    try {
      setLoading(true)

      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      // For students, load their own data. For admin/staff, this could be parameterized
      const student = await getStudentByUserId(user.id)

      if (!student) {
        setError('Student profile not found. Please contact administration.')
        return
      }

      setStudentData(student)

      // Load related data in parallel
      const [enrollmentsData, financialData, libraryData] = await Promise.all([
        getStudentEnrollments(student.id),
        getStudentFinancialRecords(student.id),
        getStudentLibraryLoans(student.user_id)
      ])

      setEnrollments(enrollmentsData || [])
      setFinancialRecords(financialData || [])
      setLibraryLoans(libraryData || [])
    } catch (err) {
      console.error('Error loading student data:', err)
      setError('Failed to load student profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'enrolled': case 'active': case 'paid': case 'returned':
        return 'bg-green-100 text-green-800'
      case 'pending': case 'overdue':
        return 'bg-yellow-100 text-yellow-800'
      case 'dropped': case 'suspended': case 'cancelled': case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateTotalPaid = (payments: any[]) => {
    return payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">Unable to Load Profile</h3>
              <p className="text-gray-600">{error || 'Student profile not found.'}</p>
              <Button onClick={loadStudentData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive academic and personal information
            </p>
          </div>
          {hasRole(['admin', 'staff']) && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "outline"}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Student Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                      {studentData.user.full_name?.split(' ').map(n => n[0]).join('') || 'ST'}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {studentData.user.full_name}
                    </h3>
                    <p className="text-gray-600">Student ID: {studentData.student_id}</p>
                    <Badge className={`mt-2 ${getStatusColor(studentData.enrollment_status)}`}>
                      {studentData.enrollment_status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{studentData.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{studentData.user.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <div>{studentData.program.name}</div>
                      <div className="text-xs text-gray-500">{studentData.program.department.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Year {studentData.year_level}, Section {studentData.section}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Academic Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {studentData.gpa?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Current GPA</div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Credits</span>
                  <span className="font-semibold">{studentData.total_credits}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Program Code</span>
                  <span className="font-semibold">{studentData.program.code}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="academic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="academic" className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Academic</span>
                    </TabsTrigger>
                    <TabsTrigger value="financial" className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Financial</span>
                    </TabsTrigger>
                    <TabsTrigger value="library" className="flex items-center space-x-2">
                      <Library className="w-4 h-4" />
                      <span>Library</span>
                    </TabsTrigger>
                    <TabsTrigger value="personal" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Personal</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Academic Records */}
                  <TabsContent value="academic" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Current Enrollments</h3>
                      {enrollments.length > 0 ? (
                        <div className="space-y-3">
                          {enrollments.map((enrollment: any) => (
                            <Card key={enrollment.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {enrollment.course_section?.course?.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {enrollment.course_section?.course?.code} - Section {enrollment.course_section?.section_code}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Credits: {enrollment.course_section?.course?.credits} |
                                      Instructor: {enrollment.course_section?.instructor?.full_name || 'TBA'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={getStatusColor(enrollment.status)}>
                                      {enrollment.status}
                                    </Badge>
                                    {enrollment.final_grade && (
                                      <div className="text-lg font-bold text-green-600 mt-1">
                                        {enrollment.final_grade}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No current enrollments found.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Financial Records */}
                  <TabsContent value="financial" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Financial Records</h3>
                      {financialRecords.length > 0 ? (
                        <div className="space-y-3">
                          {financialRecords.map((record: any) => (
                            <Card key={record.id} className="border-l-4 border-l-green-500">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      Invoice #{record.invoice_number}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {record.fee_structure?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Due: {new Date(record.due_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">
                                      ${record.net_amount?.toFixed(2)}
                                    </div>
                                    <Badge className={getStatusColor(record.status)}>
                                      {record.status}
                                    </Badge>
                                    {record.payments && record.payments.length > 0 && (
                                      <p className="text-xs text-green-600 mt-1">
                                        Paid: ${calculateTotalPaid(record.payments).toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No financial records found.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Library Records */}
                  <TabsContent value="library" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Library Loans</h3>
                      {libraryLoans.length > 0 ? (
                        <div className="space-y-3">
                          {libraryLoans.map((loan: any) => (
                            <Card key={loan.id} className="border-l-4 border-l-purple-500">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {loan.book?.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      ISBN: {loan.book?.isbn}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Borrowed: {new Date(loan.loan_date).toLocaleDateString()} |
                                      Due: {new Date(loan.due_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={getStatusColor(loan.status)}>
                                      {loan.status}
                                    </Badge>
                                    {loan.fine_amount > 0 && (
                                      <div className="text-sm text-red-600 mt-1">
                                        Fine: ${loan.fine_amount}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No library loans found.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Personal Information */}
                  <TabsContent value="personal" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <Input
                            value={studentData.user.full_name}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Student ID</label>
                          <Input
                            value={studentData.student_id}
                            disabled
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <Input
                            value={studentData.user.email}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <Input
                            value={studentData.user.phone || ''}
                            disabled={!isEditing}
                            placeholder="Not provided"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Address</label>
                          <Textarea
                            value=""
                            disabled={!isEditing}
                            placeholder="Address not provided"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-3 pt-4">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
