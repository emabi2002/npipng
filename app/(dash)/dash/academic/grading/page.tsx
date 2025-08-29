'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  Calculator,
  Building2,
  User,
  Calendar,
  AlertCircle,
  Save,
  X,
  Target,
  BookOpen,
  CheckCircle,
  FileText,
  Trophy,
  ClipboardList,
  Award,
  Percent,
  BarChart3,
  TrendingUp
} from "lucide-react"

// Enhanced Types matching NPIPNG structure
interface Assessment {
  id: number
  name: string
  type: 'Assignment' | 'Project' | 'Test'
  category: 'Internal' | 'External' // Internal = Assignments/Projects, External = Tests
  maxMarks: number
  date: string
  weight: number
}

interface StudentAssessmentScore {
  id: number
  studentId: string
  assessmentId: number
  marksObtained: number
  percentage: number
}

interface StudentGradeRecord {
  studentId: string
  studentName: string
  // Internal Assessments (Assignments/Projects) - up to 10 records
  internalAssessments: StudentAssessmentScore[]
  // External Tests - up to 10 records
  externalTests: StudentAssessmentScore[]
  // Calculated scores
  internalAverage: number // Average of assignments/projects
  externalAverage: number // Average of tests
  continuousAssessment: number // Weighted CA (Internal 40% + External 60% of internal)
  finalExamScore: number // Final exam out of 100
  midSemesterScore: number // Mid-semester score
  totalScore: number // Final calculated score
  letterGrade: string
  gradePoints: number
  rank: number
  status: 'Active' | 'Withdrawn' | 'Incomplete'
}

interface CourseGradingSheet {
  id: number
  courseCode: string
  courseName: string
  department: string
  program: string
  stage: number
  semester: string
  academicYear: string
  lecturer: string
  hod: string
  // Assessment configurations
  internalAssessments: Assessment[] // Projects/Assignments (40% of internal)
  externalTests: Assessment[] // Tests (60% of internal)
  finalExamConfig: {
    totalMarks: number
    date: string
    duration: number
  }
  // Student records
  students: StudentGradeRecord[]
  // Statistics
  statistics: {
    classAverage: number
    standardDeviation: number
    gradeDistribution: { [grade: string]: number }
    totalStudents: number
    passRate: number
  }
  status: 'Setup' | 'In Progress' | 'Completed' | 'Published'
  lastUpdated: string
}

// Grade Scale (matching NPIPNG standards)
const gradeScale = [
  { grade: 'A', minPercentage: 80, maxPercentage: 100, gradePoints: 4.0, description: 'Excellent' },
  { grade: 'B', minPercentage: 65, maxPercentage: 79, gradePoints: 3.0, description: 'Good' },
  { grade: 'C', minPercentage: 50, maxPercentage: 64, gradePoints: 2.0, description: 'Satisfactory' },
  { grade: 'D', minPercentage: 40, maxPercentage: 49, gradePoints: 1.0, description: 'Pass' },
  { grade: 'F', minPercentage: 0, maxPercentage: 39, gradePoints: 0.0, description: 'Fail' }
]

