'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../lib/auth/auth-context'
import {
  getStudentAcademicProgress,
  getCourseGrades,
  getStudentGrades,
  calculateGPA,
  type CourseGrade,
  type StudentGrade,
  type CourseEnrollment,
  type AcademicRecord
} from '../../../../../lib/api/academic'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card'
import { Badge } from '../../../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs'
import { Progress } from '../../../../../components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table'
import { TrendChart, BarChart } from '../../../../../components/analytics/Charts'
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle,
  Target,
  BarChart3,
  Calendar,
  Star
} from 'lucide-react'

interface AcademicProgress {
  enrollments: CourseEnrollment[]
  grades: CourseGrade[]
  records: AcademicRecord[]
  overallGPA: {
    gpa: number
    totalCredits: number
    qualityPoints: number
  }
  currentCourses: CourseEnrollment[]
  totalCreditsEarned: number
  totalCreditsAttempted: number
}

export default function StudentGradesPage() {
  const { user } = useAuth()
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null)
  const [detailedGrades, setDetailedGrades] = useState<StudentGrade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState<string>('all')

  const currentSemester = new Date().getFullYear() + ' ' + (new Date().getMonth() < 6 ? 'Spring' : 'Fall')

  // Load student academic data
  const loadAcademicData = async () => {
    if (!user?.user_metadata?.student_id) return

    try {
      setLoading(true)
      const progress = await getStudentAcademicProgress(user.user_metadata.student_id)
      setAcademicProgress(progress)

      // Load detailed grades for all assessments
      const allGrades = await getStudentGrades({ student_id: user.user_metadata.student_id })
      setDetailedGrades(allGrades)
    } catch (error) {
      console.error('Error loading academic data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAcademicData()
  }, [user])

  // Calculate semester-wise GPA trend
  const getGPATrend = () => {
    if (!academicProgress) return []

    const semesterGPAs = academicProgress.records.map(record => ({
      date: record.semester_year,
      value: record.semester_gpa
    }))

    return semesterGPAs.sort((a, b) => a.date.localeCompare(b.date))
  }

  // Get grade distribution for charts
  const getGradeDistribution = () => {
    if (!academicProgress) return []

    const gradeCount: Record<string, number> = {}
    academicProgress.grades.forEach(grade => {
      if (grade.final_grade_letter) {
        gradeCount[grade.final_grade_letter] = (gradeCount[grade.final_grade_letter] || 0) + 1
      }
    })

    return Object.entries(gradeCount).map(([grade, count]) => ({
      date: grade,
      value: count
    }))
  }

  // Get current semester performance
  const getCurrentSemesterStats = () => {
    if (!academicProgress) return { courses: 0, avgGPA: 0, completed: 0 }

    const currentGrades = academicProgress.grades.filter(g => g.semester_year === currentSemester)
    const avgGPA = currentGrades.length > 0
      ? currentGrades.reduce((sum, g) => sum + (g.quality_points || 0), 0) / currentGrades.length
      : 0
    const completed = currentGrades.filter(g => g.is_finalized).length

    return {
      courses: academicProgress.currentCourses.length,
      avgGPA: parseFloat(avgGPA.toFixed(2)),
      completed
    }
  }

  // Filter grades by semester
  const getFilteredGrades = () => {
    if (!academicProgress || selectedSemester === 'all') {
      return academicProgress?.grades || []
    }
    return academicProgress.grades.filter(g => g.semester_year === selectedSemester)
  }

  // Get unique semesters
  const getSemesters = () => {
    if (!academicProgress) return []
    const semesters = [...new Set(academicProgress.grades.map(g => g.semester_year))]
    return semesters.sort((a, b) => b.localeCompare(a))
  }

  const currentStats = getCurrentSemesterStats()
  const gpaTrend = getGPATrend()
  const gradeDistribution = getGradeDistribution()
  const filteredGrades = getFilteredGrades()
  const semesters = getSemesters()

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!academicProgress) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Academic Data Found</h3>
              <p className="text-gray-500">Contact your academic advisor to enroll in courses</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Progress</h1>
          <p className="text-gray-500 mt-1">Track your grades, GPA, and academic performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Current Semester</p>
          <p className="text-lg font-semibold">{currentSemester}</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                <p className="text-3xl font-bold text-blue-600">
                  {academicProgress.overallGPA.gpa.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">4.0 scale</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                <p className="text-3xl font-bold text-green-600">{academicProgress.totalCreditsEarned}</p>
                <p className="text-xs text-gray-500">of {academicProgress.totalCreditsAttempted} attempted</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Courses</p>
                <p className="text-3xl font-bold text-purple-600">{currentStats.courses}</p>
                <p className="text-xs text-gray-500">{currentStats.completed} completed</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semester GPA</p>
                <p className="text-3xl font-bold text-orange-600">{currentStats.avgGPA.toFixed(2)}</p>
                <div className="flex items-center mt-1">
                  {currentStats.avgGPA > academicProgress.overallGPA.gpa ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <p className="text-xs text-gray-500">vs overall</p>
                </div>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Degree Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Credits Completion</span>
                <span className="text-sm font-medium">
                  {academicProgress.totalCreditsEarned}/120 credits
                </span>
              </div>
              <Progress
                value={(academicProgress.totalCreditsEarned / 120) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">GPA Target (3.0)</span>
                <span className="text-sm font-medium">
                  {academicProgress.overallGPA.gpa.toFixed(2)}/4.0
                </span>
              </div>
              <Progress
                value={(academicProgress.overallGPA.gpa / 4.0) * 100}
                className="h-2"
              />
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((academicProgress.totalCreditsEarned / 120) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Degree Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <Badge variant={academicProgress.overallGPA.gpa >= 3.0 ? 'default' : 'destructive'}>
                  {academicProgress.overallGPA.gpa >= 3.0 ? 'Good Standing' : 'Academic Warning'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quality Points</span>
                <span className="font-medium">{academicProgress.overallGPA.qualityPoints.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Credits</span>
                <span className="font-medium">{academicProgress.overallGPA.totalCredits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">
                  {academicProgress.totalCreditsAttempted > 0
                    ? ((academicProgress.totalCreditsEarned / academicProgress.totalCreditsAttempted) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Course Grades</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Details</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="transcript">Academic Record</TabsTrigger>
        </TabsList>

        {/* Course Grades Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Course Grades</h3>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredGrades.map(grade => (
              <Card key={grade.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold">{grade.courses?.code}</h4>
                        <Badge variant="outline">{grade.semester_year}</Badge>
                        {grade.is_finalized && (
                          <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Finalized
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{grade.courses?.name}</p>
                      <p className="text-sm text-gray-500">{grade.courses?.credits} credits</p>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {grade.final_grade_letter || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {grade.final_percentage.toFixed(1)}%
                        </p>
                      </div>
                      {grade.quality_points && (
                        <p className="text-xs text-gray-500">
                          {grade.quality_points} quality points
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Internal (40%)</p>
                      <p className="text-lg font-bold text-green-600">
                        {grade.internal_percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-green-700">
                        {grade.internal_obtained_marks}/{grade.internal_total_marks} marks
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">External (60%)</p>
                      <p className="text-lg font-bold text-purple-600">
                        {grade.external_percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-purple-700">
                        {grade.external_obtained_marks}/{grade.external_total_marks} marks
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assessment Details Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <h3 className="text-xl font-semibold">Assessment Breakdown</h3>

          {detailedGrades.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No assessment grades available</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedGrades.map(grade => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{grade.assessments?.assessment_configs?.courses?.code}</p>
                        <p className="text-sm text-gray-500">{grade.assessments?.assessment_configs?.courses?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{grade.assessments?.title}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={grade.assessments?.assessment_configs?.category === 'internal' ? 'default' : 'secondary'}>
                          {grade.assessments?.assessment_configs?.assessment_type}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {grade.assessments?.assessment_configs?.category === 'internal' ? '40%' : '60%'} weight
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {grade.marks_obtained}/{grade.assessments?.total_marks}
                    </TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              title="GPA Trend Over Time"
              data={gpaTrend}
              height={300}
            />

            <BarChart
              title="Grade Distribution"
              data={gradeDistribution}
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Highest Grade:</span>
                  <span className="font-bold">
                    {academicProgress.grades.length > 0
                      ? Math.max(...academicProgress.grades.map(g => g.final_percentage)).toFixed(1) + '%'
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lowest Grade:</span>
                  <span className="font-bold">
                    {academicProgress.grades.length > 0
                      ? Math.min(...academicProgress.grades.map(g => g.final_percentage)).toFixed(1) + '%'
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Grade:</span>
                  <span className="font-bold">
                    {academicProgress.grades.length > 0
                      ? (academicProgress.grades.reduce((sum, g) => sum + g.final_percentage, 0) / academicProgress.grades.length).toFixed(1) + '%'
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>A Grades:</span>
                  <span className="font-bold">
                    {academicProgress.grades.filter(g => g.final_grade_letter?.startsWith('A')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>B Grades:</span>
                  <span className="font-bold">
                    {academicProgress.grades.filter(g => g.final_grade_letter?.startsWith('B')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>C Grades:</span>
                  <span className="font-bold">
                    {academicProgress.grades.filter(g => g.final_grade_letter?.startsWith('C')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Courses:</span>
                  <span className="font-bold text-red-600">
                    {academicProgress.grades.filter(g => g.final_grade_letter === 'F').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold">Dean's List</p>
                  <p className="text-sm text-gray-600">GPA ≥ 3.5</p>
                  <Badge variant={academicProgress.overallGPA.gpa >= 3.5 ? 'default' : 'outline'}>
                    {academicProgress.overallGPA.gpa >= 3.5 ? 'Achieved!' : 'In Progress'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Record Tab */}
        <TabsContent value="transcript" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Official Academic Record</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Academic Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{academicProgress.overallGPA.gpa.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Cumulative GPA</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{academicProgress.totalCreditsEarned}</p>
                  <p className="text-sm text-gray-600">Credits Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{academicProgress.grades.length}</p>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Semester-wise breakdown */}
          <div className="space-y-4">
            {semesters.map(semester => {
              const semesterGrades = academicProgress.grades.filter(g => g.semester_year === semester)
              const semesterGPA = semesterGrades.length > 0
                ? semesterGrades.reduce((sum, g) => sum + (g.quality_points || 0), 0) / semesterGrades.length
                : 0

              return (
                <Card key={semester}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{semester}</CardTitle>
                      <div className="text-right">
                        <p className="font-semibold">Semester GPA: {semesterGPA.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {semesterGrades.reduce((sum, g) => sum + (g.courses?.credits || 0), 0)} credits
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Quality Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semesterGrades.map(grade => (
                          <TableRow key={grade.id}>
                            <TableCell className="font-medium">{grade.courses?.code}</TableCell>
                            <TableCell>{grade.courses?.name}</TableCell>
                            <TableCell>{grade.courses?.credits}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{grade.final_grade_letter || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>{grade.quality_points?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
