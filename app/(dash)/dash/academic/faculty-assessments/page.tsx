'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../lib/auth/auth-context'
import {
  getFacultyAssignments,
  getAssessmentConfigs,
  createAssessmentConfig,
  getAssessments,
  createAssessment,
  getStudentGrades,
  gradeAssessment,
  getCourseEnrollments,
  type Course,
  type AssessmentConfig,
  type Assessment,
  type StudentGrade,
  type CourseEnrollment
} from '../../../../../lib/api/academic'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card'
import { Button } from '../../../../../components/ui/button'
import { Badge } from '../../../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../components/ui/dialog'
import { Input } from '../../../../../components/ui/input'
import { Label } from '../../../../../components/ui/label'
import { Textarea } from '../../../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table'
import {
  BookOpen,
  Plus,
  Users,
  FileText,
  CheckCircle,
  Clock,
  GraduationCap,
  BarChart3,
  Edit,
  Eye,
  Award,
  Calculator
} from 'lucide-react'

export default function FacultyAssessmentsPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [assessmentConfigs, setAssessmentConfigs] = useState<AssessmentConfig[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Dialog states
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false)
  const [showGradingDialog, setShowGradingDialog] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  // Form states
  const [configForm, setConfigForm] = useState({
    assessment_type: 'quiz',
    category: 'internal',
    name: '',
    description: '',
    max_marks: 100,
    weight_percentage: 10,
    due_date: ''
  })

  const [assessmentForm, setAssessmentForm] = useState({
    config_id: '',
    title: '',
    description: '',
    instructions: '',
    total_marks: 100,
    duration_minutes: 60,
    start_time: '',
    end_time: ''
  })

  const currentSemester = new Date().getFullYear() + ' ' + (new Date().getMonth() < 6 ? 'Spring' : 'Fall')

  // Load faculty data
  const loadFacultyData = async () => {
    if (!user?.user_metadata?.employee_id) return

    try {
      setLoading(true)
      const facultyCourses = await getFacultyAssignments(user.user_metadata.employee_id, currentSemester)
      setCourses(facultyCourses)

      if (facultyCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(facultyCourses[0])
      }
    } catch (error) {
      console.error('Error loading faculty data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load course-specific data
  const loadCourseData = async (courseId: string) => {
    try {
      const [configs, assessmentList, courseEnrollments] = await Promise.all([
        getAssessmentConfigs({ course_id: courseId, semester_year: currentSemester }),
        getAssessments({ course_id: courseId }),
        getCourseEnrollments({ course_id: courseId, semester_year: currentSemester, status: 'enrolled' })
      ])

      setAssessmentConfigs(configs)
      setAssessments(assessmentList)
      setEnrollments(courseEnrollments)

      // Load grades for all assessments
      if (assessmentList.length > 0) {
        const allGrades = await Promise.all(
          assessmentList.map(assessment => getStudentGrades({ assessment_id: assessment.id }))
        )
        setGrades(allGrades.flat())
      }
    } catch (error) {
      console.error('Error loading course data:', error)
    }
  }

  useEffect(() => {
    loadFacultyData()
  }, [user])

  useEffect(() => {
    if (selectedCourse) {
      loadCourseData(selectedCourse.id)
    }
  }, [selectedCourse])

  // Handle assessment config creation
  const handleCreateConfig = async () => {
    if (!selectedCourse || !user?.user_metadata?.employee_id) return

    try {
      await createAssessmentConfig({
        ...configForm,
        course_id: selectedCourse.id,
        semester_year: currentSemester,
        created_by: user.user_metadata.employee_id
      })

      setShowConfigDialog(false)
      setConfigForm({
        assessment_type: 'quiz',
        category: 'internal',
        name: '',
        description: '',
        max_marks: 100,
        weight_percentage: 10,
        due_date: ''
      })

      // Reload data
      if (selectedCourse) {
        loadCourseData(selectedCourse.id)
      }
    } catch (error) {
      console.error('Error creating assessment config:', error)
    }
  }

  // Handle assessment creation
  const handleCreateAssessment = async () => {
    try {
      await createAssessment(assessmentForm)
      setShowAssessmentDialog(false)
      setAssessmentForm({
        config_id: '',
        title: '',
        description: '',
        instructions: '',
        total_marks: 100,
        duration_minutes: 60,
        start_time: '',
        end_time: ''
      })

      // Reload data
      if (selectedCourse) {
        loadCourseData(selectedCourse.id)
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
    }
  }

  // Calculate course statistics
  const getCourseStats = () => {
    const internalConfigs = assessmentConfigs.filter(c => c.category === 'internal')
    const externalConfigs = assessmentConfigs.filter(c => c.category === 'external')
    const totalAssessments = assessments.length
    const gradedAssessments = grades.filter(g => g.is_graded).length
    const pendingGrades = grades.filter(g => g.is_submitted && !g.is_graded).length

    return {
      totalStudents: enrollments.length,
      internalAssessments: internalConfigs.length,
      externalAssessments: externalConfigs.length,
      totalAssessments,
      gradedAssessments,
      pendingGrades,
      averageGrade: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1) : 0
    }
  }

  const courseStats = getCourseStats()

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Assessment Management</h1>
          <p className="text-gray-500 mt-1">Manage assessments, grading, and academic evaluations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedCourse?.id || ''} onValueChange={(value) => {
            const course = courses.find(c => c.id === value)
            setSelectedCourse(course || null)
          }}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedCourse ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Selected</h3>
              <p className="text-gray-500">Select a course to manage assessments and grading</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Course Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrolled Students</p>
                    <p className="text-3xl font-bold text-blue-600">{courseStats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Internal Assessments</p>
                    <p className="text-3xl font-bold text-green-600">{courseStats.internalAssessments}</p>
                    <p className="text-xs text-gray-500">40% weight</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">External Assessments</p>
                    <p className="text-3xl font-bold text-purple-600">{courseStats.externalAssessments}</p>
                    <p className="text-xs text-gray-500">60% weight</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                    <p className="text-3xl font-bold text-orange-600">{courseStats.pendingGrades}</p>
                    <p className="text-xs text-gray-500">Need grading</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="grading">Grading</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Course Code</Label>
                      <p className="text-lg font-semibold">{selectedCourse.code}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Course Name</Label>
                      <p className="text-lg font-semibold">{selectedCourse.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Credits</Label>
                      <p className="text-lg font-semibold">{selectedCourse.credits}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Semester</Label>
                      <p className="text-lg font-semibold">{currentSemester}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{courseStats.internalAssessments}</p>
                        <p className="text-sm text-green-700">Internal (40%)</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{courseStats.externalAssessments}</p>
                        <p className="text-sm text-purple-700">External (60%)</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Grade</span>
                        <span className="font-bold text-lg">{courseStats.averageGrade}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-bold text-lg">
                          {courseStats.totalAssessments > 0 ?
                            ((courseStats.gradedAssessments / courseStats.totalAssessments) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Assessment Management</h3>
                <div className="space-x-2">
                  <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Assessment Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Assessment Configuration</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Assessment Type</Label>
                          <Select value={configForm.assessment_type} onValueChange={(value: any) =>
                            setConfigForm(prev => ({ ...prev, assessment_type: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="test">Test</SelectItem>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="lab">Lab Work</SelectItem>
                              <SelectItem value="participation">Participation</SelectItem>
                              <SelectItem value="final_exam">Final Exam</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={configForm.category} onValueChange={(value: any) =>
                            setConfigForm(prev => ({ ...prev, category: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="internal">Internal (40%)</SelectItem>
                              <SelectItem value="external">External (60%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={configForm.name}
                            onChange={(e) => setConfigForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Weekly Quiz, Midterm Test"
                          />
                        </div>
                        <div>
                          <Label>Weight Percentage</Label>
                          <Input
                            type="number"
                            value={configForm.weight_percentage}
                            onChange={(e) => setConfigForm(prev => ({ ...prev, weight_percentage: Number(e.target.value) }))}
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <Label>Max Marks</Label>
                          <Input
                            type="number"
                            value={configForm.max_marks}
                            onChange={(e) => setConfigForm(prev => ({ ...prev, max_marks: Number(e.target.value) }))}
                            placeholder="100"
                          />
                        </div>
                        <Button onClick={handleCreateConfig} className="w-full">
                          Create Assessment Type
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Assessment Configurations List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assessmentConfigs.map(config => (
                  <Card key={config.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={config.category === 'internal' ? 'default' : 'secondary'}>
                              {config.category === 'internal' ? 'Internal 40%' : 'External 60%'}
                            </Badge>
                            <Badge variant="outline">{config.assessment_type}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Marks:</span>
                          <span className="font-medium">{config.max_marks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{config.weight_percentage}%</span>
                        </div>
                        {config.due_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium">{new Date(config.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 space-x-2">
                        <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setAssessmentForm(prev => ({ ...prev, config_id: config.id }))}
                            >
                              Create Assessment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Assessment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Title</Label>
                                <Input
                                  value={assessmentForm.title}
                                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Assessment title"
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={assessmentForm.description}
                                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Assessment description"
                                />
                              </div>
                              <div>
                                <Label>Total Marks</Label>
                                <Input
                                  type="number"
                                  value={assessmentForm.total_marks}
                                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, total_marks: Number(e.target.value) }))}
                                />
                              </div>
                              <div>
                                <Label>Duration (minutes)</Label>
                                <Input
                                  type="number"
                                  value={assessmentForm.duration_minutes}
                                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                                />
                              </div>
                              <Button onClick={handleCreateAssessment} className="w-full">
                                Create Assessment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Grading Tab */}
            <TabsContent value="grading" className="space-y-6">
              <h3 className="text-xl font-semibold">Student Grading</h3>

              {assessments.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No assessments created yet</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {assessments.map(assessment => {
                    const assessmentGrades = grades.filter(g => g.assessment_id === assessment.id)
                    const submittedCount = assessmentGrades.filter(g => g.is_submitted).length
                    const gradedCount = assessmentGrades.filter(g => g.is_graded).length

                    return (
                      <Card key={assessment.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{assessment.title}</CardTitle>
                              <p className="text-gray-600 mt-1">{assessment.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total Marks: {assessment.total_marks}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{gradedCount}/{submittedCount} Graded</Badge>
                                <Badge variant={assessment.is_published ? 'default' : 'secondary'}>
                                  {assessment.is_published ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {assessmentGrades.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead>Marks Obtained</TableHead>
                                  <TableHead>Percentage</TableHead>
                                  <TableHead>Grade</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {assessmentGrades.map(grade => (
                                  <TableRow key={grade.id}>
                                    <TableCell>
                                      {grade.students?.first_name} {grade.students?.last_name}
                                    </TableCell>
                                    <TableCell>{grade.marks_obtained}/{assessment.total_marks}</TableCell>
                                    <TableCell>{grade.percentage.toFixed(1)}%</TableCell>
                                    <TableCell>
                                      {grade.grade_letter && (
                                        <Badge variant="outline">{grade.grade_letter}</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {grade.is_graded ? (
                                        <Badge variant="default">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Graded
                                        </Badge>
                                      ) : grade.is_submitted ? (
                                        <Badge variant="secondary">
                                          <Clock className="w-3 h-3 mr-1" />
                                          Pending
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">Not Submitted</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {grade.is_submitted && !grade.is_graded && (
                                        <Button size="sm" variant="outline">
                                          <Edit className="w-3 h-3 mr-1" />
                                          Grade
                                        </Button>
                                      )}
                                      {grade.is_graded && (
                                        <Button size="sm" variant="ghost">
                                          <Eye className="w-3 h-3 mr-1" />
                                          View
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Award className="w-8 h-8 mx-auto mb-2" />
                              <p>No student submissions yet</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Grade distribution charts coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Highest Grade:</span>
                        <span className="font-bold">
                          {grades.length > 0 ? Math.max(...grades.map(g => g.percentage)).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowest Grade:</span>
                        <span className="font-bold">
                          {grades.length > 0 ? Math.min(...grades.map(g => g.percentage)).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Grade:</span>
                        <span className="font-bold">{courseStats.averageGrade}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Rate:</span>
                        <span className="font-bold">
                          {grades.length > 0 ?
                            ((grades.filter(g => g.percentage >= 60).length / grades.length) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