// Mock Database Data (matching spreadsheet structure)
const mockGradingSheets: CourseGradingSheet[] = [
  {
    id: 1,
    courseCode: 'DBSC 1001',
    courseName: 'Accounting 1',
    department: 'Business Studies',
    program: 'Diploma in Business Computing',
    stage: 1,
    semester: 'Semester 1',
    academicYear: '2025',
    lecturer: 'Ms S. Wanasi',
    hod: 'Mr. Mathew Kolge',
    internalAssessments: [
      { id: 1, name: 'Assignment 1', type: 'Assignment', category: 'Internal', maxMarks: 100, date: '2025-03-15', weight: 20 },
      { id: 2, name: 'Assignment 2', type: 'Assignment', category: 'Internal', maxMarks: 100, date: '2025-04-10', weight: 20 },
      { id: 3, name: 'Project 1', type: 'Project', category: 'Internal', maxMarks: 100, date: '2025-05-15', weight: 25 },
      { id: 4, name: 'Project 2', type: 'Project', category: 'Internal', maxMarks: 100, date: '2025-06-10', weight: 35 }
    ],
    externalTests: [
      { id: 5, name: 'Test 1', type: 'Test', category: 'External', maxMarks: 100, date: '2025-04-20', weight: 25 },
      { id: 6, name: 'Test 2', type: 'Test', category: 'External', maxMarks: 100, date: '2025-05-25', weight: 25 },
      { id: 7, name: 'Test 3', type: 'Test', category: 'External', maxMarks: 100, date: '2025-06-20', weight: 25 },
      { id: 8, name: 'Test 4', type: 'Test', category: 'External', maxMarks: 100, date: '2025-07-15', weight: 25 }
    ],
    finalExamConfig: {
      totalMarks: 100,
      date: '2025-08-15',
      duration: 180
    },
    students: [
      {
        studentId: 'ST001',
        studentName: 'ANEKAU Bhunel',
        internalAssessments: [
          { id: 1, studentId: 'ST001', assessmentId: 1, marksObtained: 94, percentage: 94 },
          { id: 2, studentId: 'ST001', assessmentId: 2, marksObtained: 95, percentage: 95 },
          { id: 3, studentId: 'ST001', assessmentId: 3, marksObtained: 93, percentage: 93 },
          { id: 4, studentId: 'ST001', assessmentId: 4, marksObtained: 96, percentage: 96 }
        ],
        externalTests: [
          { id: 5, studentId: 'ST001', assessmentId: 5, marksObtained: 72, percentage: 72 },
          { id: 6, studentId: 'ST001', assessmentId: 6, marksObtained: 82, percentage: 82 },
          { id: 7, studentId: 'ST001', assessmentId: 7, marksObtained: 83, percentage: 83 },
          { id: 8, studentId: 'ST001', assessmentId: 8, marksObtained: 79, percentage: 79 }
        ],
        internalAverage: 94.5,
        externalAverage: 79,
        continuousAssessment: 85, // (94.5 * 0.4) + (79 * 0.6) = 85.2
        finalExamScore: 78,
        midSemesterScore: 75,
        totalScore: 82, // (85 * 0.4) + (78 * 0.6) = 81.6
        letterGrade: 'A',
        gradePoints: 4.0,
        rank: 5,
        status: 'Active'
      },
      {
        studentId: 'ST002',
        studentName: 'ARIS Vanani',
        internalAssessments: [
          { id: 9, studentId: 'ST002', assessmentId: 1, marksObtained: 68, percentage: 68 },
          { id: 10, studentId: 'ST002', assessmentId: 2, marksObtained: 76, percentage: 76 },
          { id: 11, studentId: 'ST002', assessmentId: 3, marksObtained: 94, percentage: 94 },
          { id: 12, studentId: 'ST002', assessmentId: 4, marksObtained: 68, percentage: 68 }
        ],
        externalTests: [
          { id: 13, studentId: 'ST002', assessmentId: 5, marksObtained: 65, percentage: 65 },
          { id: 14, studentId: 'ST002', assessmentId: 6, marksObtained: 88, percentage: 88 },
          { id: 15, studentId: 'ST002', assessmentId: 7, marksObtained: 90, percentage: 90 },
          { id: 16, studentId: 'ST002', assessmentId: 8, marksObtained: 78, percentage: 78 }
        ],
        internalAverage: 76.5,
        externalAverage: 80.25,
        continuousAssessment: 78.75, // (76.5 * 0.4) + (80.25 * 0.6)
        finalExamScore: 53,
        midSemesterScore: 81,
        totalScore: 63, // (78.75 * 0.4) + (53 * 0.6)
        letterGrade: 'C',
        gradePoints: 2.0,
        rank: 9,
        status: 'Active'
      },
      {
        studentId: 'ST003',
        studentName: 'AWARI Ephraim',
        internalAssessments: [
          { id: 17, studentId: 'ST003', assessmentId: 1, marksObtained: 38, percentage: 38 },
          { id: 18, studentId: 'ST003', assessmentId: 2, marksObtained: 60, percentage: 60 },
          { id: 19, studentId: 'ST003', assessmentId: 3, marksObtained: 94, percentage: 94 },
          { id: 20, studentId: 'ST003', assessmentId: 4, marksObtained: 68, percentage: 68 }
        ],
        externalTests: [
          { id: 21, studentId: 'ST003', assessmentId: 5, marksObtained: 78, percentage: 78 },
          { id: 22, studentId: 'ST003', assessmentId: 6, marksObtained: 58, percentage: 58 },
          { id: 23, studentId: 'ST003', assessmentId: 7, marksObtained: 64, percentage: 64 },
          { id: 24, studentId: 'ST003', assessmentId: 8, marksObtained: 58, percentage: 58 }
        ],
        internalAverage: 65,
        externalAverage: 64.5,
        continuousAssessment: 64.7, // (65 * 0.4) + (64.5 * 0.6)
        finalExamScore: 45,
        midSemesterScore: 72,
        totalScore: 53, // (64.7 * 0.4) + (45 * 0.6)
        letterGrade: 'C',
        gradePoints: 2.0,
        rank: 17,
        status: 'Active'
      }
    ],
    statistics: {
      classAverage: 74,
      standardDeviation: 14,
      gradeDistribution: { 'A': 4, 'B': 10, 'C': 4, 'D': 2, 'F': 2 },
      totalStudents: 22,
      passRate: 91
    },
    status: 'In Progress',
    lastUpdated: '2025-06-15'
  }
]

const departments = ['Business Studies', 'Information Technology', 'Engineering', 'Health Sciences', 'Agriculture']
const programs = [
  'Diploma in Business Computing',
  'Certificate in Information Technology',
  'Bachelor of Engineering (Electrical)',
  'Certificate in Community Health',
  'Diploma in Sustainable Agriculture'
]

export default function NPIPNGGradingSystem() {
  // State management
  const [gradingSheets, setGradingSheets] = useState<CourseGradingSheet[]>(mockGradingSheets)
  const [selectedSheet, setSelectedSheet] = useState<CourseGradingSheet | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false)
  const [gradeEntryDialogOpen, setGradeEntryDialogOpen] = useState(false)
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentGradeRecord | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form states
  const [sheetForm, setSheetForm] = useState({
    courseCode: '',
    courseName: '',
    department: '',
    program: '',
    stage: 1,
    semester: 'Semester 1',
    academicYear: '2025',
    lecturer: '',
    hod: ''
  })

  // Assessment form state
  const [assessmentForm, setAssessmentForm] = useState({
    name: '',
    type: 'Assignment' as 'Assignment' | 'Project' | 'Test',
    category: 'Internal' as 'Internal' | 'External',
    maxMarks: 100,
    date: '',
    weight: 25
  })

  // Grade entry state
  const [gradeEntryForm, setGradeEntryForm] = useState({
    studentId: '',
    assessmentId: 0,
    marksObtained: 0
  })

  // Helper functions
  const calculateGrade = (percentage: number) => {
    const scale = gradeScale.find(g => percentage >= g.minPercentage && percentage <= g.maxPercentage)
    return scale || gradeScale[gradeScale.length - 1]
  }

  const calculateStudentTotal = (student: StudentGradeRecord) => {
    // Internal: 40% total (Assignments/Projects 40% + Tests 60% of internal)
    const internalScore = (student.internalAverage * 0.4) + (student.externalAverage * 0.6)
    const internalWeighted = internalScore * 0.4

    // Final Exam: 60%
    const finalWeighted = student.finalExamScore * 0.6

    return Math.round((internalWeighted + finalWeighted) * 100) / 100
  }

  // Assessment management functions
  const handleAddAssessment = () => {
    if (!selectedSheet) return

    const newAssessment: Assessment = {
      id: Math.max(...selectedSheet.internalAssessments.concat(selectedSheet.externalTests).map(a => a.id), 0) + 1,
      ...assessmentForm,
      date: assessmentForm.date || new Date().toISOString().split('T')[0]
    }

    const updatedSheet = { ...selectedSheet }
    if (assessmentForm.category === 'Internal') {
      updatedSheet.internalAssessments = [...updatedSheet.internalAssessments, newAssessment]
    } else {
      updatedSheet.externalTests = [...updatedSheet.externalTests, newAssessment]
    }

    setGradingSheets(gradingSheets.map(sheet => sheet.id === selectedSheet.id ? updatedSheet : sheet))
    setSelectedSheet(updatedSheet)
    resetAssessmentForm()
    setAssessmentDialogOpen(false)
  }

  const resetAssessmentForm = () => {
    setAssessmentForm({
      name: '',
      type: 'Assignment',
      category: 'Internal',
      maxMarks: 100,
      date: '',
      weight: 25
    })
  }

  // Transcript generation
  const generateTranscript = (student: StudentGradeRecord) => {
    if (!selectedSheet) return

    const transcript = {
      studentId: student.studentId,
      studentName: student.studentName,
      course: {
        code: selectedSheet.courseCode,
        name: selectedSheet.courseName,
        credits: 3, // Standard credit hours
        department: selectedSheet.department,
        program: selectedSheet.program,
        stage: selectedSheet.stage,
        semester: selectedSheet.semester,
        academicYear: selectedSheet.academicYear
      },
      assessments: {
        internal: {
          components: selectedSheet.internalAssessments.map(assessment => {
            const score = student.internalAssessments.find(s => s.assessmentId === assessment.id)
            return {
              name: assessment.name,
              type: assessment.type,
              maxMarks: assessment.maxMarks,
              marksObtained: score?.marksObtained || 0,
              percentage: score?.percentage || 0,
              weight: assessment.weight
            }
          }),
          average: student.internalAverage,
          weightedScore: student.internalAverage * 0.4
        },
        external: {
          components: selectedSheet.externalTests.map(test => {
            const score = student.externalTests.find(s => s.assessmentId === test.id)
            return {
              name: test.name,
              type: test.type,
              maxMarks: test.maxMarks,
              marksObtained: score?.marksObtained || 0,
              percentage: score?.percentage || 0,
              weight: test.weight
            }
          }),
          average: student.externalAverage,
          weightedScore: student.externalAverage * 0.6
        },
        finalExam: {
          marks: student.finalExamScore,
          weightedScore: student.finalExamScore * 0.6
        }
      },
      grading: {
        continuousAssessment: student.continuousAssessment,
        totalScore: student.totalScore,
        letterGrade: student.letterGrade,
        gradePoints: student.gradePoints,
        rank: student.rank,
        classSize: selectedSheet.students.length
      },
      staff: {
        lecturer: selectedSheet.lecturer,
        hod: selectedSheet.hod
      },
      generatedDate: new Date().toISOString().split('T')[0]
    }

    return transcript
  }

  // Statistics calculation
  const stats = {
    totalSheets: gradingSheets.length,
    activeSheets: gradingSheets.filter(s => s.status === 'In Progress').length,
    completedSheets: gradingSheets.filter(s => s.status === 'Completed').length,
    totalStudents: gradingSheets.reduce((sum, s) => sum + s.students.length, 0),
    averageClassSize: Math.round(gradingSheets.reduce((sum, s) => sum + s.students.length, 0) / Math.max(gradingSheets.length, 1))
  }

  // CRUD Operations
  const handleAddSheet = () => {
    const newSheet: CourseGradingSheet = {
      id: Math.max(...gradingSheets.map(s => s.id)) + 1,
      ...sheetForm,
      internalAssessments: [],
      externalTests: [],
      finalExamConfig: { totalMarks: 100, date: '', duration: 180 },
      students: [],
      statistics: {
        classAverage: 0,
        standardDeviation: 0,
        gradeDistribution: {},
        totalStudents: 0,
        passRate: 0
      },
      status: 'Setup',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    setGradingSheets([...gradingSheets, newSheet])
    resetForm()
    setDialogOpen(false)
  }

  const resetForm = () => {
    setSheetForm({
      courseCode: '',
      courseName: '',
      department: '',
      program: '',
      stage: 1,
      semester: 'Semester 1',
      academicYear: '2025',
      lecturer: '',
      hod: ''
    })
  }

  // Filter functions
  const filteredSheets = gradingSheets.filter(sheet => {
    const matchesSearch = sheet.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || sheet.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || sheet.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            NPIPNG Assessment & Grading System
          </h1>
          <p className="text-gray-600">
            Database-driven assessment system with Internal (40%) and Final Exam (60%) weighting
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTranscriptDialogOpen(true)} disabled={!selectedStudent}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Transcript
          </Button>
          <Button variant="outline" onClick={() => setAssessmentDialogOpen(true)} disabled={!selectedSheet}>
            <Target className="mr-2 h-4 w-4" />
            Add Assessment
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Assessment Sheet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Assessment Sheet</DialogTitle>
                <DialogDescription>
                  Setup a new course assessment sheet following NPIPNG standards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input
                      id="courseCode"
                      value={sheetForm.courseCode}
                      onChange={(e) => setSheetForm({...sheetForm, courseCode: e.target.value.toUpperCase()})}
                      placeholder="DBSC 1001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      value={sheetForm.courseName}
                      onChange={(e) => setSheetForm({...sheetForm, courseName: e.target.value})}
                      placeholder="Accounting 1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={sheetForm.department} onValueChange={(value) => setSheetForm({...sheetForm, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Select value={sheetForm.program} onValueChange={(value) => setSheetForm({...sheetForm, program: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(prog => (
                          <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stage">Stage</Label>
                    <Input
                      id="stage"
                      type="number"
                      value={sheetForm.stage}
                      onChange={(e) => setSheetForm({...sheetForm, stage: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={sheetForm.semester} onValueChange={(value) => setSheetForm({...sheetForm, semester: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Semester 1">Semester 1</SelectItem>
                        <SelectItem value="Semester 2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={sheetForm.academicYear}
                      onChange={(e) => setSheetForm({...sheetForm, academicYear: e.target.value})}
                      placeholder="2025"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lecturer">Lecturer</Label>
                    <Input
                      id="lecturer"
                      value={sheetForm.lecturer}
                      onChange={(e) => setSheetForm({...sheetForm, lecturer: e.target.value})}
                      placeholder="Ms S. Wanasi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hod">Head of Department</Label>
                    <Input
                      id="hod"
                      value={sheetForm.hod}
                      onChange={(e) => setSheetForm({...sheetForm, hod: e.target.value})}
                      placeholder="Mr. Mathew Kolge"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleAddSheet}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Sheet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Assessment Configuration Dialog */}
          <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Assessment</DialogTitle>
                <DialogDescription>
                  Configure a new assessment for {selectedSheet?.courseName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assessmentName">Assessment Name</Label>
                    <Input
                      id="assessmentName"
                      value={assessmentForm.name}
                      onChange={(e) => setAssessmentForm({...assessmentForm, name: e.target.value})}
                      placeholder="Assignment 1, Project 1, Test 1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessmentType">Assessment Type</Label>
                    <Select value={assessmentForm.type} onValueChange={(value: 'Assignment' | 'Project' | 'Test') => setAssessmentForm({...assessmentForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assessmentCategory">Category</Label>
                    <Select value={assessmentForm.category} onValueChange={(value: 'Internal' | 'External') => setAssessmentForm({...assessmentForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internal">Internal (Assignments/Projects)</SelectItem>
                        <SelectItem value="External">External (Tests)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxMarks">Maximum Marks</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      value={assessmentForm.maxMarks}
                      onChange={(e) => setAssessmentForm({...assessmentForm, maxMarks: parseInt(e.target.value) || 100})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assessmentDate">Assessment Date</Label>
                    <Input
                      id="assessmentDate"
                      type="date"
                      value={assessmentForm.date}
                      onChange={(e) => setAssessmentForm({...assessmentForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (%)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={assessmentForm.weight}
                      onChange={(e) => setAssessmentForm({...assessmentForm, weight: parseInt(e.target.value) || 25})}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Weighting System:</strong> Internal assessments (assignments/projects) are weighted 40% of internal component,
                    while external tests are weighted 60% of internal component. Final exam contributes 60% to total grade.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleAddAssessment}>
                  <Save className="mr-2 h-4 w-4" />
                  Add Assessment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Transcript Generation Dialog */}
          <Dialog open={transcriptDialogOpen} onOpenChange={setTranscriptDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Student Transcript</DialogTitle>
                <DialogDescription>
                  Official academic transcript for {selectedStudent?.studentName}
                </DialogDescription>
              </DialogHeader>
              {selectedStudent && selectedSheet && (
                <div className="space-y-6">
                  {/* Transcript Header */}
                  <div className="text-center border-b pb-4">
                    <h2 className="text-xl font-bold text-blue-900">The National Polytechnic Institute of Papua New Guinea</h2>
                    <p className="text-lg font-semibold text-blue-800 mt-2">OFFICIAL ACADEMIC TRANSCRIPT</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="text-left">
                        <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                        <p><strong>Student Name:</strong> {selectedStudent.studentName}</p>
                        <p><strong>Program:</strong> {selectedSheet.program}</p>
                      </div>
                      <div className="text-right">
                        <p><strong>Department:</strong> {selectedSheet.department}</p>
                        <p><strong>Academic Year:</strong> {selectedSheet.academicYear}</p>
                        <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Course Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Course Code:</strong> {selectedSheet.courseCode}</p>
                        <p><strong>Course Name:</strong> {selectedSheet.courseName}</p>
                        <p><strong>Stage:</strong> {selectedSheet.stage}</p>
                      </div>
                      <div>
                        <p><strong>Semester:</strong> {selectedSheet.semester}</p>
                        <p><strong>Lecturer:</strong> {selectedSheet.lecturer}</p>
                        <p><strong>Credit Units:</strong> 3</p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Assessment Breakdown</h3>

                    {/* Internal Assessments */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Internal Assessments (40% Total Weight)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Assessment</th>
                              <th className="text-center p-2">Type</th>
                              <th className="text-center p-2">Max Marks</th>
                              <th className="text-center p-2">Obtained</th>
                              <th className="text-center p-2">Percentage</th>
                              <th className="text-center p-2">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSheet.internalAssessments.map(assessment => {
                              const score = selectedStudent.internalAssessments.find(s => s.assessmentId === assessment.id)
                              return (
                                <tr key={assessment.id} className="border-b">
                                  <td className="p-2 font-medium">{assessment.name}</td>
                                  <td className="text-center p-2">{assessment.type}</td>
                                  <td className="text-center p-2">{assessment.maxMarks}</td>
                                  <td className="text-center p-2">{score?.marksObtained || 0}</td>
                                  <td className="text-center p-2">{score?.percentage || 0}%</td>
                                  <td className="text-center p-2">{assessment.weight}%</td>
                                </tr>
                              )
                            })}
                            <tr className="bg-blue-100 font-semibold">
                              <td colSpan={4} className="text-right p-2">Internal Average:</td>
                              <td className="text-center p-2">{selectedStudent.internalAverage}%</td>
                              <td className="text-center p-2">40%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* External Tests */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">External Tests (60% of Internal)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Test</th>
                              <th className="text-center p-2">Max Marks</th>
                              <th className="text-center p-2">Obtained</th>
                              <th className="text-center p-2">Percentage</th>
                              <th className="text-center p-2">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSheet.externalTests.map(test => {
                              const score = selectedStudent.externalTests.find(s => s.assessmentId === test.id)
                              return (
                                <tr key={test.id} className="border-b">
                                  <td className="p-2 font-medium">{test.name}</td>
                                  <td className="text-center p-2">{test.maxMarks}</td>
                                  <td className="text-center p-2">{score?.marksObtained || 0}</td>
                                  <td className="text-center p-2">{score?.percentage || 0}%</td>
                                  <td className="text-center p-2">{test.weight}%</td>
                                </tr>
                              )
                            })}
                            <tr className="bg-green-100 font-semibold">
                              <td colSpan={3} className="text-right p-2">External Average:</td>
                              <td className="text-center p-2">{selectedStudent.externalAverage}%</td>
                              <td className="text-center p-2">60%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Final Grade Summary */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Final Grade Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Continuous Assessment (40%):</strong> {selectedStudent.continuousAssessment}%</p>
                          <p><strong>Final Examination (60%):</strong> {selectedStudent.finalExamScore}%</p>
                          <p><strong>Total Score:</strong> {selectedStudent.totalScore}%</p>
                        </div>
                        <div>
                          <p><strong>Letter Grade:</strong> <Badge variant="default">{selectedStudent.letterGrade}</Badge></p>
                          <p><strong>Grade Points:</strong> {selectedStudent.gradePoints}</p>
                          <p><strong>Class Rank:</strong> {selectedStudent.rank} of {selectedSheet.students.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade Scale */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Grade Scale</h4>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {gradeScale.map(scale => (
                        <div key={scale.grade} className="text-center p-2 border rounded">
                          <div className="font-bold">{scale.grade}</div>
                          <div>{scale.minPercentage}-{scale.maxPercentage}%</div>
                          <div>{scale.gradePoints} GPA</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t">
                    <div className="text-center">
                      <div className="border-b border-gray-400 mb-2 pb-8"></div>
                      <p className="font-medium">{selectedSheet.lecturer}</p>
                      <p className="text-sm text-gray-600">Course Lecturer</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-gray-400 mb-2 pb-8"></div>
                      <p className="font-medium">{selectedSheet.hod}</p>
                      <p className="text-sm text-gray-600">Head of Department</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setTranscriptDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Print Transcript
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Grade Entry Dialog */}
          <Dialog open={gradeEntryDialogOpen} onOpenChange={setGradeEntryDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Student Grades</DialogTitle>
                <DialogDescription>
                  Update assessment scores for {selectedStudent?.studentName}
                </DialogDescription>
              </DialogHeader>
              {selectedStudent && selectedSheet && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Internal Assessments</h4>
                    <div className="space-y-2">
                      {selectedSheet.internalAssessments.map(assessment => {
                        const score = selectedStudent.internalAssessments.find(s => s.assessmentId === assessment.id)
                        return (
                          <div key={assessment.id} className="grid grid-cols-4 gap-2 items-center">
                            <Label className="text-sm">{assessment.name}</Label>
                            <span className="text-xs text-gray-600">{assessment.type}</span>
                            <span className="text-xs text-gray-600">Max: {assessment.maxMarks}</span>
                            <Input
                              type="number"
                              value={score?.marksObtained || 0}
                              onChange={(e) => {
                                const marks = parseInt(e.target.value) || 0
                                const percentage = Math.round((marks / assessment.maxMarks) * 100)

                                const updatedStudent = { ...selectedStudent }
                                const existingScoreIndex = updatedStudent.internalAssessments.findIndex(s => s.assessmentId === assessment.id)

                                const newScore = {
                                  id: score?.id || Date.now(),
                                  studentId: selectedStudent.studentId,
                                  assessmentId: assessment.id,
                                  marksObtained: marks,
                                  percentage
                                }

                                if (existingScoreIndex >= 0) {
                                  updatedStudent.internalAssessments[existingScoreIndex] = newScore
                                } else {
                                  updatedStudent.internalAssessments.push(newScore)
                                }

                                // Recalculate averages
                                updatedStudent.internalAverage = Math.round(
                                  updatedStudent.internalAssessments.reduce((sum, s) => sum + s.percentage, 0) /
                                  Math.max(updatedStudent.internalAssessments.length, 1)
                                )

                                setSelectedStudent(updatedStudent)
                              }}
                              max={assessment.maxMarks}
                              min="0"
                              className="text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">External Tests</h4>
                    <div className="space-y-2">
                      {selectedSheet.externalTests.map(test => {
                        const score = selectedStudent.externalTests.find(s => s.assessmentId === test.id)
                        return (
                          <div key={test.id} className="grid grid-cols-4 gap-2 items-center">
                            <Label className="text-sm">{test.name}</Label>
                            <span className="text-xs text-gray-600">{test.type}</span>
                            <span className="text-xs text-gray-600">Max: {test.maxMarks}</span>
                            <Input
                              type="number"
                              value={score?.marksObtained || 0}
                              onChange={(e) => {
                                const marks = parseInt(e.target.value) || 0
                                const percentage = Math.round((marks / test.maxMarks) * 100)

                                const updatedStudent = { ...selectedStudent }
                                const existingScoreIndex = updatedStudent.externalTests.findIndex(s => s.assessmentId === test.id)

                                const newScore = {
                                  id: score?.id || Date.now(),
                                  studentId: selectedStudent.studentId,
                                  assessmentId: test.id,
                                  marksObtained: marks,
                                  percentage
                                }

                                if (existingScoreIndex >= 0) {
                                  updatedStudent.externalTests[existingScoreIndex] = newScore
                                } else {
                                  updatedStudent.externalTests.push(newScore)
                                }

                                // Recalculate averages
                                updatedStudent.externalAverage = Math.round(
                                  updatedStudent.externalTests.reduce((sum, s) => sum + s.percentage, 0) /
                                  Math.max(updatedStudent.externalTests.length, 1)
                                )

                                setSelectedStudent(updatedStudent)
                              }}
                              max={test.maxMarks}
                              min="0"
                              className="text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Final Examination</h4>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="text-sm">Final Exam Score</Label>
                      <span className="text-xs text-gray-600">Max: 100</span>
                      <Input
                        type="number"
                        value={selectedStudent.finalExamScore}
                        onChange={(e) => {
                          const score = parseInt(e.target.value) || 0
                          const updatedStudent = { ...selectedStudent }
                          updatedStudent.finalExamScore = score

                          // Recalculate total score and grade
                          const internalScore = (updatedStudent.internalAverage * 0.4) + (updatedStudent.externalAverage * 0.6)
                          updatedStudent.continuousAssessment = Math.round(internalScore)
                          updatedStudent.totalScore = Math.round((internalScore * 0.4) + (score * 0.6))

                          const grade = calculateGrade(updatedStudent.totalScore)
                          updatedStudent.letterGrade = grade.grade
                          updatedStudent.gradePoints = grade.gradePoints

                          setSelectedStudent(updatedStudent)
                        }}
                        max="100"
                        min="0"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Calculated Results</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Internal Average:</strong> {selectedStudent.internalAverage}%</p>
                        <p><strong>External Average:</strong> {selectedStudent.externalAverage}%</p>
                        <p><strong>Continuous Assessment:</strong> {selectedStudent.continuousAssessment}%</p>
                      </div>
                      <div>
                        <p><strong>Final Exam:</strong> {selectedStudent.finalExamScore}%</p>
                        <p><strong>Total Score:</strong> {selectedStudent.totalScore}%</p>
                        <p><strong>Letter Grade:</strong> <Badge variant="default">{selectedStudent.letterGrade}</Badge></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setGradeEntryDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedStudent && selectedSheet) {
                    // Update the grading sheet with new student data
                    const updatedSheet = { ...selectedSheet }
                    const studentIndex = updatedSheet.students.findIndex(s => s.studentId === selectedStudent.studentId)
                    if (studentIndex >= 0) {
                      updatedSheet.students[studentIndex] = selectedStudent
                    }

                    // Update state
                    setGradingSheets(gradingSheets.map(sheet => sheet.id === selectedSheet.id ? updatedSheet : sheet))
                    setSelectedSheet(updatedSheet)
                  }
                  setGradeEntryDialogOpen(false)
                }}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* NPIPNG Assessment Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            NPIPNG Assessment Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-lg font-medium text-blue-800 mb-1">Internal Assessment</div>
              <div className="text-sm text-blue-600 space-y-1">
                <div>• Assignments/Projects: 40%</div>
                <div>• External Tests: 60%</div>
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
              <div className="text-lg font-medium text-green-800 mb-1">Final Examination</div>
              <div className="text-sm text-green-600">Single comprehensive exam</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-lg font-medium text-purple-800 mb-1">Total Grade</div>
              <div className="text-sm text-purple-600">Standardized to 40% + 60%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Total Sheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSheets}</div>
            <p className="text-xs text-muted-foreground">Assessment sheets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-green-600" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSheets}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.completedSheets}</div>
            <p className="text-xs text-muted-foreground">Finalized sheets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Avg Class Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.averageClassSize}</div>
            <p className="text-xs text-muted-foreground">Students per course</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Sheets</TabsTrigger>
          <TabsTrigger value="configuration">Assessment Config</TabsTrigger>
          <TabsTrigger value="analytics">Grade Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Course Assessment Overview</CardTitle>
                  <CardDescription>Manage course assessment sheets and student grades</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Setup">Setup</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSheets.map((sheet) => (
                  <div key={sheet.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{sheet.courseName}</h3>
                          <Badge variant="outline" className="bg-gray-50 font-mono text-xs">{sheet.courseCode}</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Stage {sheet.stage}</Badge>
                          <Badge variant={sheet.status === 'Completed' ? 'default' :
                                       sheet.status === 'In Progress' ? 'secondary' :
                                       sheet.status === 'Published' ? 'outline' : 'destructive'}>
                            {sheet.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{sheet.department}</p>
                              <p className="text-gray-500">Department</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{sheet.program}</p>
                              <p className="text-gray-500">Program</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{sheet.semester}</p>
                              <p className="text-gray-500">{sheet.academicYear}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{sheet.students.length} students</p>
                              <p className="text-gray-500">Enrolled</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-4">
                          <div>
                            <p className="font-medium text-gray-900">{sheet.lecturer}</p>
                            <p className="text-gray-500">Lecturer</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sheet.hod}</p>
                            <p className="text-gray-500">HOD</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sheet.statistics.classAverage}%</p>
                            <p className="text-gray-500">Class Average</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sheet.statistics.passRate}%</p>
                            <p className="text-gray-500">Pass Rate</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sheet.statistics.standardDeviation}</p>
                            <p className="text-gray-500">Std Deviation</p>
                          </div>
                        </div>

                        {/* Grade Distribution */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Grade Distribution:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(sheet.statistics.gradeDistribution).map(([grade, count]) => (
                              <Badge key={grade} variant="outline" className="text-xs">
                                {grade}: {count}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedSheet(sheet)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Sheet
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSheets.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No assessment sheets found matching your search criteria.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Assessment Sheet View</CardTitle>
              <CardDescription>Complete assessment breakdown following NPIPNG standards</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSheet ? (
                <div className="space-y-6">
                  {/* Course Header */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-blue-900">The National Polytechnic Institute of Papua New Guinea</h2>
                      <p className="text-sm text-blue-700">MIDDLE OF SEMESTER RESULTS</p>
                      <h3 className="text-lg font-bold text-blue-800 mt-2">STUDENT ASSESSMENT</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">COURSE:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.program}</div>
                      </div>
                      <div>
                        <span className="font-medium">STAGE:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.stage}</div>
                      </div>
                      <div>
                        <span className="font-medium">SEMESTER:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.semester.split(' ')[1]}</div>
                      </div>
                      <div>
                        <span className="font-medium">ACADEMIC YEAR:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.academicYear}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">DEPARTMENT:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.department}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">SUBJECT:</span>
                        <div className="bg-white p-2 rounded border">{selectedSheet.courseCode} - {selectedSheet.courseName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">No</th>
                          <th className="border border-gray-300 p-2 text-left">Student Names</th>
                          <th className="border border-gray-300 p-2 text-center" colSpan={selectedSheet.internalAssessments.length}>
                            ASSIGNMENTS/PROJECTS
                          </th>
                          <th className="border border-gray-300 p-2 text-center">AVE</th>
                          <th className="border border-gray-300 p-2 text-center">40%</th>
                          <th className="border border-gray-300 p-2 text-center" colSpan={selectedSheet.externalTests.length}>
                            TESTS
                          </th>
                          <th className="border border-gray-300 p-2 text-center">AVE</th>
                          <th className="border border-gray-300 p-2 text-center">60%</th>
                          <th className="border border-gray-300 p-2 text-center">C.A.</th>
                          <th className="border border-gray-300 p-2 text-center">EXAM</th>
                          <th className="border border-gray-300 p-2 text-center">MID SEM</th>
                          <th className="border border-gray-300 p-2 text-center">GRADE</th>
                          <th className="border border-gray-300 p-2 text-center">RANK</th>
                          <th className="border border-gray-300 p-2 text-center">ACTIONS</th>
                        </tr>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          {selectedSheet.internalAssessments.map((_, index) => (
                            <th key={index} className="border border-gray-300 p-1 text-center">{index + 1}</th>
                          ))}
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          {selectedSheet.externalTests.map((_, index) => (
                            <th key={index} className="border border-gray-300 p-1 text-center">{index + 1}</th>
                          ))}
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                          <th className="border border-gray-300 p-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSheet.students.map((student, index) => (
                          <tr key={student.studentId} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 p-2 font-medium">{student.studentName}</td>
                            {/* Internal Assessments */}
                            {selectedSheet.internalAssessments.map((_, assIndex) => {
                              const score = student.internalAssessments[assIndex]
                              return (
                                <td key={assIndex} className="border border-gray-300 p-2 text-center">
                                  {score ? score.marksObtained : '-'}
                                </td>
                              )
                            })}
                            <td className="border border-gray-300 p-2 text-center font-medium bg-yellow-50">
                              {student.internalAverage}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-medium bg-yellow-100">
                              {Math.round(student.internalAverage * 0.4)}
                            </td>
                            {/* External Tests */}
                            {selectedSheet.externalTests.map((_, testIndex) => {
                              const score = student.externalTests[testIndex]
                              return (
                                <td key={testIndex} className="border border-gray-300 p-2 text-center">
                                  {score ? score.marksObtained : '-'}
                                </td>
                              )
                            })}
                            <td className="border border-gray-300 p-2 text-center font-medium bg-green-50">
                              {student.externalAverage}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-medium bg-green-100">
                              {Math.round(student.externalAverage * 0.6)}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-bold bg-blue-100">
                              {student.continuousAssessment}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-medium">
                              {student.finalExamScore}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {student.midSemesterScore}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-bold">
                              <Badge variant={student.letterGrade === 'A' ? 'default' :
                                           student.letterGrade === 'B' ? 'secondary' :
                                           student.letterGrade === 'C' ? 'outline' : 'destructive'}>
                                {student.letterGrade}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-medium">
                              {student.rank}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex gap-1 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedStudent(student)
                                    setTranscriptDialogOpen(true)
                                  }}
                                  className="text-xs px-2 py-1"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Transcript
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedStudent(student)
                                    setGradeEntryDialogOpen(true)
                                  }}
                                  className="text-xs px-2 py-1"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Statistics Footer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-left">
                      <p className="font-medium">{selectedSheet.lecturer}</p>
                      <p className="text-gray-600">(Lecturer)</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Statistics:</p>
                      <div className="flex justify-center gap-4 mt-1">
                        {Object.entries(selectedSheet.statistics.gradeDistribution).map(([grade, count]) => (
                          <span key={grade} className="text-xs">{grade} = {count}</span>
                        ))}
                      </div>
                      <p className="text-xs mt-1">Total = {selectedSheet.statistics.totalStudents}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Class Average = {selectedSheet.statistics.classAverage}</p>
                      <p className="text-gray-600">Standard Deviation = {selectedSheet.statistics.standardDeviation}</p>
                      <p className="font-medium">{selectedSheet.hod}</p>
                      <p className="text-gray-600">HOD</p>
                    </div>
                  </div>

                  {/* Grading System Footer */}
                  <div className="text-center space-y-2 text-sm bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-center gap-8 font-bold">
                      <span className="text-purple-700">INTERNAL = 40%</span>
                      <span className="text-pink-700">EXTERNAL = 60%</span>
                      <span className="text-red-700">EXAM = 60%</span>
                    </div>
                    <div className="text-purple-600">
                      <span className="text-pink-600">STD INTERNAL = 40%</span>
                    </div>
                    <div className="text-purple-700 font-medium">
                      Cumulative Internal = 40% + 60% = 100% standardized to 40%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Select a course from the Overview tab to view its assessment sheet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration</CardTitle>
              <CardDescription>Configure assessments and weighting for selected course</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSheet ? (
                <div className="space-y-6">
                  {/* Course Info Header */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-blue-900 mb-2">
                      {selectedSheet.courseCode} - {selectedSheet.courseName}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                      <span><strong>Department:</strong> {selectedSheet.department}</span>
                      <span><strong>Program:</strong> {selectedSheet.program}</span>
                      <span><strong>Stage:</strong> {selectedSheet.stage}</span>
                      <span><strong>Semester:</strong> {selectedSheet.semester}</span>
                    </div>
                  </div>

                  {/* Internal Assessments Configuration */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Internal Assessments (40% Total Weight)
                      </h4>
                      <Button onClick={() => {
                        setAssessmentForm({ ...assessmentForm, category: 'Internal' })
                        setAssessmentDialogOpen(true)
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Internal Assessment
                      </Button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid gap-3">
                        {selectedSheet.internalAssessments.length > 0 ? (
                          selectedSheet.internalAssessments.map((assessment, index) => (
                            <div key={assessment.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-medium">{assessment.name}</div>
                                <div className="text-sm text-gray-600">
                                  {assessment.type} • {assessment.maxMarks} marks • {assessment.weight}% weight • Due: {assessment.date}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p>No internal assessments configured yet.</p>
                            <p className="text-sm">Add assignments and projects to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* External Tests Configuration */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-green-600" />
                        External Tests (60% of Internal Weight)
                      </h4>
                      <Button onClick={() => {
                        setAssessmentForm({ ...assessmentForm, category: 'External' })
                        setAssessmentDialogOpen(true)
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add External Test
                      </Button>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid gap-3">
                        {selectedSheet.externalTests.length > 0 ? (
                          selectedSheet.externalTests.map((test, index) => (
                            <div key={test.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-medium">{test.name}</div>
                                <div className="text-sm text-gray-600">
                                  {test.type} • {test.maxMarks} marks • {test.weight}% weight • Due: {test.date}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <ClipboardList className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p>No external tests configured yet.</p>
                            <p className="text-sm">Add tests to complete the assessment structure.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Exam Configuration */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Final Examination (60% Total Weight)
                    </h4>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="finalExamMarks">Total Marks</Label>
                          <Input
                            id="finalExamMarks"
                            type="number"
                            value={selectedSheet.finalExamConfig.totalMarks}
                            onChange={(e) => {
                              const updatedSheet = { ...selectedSheet }
                              updatedSheet.finalExamConfig.totalMarks = parseInt(e.target.value) || 100
                              setSelectedSheet(updatedSheet)
                            }}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="finalExamDate">Exam Date</Label>
                          <Input
                            id="finalExamDate"
                            type="date"
                            value={selectedSheet.finalExamConfig.date}
                            onChange={(e) => {
                              const updatedSheet = { ...selectedSheet }
                              updatedSheet.finalExamConfig.date = e.target.value
                              setSelectedSheet(updatedSheet)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="finalExamDuration">Duration (minutes)</Label>
                          <Input
                            id="finalExamDuration"
                            type="number"
                            value={selectedSheet.finalExamConfig.duration}
                            onChange={(e) => {
                              const updatedSheet = { ...selectedSheet }
                              updatedSheet.finalExamConfig.duration = parseInt(e.target.value) || 180
                              setSelectedSheet(updatedSheet)
                            }}
                            min="60"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weight Distribution Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">NPIPNG Grading Weight Distribution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-100 p-4 rounded">
                        <div className="text-2xl font-bold text-blue-600">40%</div>
                        <div className="text-sm font-medium text-blue-800">Internal Assessment</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Assignments/Projects (40%) + Tests (60%)
                        </div>
                      </div>
                      <div className="bg-purple-100 p-4 rounded">
                        <div className="text-2xl font-bold text-purple-600">60%</div>
                        <div className="text-sm font-medium text-purple-800">Final Examination</div>
                        <div className="text-xs text-purple-600 mt-1">
                          Comprehensive exam
                        </div>
                      </div>
                      <div className="bg-green-100 p-4 rounded">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-sm font-medium text-green-800">Total Grade</div>
                        <div className="text-xs text-green-600 mt-1">
                          Combined weighted score
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Configuration */}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <X className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => {
                      // Save the updated sheet configuration
                      setGradingSheets(gradingSheets.map(sheet =>
                        sheet.id === selectedSheet.id ? selectedSheet : sheet
                      ))
                    }}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Select a course from the Overview tab to configure its assessments.</p>
                  <p className="text-sm">Set up internal assessments, external tests, and final exam parameters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Grade Analytics & Performance Reports</CardTitle>
              <CardDescription>Statistical analysis and performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>Analytics dashboard with grade distributions and trends.</p>
                <p className="text-sm">Performance analysis across departments and programs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
