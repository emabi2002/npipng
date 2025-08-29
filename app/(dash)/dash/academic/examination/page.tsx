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
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  MapPin,
  Building2,
  User,
  Calendar,
  AlertCircle,
  Save,
  X,
  GraduationCap,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ClipboardCheck,
  Timer,
  Shield
} from "lucide-react"

// Types
interface Examination {
  id: number
  examCode: string
  courseCode: string
  courseName: string
  examTitle: string
  examType: 'Mid-term' | 'Final' | 'Quiz' | 'Practical' | 'Oral' | 'Assignment'
  department: string
  instructor: string
  semester: 'Semester 1' | 'Semester 2' | 'Both Semesters'
  academicYear: string
  examDate: string
  examTime: string
  duration: number // in minutes
  venue: string
  building: string
  capacity: number
  registeredStudents: number
  invigilators: string[]
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  instructions: string
  materials: string[]
  gradingCriteria: string
  totalMarks: number
  passingMarks: number
  securityLevel: 'Standard' | 'High' | 'Maximum'
  conflicts: string[]
  lastUpdated: string
}

// Initial mock data
const initialExaminations: Examination[] = [
  {
    id: 1,
    examCode: 'EXAM-BUSI101-F24',
    courseCode: 'BUSI101',
    courseName: 'Introduction to Business',
    examTitle: 'Final Examination - Introduction to Business',
    examType: 'Final',
    department: 'Business Studies',
    instructor: 'Dr. James Kila',
    semester: 'Semester 1',
    academicYear: '2024',
    examDate: '2024-06-15',
    examTime: '09:00',
    duration: 180,
    venue: 'Main Examination Hall',
    building: 'Main Building',
    capacity: 150,
    registeredStudents: 87,
    invigilators: ['Dr. James Kila', 'Ms. Patricia Namaliu'],
    status: 'Scheduled',
    instructions: 'Answer all questions. Write clearly and use blue or black ink only. No electronic devices allowed.',
    materials: ['Question paper', 'Answer booklet', 'Rough paper'],
    gradingCriteria: 'Total marks: 100. Pass mark: 50. Grading based on comprehensive understanding.',
    totalMarks: 100,
    passingMarks: 50,
    securityLevel: 'Standard',
    conflicts: [],
    lastUpdated: '2024-01-20'
  },
  {
    id: 2,
    examCode: 'EXAM-IT201-M24',
    courseCode: 'IT201',
    courseName: 'Database Systems',
    examTitle: 'Mid-term Examination - Database Systems',
    examType: 'Mid-term',
    department: 'Information Technology',
    instructor: 'Ms. Sarah Natera',
    semester: 'Semester 2',
    academicYear: '2024',
    examDate: '2024-08-20',
    examTime: '14:00',
    duration: 120,
    venue: 'IT Computer Lab',
    building: 'IT Building',
    capacity: 40,
    registeredStudents: 32,
    invigilators: ['Ms. Sarah Natera', 'Mr. Tony Kaupa'],
    status: 'Confirmed',
    instructions: 'Practical examination using MySQL database. Follow lab safety protocols.',
    materials: ['Computer workstation', 'Database software', 'Instruction sheet'],
    gradingCriteria: 'Practical assessment: 60 marks. Theory questions: 40 marks. Total: 100.',
    totalMarks: 100,
    passingMarks: 50,
    securityLevel: 'High',
    conflicts: [],
    lastUpdated: '2024-01-18'
  },
  {
    id: 3,
    examCode: 'EXAM-ENG301-F24',
    courseCode: 'ENG301',
    courseName: 'Power Systems',
    examTitle: 'Final Examination - Power Systems',
    examType: 'Final',
    department: 'Engineering',
    instructor: 'Eng. Peter Mekere',
    semester: 'Semester 1',
    academicYear: '2024',
    examDate: '2024-06-18',
    examTime: '09:00',
    duration: 240,
    venue: 'Engineering Examination Room',
    building: 'Engineering Complex',
    capacity: 50,
    registeredStudents: 28,
    invigilators: ['Eng. Peter Mekere', 'Dr. Michael Temu'],
    status: 'Scheduled',
    instructions: 'Comprehensive examination covering all course materials. Scientific calculator allowed.',
    materials: ['Question paper', 'Answer booklet', 'Graph paper', 'Formula sheet'],
    gradingCriteria: 'Problem solving: 60%. Theory: 40%. Professional engineering standards apply.',
    totalMarks: 150,
    passingMarks: 90,
    securityLevel: 'High',
    conflicts: [],
    lastUpdated: '2024-01-16'
  },
  {
    id: 4,
    examCode: 'EXAM-HLTH151-P24',
    courseCode: 'HLTH151',
    courseName: 'Community Health Practice',
    examTitle: 'Practical Assessment - Community Health',
    examType: 'Practical',
    department: 'Health Sciences',
    instructor: 'Dr. Mary Temu',
    semester: 'Semester 1',
    academicYear: '2024',
    examDate: '2024-05-25',
    examTime: '08:00',
    duration: 300,
    venue: 'Health Simulation Lab',
    building: 'Health Building',
    capacity: 20,
    registeredStudents: 18,
    invigilators: ['Dr. Mary Temu', 'Nurse Susan Kambu'],
    status: 'Confirmed',
    instructions: 'Practical demonstration of community health assessment techniques. Professional attire required.',
    materials: ['Assessment forms', 'Medical equipment', 'Case study materials'],
    gradingCriteria: 'Practical skills: 70%. Documentation: 20%. Professional conduct: 10%.',
    totalMarks: 100,
    passingMarks: 60,
    securityLevel: 'Standard',
    conflicts: [],
    lastUpdated: '2024-01-14'
  },
  {
    id: 5,
    examCode: 'EXAM-AGRI202-A24',
    courseCode: 'AGRI202',
    courseName: 'Sustainable Agriculture',
    examTitle: 'Field Assignment - Sustainable Practices',
    examType: 'Assignment',
    department: 'Agriculture',
    instructor: 'Mr. John Wambi',
    semester: 'Semester 2',
    academicYear: '2024',
    examDate: '2024-09-10',
    examTime: '07:00',
    duration: 480,
    venue: 'Agriculture Field Campus',
    building: 'Agriculture Campus',
    capacity: 25,
    registeredStudents: 20,
    invigilators: ['Mr. John Wambi', 'Agr. Extension Officer'],
    status: 'Scheduled',
    instructions: 'Field-based assessment of sustainable farming techniques. Weather-dependent activity.',
    materials: ['Field notebooks', 'Measuring tools', 'Soil testing kits', 'Safety equipment'],
    gradingCriteria: 'Field performance: 50%. Report quality: 30%. Innovation: 20%.',
    totalMarks: 100,
    passingMarks: 50,
    securityLevel: 'Standard',
    conflicts: ['Weather conditions may affect field work'],
    lastUpdated: '2024-01-12'
  }
]

const departments = ['Business Studies', 'Information Technology', 'Engineering', 'Health Sciences', 'Agriculture']
const instructors = ['Dr. James Kila', 'Ms. Sarah Natera', 'Eng. Peter Mekere', 'Dr. Mary Temu', 'Mr. John Wambi']
const venues = ['Main Examination Hall', 'IT Computer Lab', 'Engineering Examination Room', 'Health Simulation Lab', 'Agriculture Field Campus', 'Library Hall', 'Conference Room A']
const buildings = ['Main Building', 'IT Building', 'Engineering Complex', 'Health Building', 'Agriculture Campus', 'Library Building']
const examTypes = ['Mid-term', 'Final', 'Quiz', 'Practical', 'Oral', 'Assignment']
const securityLevels = ['Standard', 'High', 'Maximum']

export default function ExaminationPage() {
  // State management
  const [examinations, setExaminations] = useState<Examination[]>(initialExaminations)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Examination | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')

  // Form state
  const [form, setForm] = useState({
    examCode: '',
    courseCode: '',
    courseName: '',
    examTitle: '',
    examType: 'Final' as const,
    department: '',
    instructor: '',
    semester: 'Semester 1' as const,
    academicYear: '2024',
    examDate: '',
    examTime: '09:00',
    duration: 180,
    venue: '',
    building: '',
    capacity: 50,
    registeredStudents: 0,
    invigilators: [] as string[],
    status: 'Scheduled' as const,
    instructions: '',
    materials: [] as string[],
    gradingCriteria: '',
    totalMarks: 100,
    passingMarks: 50,
    securityLevel: 'Standard' as const,
    conflicts: [] as string[],
    lastUpdated: new Date().toISOString().split('T')[0]
  })

  // Input states for array fields
  const [invigilatorInput, setInvigilatorInput] = useState('')
  const [materialInput, setMaterialInput] = useState('')
  const [conflictInput, setConflictInput] = useState('')

  // Calculated statistics
  const stats = {
    totalExaminations: examinations.length,
    scheduledExams: examinations.filter(e => e.status === 'Scheduled' || e.status === 'Confirmed').length,
    completedExams: examinations.filter(e => e.status === 'Completed').length,
    totalStudents: examinations.reduce((sum, e) => sum + e.registeredStudents, 0),
    conflictsCount: examinations.filter(e => e.conflicts.length > 0).length
  }

  // CRUD Operations
  const handleAdd = () => {
    const examCode = form.examCode || `EXAM-${form.courseCode}-${form.examType.charAt(0)}24`

    const newExam: Examination = {
      id: Math.max(...examinations.map(e => e.id)) + 1,
      ...form,
      examCode
    }
    setExaminations([...examinations, newExam])
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (exam: Examination) => {
    setEditingExam(exam)
    setForm({
      examCode: exam.examCode,
      courseCode: exam.courseCode,
      courseName: exam.courseName,
      examTitle: exam.examTitle,
      examType: exam.examType,
      department: exam.department,
      instructor: exam.instructor,
      semester: exam.semester,
      academicYear: exam.academicYear,
      examDate: exam.examDate,
      examTime: exam.examTime,
      duration: exam.duration,
      venue: exam.venue,
      building: exam.building,
      capacity: exam.capacity,
      registeredStudents: exam.registeredStudents,
      invigilators: exam.invigilators,
      status: exam.status,
      instructions: exam.instructions,
      materials: exam.materials,
      gradingCriteria: exam.gradingCriteria,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      securityLevel: exam.securityLevel,
      conflicts: exam.conflicts,
      lastUpdated: exam.lastUpdated
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingExam) {
      setExaminations(examinations.map(e =>
        e.id === editingExam.id ? { ...editingExam, ...form, lastUpdated: new Date().toISOString().split('T')[0] } : e
      ))
      setEditingExam(null)
      resetForm()
      setDialogOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this examination?')) {
      setExaminations(examinations.filter(e => e.id !== id))
    }
  }

  const resetForm = () => {
    setForm({
      examCode: '',
      courseCode: '',
      courseName: '',
      examTitle: '',
      examType: 'Final',
      department: '',
      instructor: '',
      semester: 'Semester 1',
      academicYear: '2024',
      examDate: '',
      examTime: '09:00',
      duration: 180,
      venue: '',
      building: '',
      capacity: 50,
      registeredStudents: 0,
      invigilators: [],
      status: 'Scheduled',
      instructions: '',
      materials: [],
      gradingCriteria: '',
      totalMarks: 100,
      passingMarks: 50,
      securityLevel: 'Standard',
      conflicts: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    })
    setInvigilatorInput('')
    setMaterialInput('')
    setConflictInput('')
  }

  // Array management functions
  const addInvigilator = () => {
    if (invigilatorInput.trim() && !form.invigilators.includes(invigilatorInput.trim())) {
      setForm({
        ...form,
        invigilators: [...form.invigilators, invigilatorInput.trim()]
      })
      setInvigilatorInput('')
    }
  }

  const removeInvigilator = (invigilator: string) => {
    setForm({
      ...form,
      invigilators: form.invigilators.filter(i => i !== invigilator)
    })
  }

  const addMaterial = () => {
    if (materialInput.trim() && !form.materials.includes(materialInput.trim())) {
      setForm({
        ...form,
        materials: [...form.materials, materialInput.trim()]
      })
      setMaterialInput('')
    }
  }

  const removeMaterial = (material: string) => {
    setForm({
      ...form,
      materials: form.materials.filter(m => m !== material)
    })
  }

  const addConflict = () => {
    if (conflictInput.trim() && !form.conflicts.includes(conflictInput.trim())) {
      setForm({
        ...form,
        conflicts: [...form.conflicts, conflictInput.trim()]
      })
      setConflictInput('')
    }
  }

  const removeConflict = (conflict: string) => {
    setForm({
      ...form,
      conflicts: form.conflicts.filter(c => c !== conflict)
    })
  }

  // Filter functions
  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || exam.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus
    const matchesType = filterType === 'all' || exam.examType === filterType
    const matchesSemester = filterSemester === 'all' || exam.semester === filterSemester
    return matchesSearch && matchesDepartment && matchesStatus && matchesType && matchesSemester
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Examination Management
          </h1>
          <p className="text-gray-600">
            Manage exam schedules, venues, invigilation, and examination logistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Exams
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingExam(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Examination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingExam ? 'Edit Examination' : 'Add New Examination'}
                </DialogTitle>
                <DialogDescription>
                  {editingExam ? 'Update the examination details' : 'Create a new examination schedule'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input
                        id="courseCode"
                        value={form.courseCode}
                        onChange={(e) => setForm({...form, courseCode: e.target.value.toUpperCase()})}
                        placeholder="BUSI101"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={form.courseName}
                        onChange={(e) => setForm({...form, courseName: e.target.value})}
                        placeholder="Introduction to Business"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="examTitle">Examination Title</Label>
                    <Input
                      id="examTitle"
                      value={form.examTitle}
                      onChange={(e) => setForm({...form, examTitle: e.target.value})}
                      placeholder="Final Examination - Introduction to Business"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="examType">Exam Type</Label>
                      <Select value={form.examType} onValueChange={(value: any) => setForm({...form, examType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={form.department} onValueChange={(value) => setForm({...form, department: value})}>
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
                      <Label htmlFor="instructor">Instructor</Label>
                      <Select value={form.instructor} onValueChange={(value) => setForm({...form, instructor: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructors.map(instructor => (
                            <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select value={form.semester} onValueChange={(value: any) => setForm({...form, semester: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Semester 1">Semester 1</SelectItem>
                          <SelectItem value="Semester 2">Semester 2</SelectItem>
                          <SelectItem value="Both Semesters">Both Semesters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        value={form.academicYear}
                        onChange={(e) => setForm({...form, academicYear: e.target.value})}
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={form.status} onValueChange={(value: any) => setForm({...form, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Schedule & Venue */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Schedule & Venue</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="examDate">Exam Date</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={form.examDate}
                        onChange={(e) => setForm({...form, examDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="examTime">Exam Time</Label>
                      <Input
                        id="examTime"
                        type="time"
                        value={form.examTime}
                        onChange={(e) => setForm({...form, examTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={form.duration}
                        onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Select value={form.venue} onValueChange={(value) => setForm({...form, venue: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {venues.map(venue => (
                            <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="building">Building</Label>
                      <Select value={form.building} onValueChange={(value) => setForm({...form, building: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map(building => (
                            <SelectItem key={building} value={building}>{building}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="capacity">Venue Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={form.capacity}
                        onChange={(e) => setForm({...form, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registeredStudents">Registered Students</Label>
                      <Input
                        id="registeredStudents"
                        type="number"
                        value={form.registeredStudents}
                        onChange={(e) => setForm({...form, registeredStudents: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="securityLevel">Security Level</Label>
                      <Select value={form.securityLevel} onValueChange={(value: any) => setForm({...form, securityLevel: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {securityLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Grading & Assessment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Grading & Assessment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalMarks">Total Marks</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        value={form.totalMarks}
                        onChange={(e) => setForm({...form, totalMarks: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="passingMarks">Passing Marks</Label>
                      <Input
                        id="passingMarks"
                        type="number"
                        value={form.passingMarks}
                        onChange={(e) => setForm({...form, passingMarks: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gradingCriteria">Grading Criteria</Label>
                    <Textarea
                      id="gradingCriteria"
                      value={form.gradingCriteria}
                      onChange={(e) => setForm({...form, gradingCriteria: e.target.value})}
                      placeholder="Describe the grading criteria and marking scheme..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Instructions & Materials */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Instructions & Materials</h3>
                  <div>
                    <Label htmlFor="instructions">Exam Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={form.instructions}
                      onChange={(e) => setForm({...form, instructions: e.target.value})}
                      placeholder="Special instructions for students taking the exam..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Required Materials</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={materialInput}
                        onChange={(e) => setMaterialInput(e.target.value)}
                        placeholder="Enter required material..."
                        onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                      />
                      <Button type="button" onClick={addMaterial} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {material}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeMaterial(material)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invigilators & Conflicts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Invigilators & Issues</h3>
                  <div>
                    <Label>Invigilators</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={invigilatorInput}
                        onChange={(e) => setInvigilatorInput(e.target.value)}
                        placeholder="Enter invigilator name..."
                        onKeyPress={(e) => e.key === 'Enter' && addInvigilator()}
                      />
                      <Button type="button" onClick={addInvigilator} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.invigilators.map((invigilator, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {invigilator}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeInvigilator(invigilator)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Potential Conflicts/Issues</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={conflictInput}
                        onChange={(e) => setConflictInput(e.target.value)}
                        placeholder="Enter potential conflict or issue..."
                        onKeyPress={(e) => e.key === 'Enter' && addConflict()}
                      />
                      <Button type="button" onClick={addConflict} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.conflicts.map((conflict, index) => (
                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                          {conflict}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeConflict(conflict)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={editingExam ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingExam ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Total Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalExaminations}</div>
            <p className="text-xs text-muted-foreground">Scheduled exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-green-600" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.scheduledExams}</div>
            <p className="text-xs text-muted-foreground">Upcoming exams</p>
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
            <div className="text-2xl font-bold text-purple-600">{stats.completedExams}</div>
            <p className="text-xs text-muted-foreground">Finished exams</p>
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
            <p className="text-xs text-muted-foreground">Registered for exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.conflictsCount}</div>
            <p className="text-xs text-muted-foreground">Exam conflicts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Examination Directory</CardTitle>
              <CardDescription>Browse and manage examination schedules and logistics</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search examinations..."
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Semester 1">Semester 1</SelectItem>
                  <SelectItem value="Semester 2">Semester 2</SelectItem>
                  <SelectItem value="Both Semesters">Both Semesters</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExaminations.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{exam.examTitle}</h3>
                      <Badge variant="outline" className="bg-gray-50 font-mono text-xs">{exam.examCode}</Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{exam.courseCode}</Badge>
                      <Badge variant={exam.examType === 'Final' ? 'default' :
                                   exam.examType === 'Mid-term' ? 'secondary' :
                                   exam.examType === 'Practical' ? 'outline' : 'destructive'}>
                        {exam.examType}
                      </Badge>
                      <Badge variant={exam.status === 'Confirmed' ? 'default' :
                                   exam.status === 'Scheduled' ? 'secondary' :
                                   exam.status === 'Completed' ? 'outline' :
                                   exam.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                        {exam.status}
                      </Badge>
                      {exam.conflicts.length > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {exam.conflicts.length} issue{exam.conflicts.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{exam.instructor}</p>
                          <p className="text-gray-500">Instructor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{exam.department}</p>
                          <p className="text-gray-500">Department</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{new Date(exam.examDate).toLocaleDateString()}</p>
                          <p className="text-gray-500">{exam.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{exam.examTime}</p>
                          <p className="text-gray-500">{exam.duration} mins</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{exam.venue}</p>
                          <p className="text-gray-500">{exam.building}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exam.registeredStudents}/{exam.capacity}</p>
                        <p className="text-gray-500">Students</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exam.totalMarks} marks</p>
                        <p className="text-gray-500">Pass: {exam.passingMarks}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{exam.securityLevel}</p>
                          <p className="text-gray-500">Security</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exam.invigilators.length}</p>
                        <p className="text-gray-500">Invigilators</p>
                      </div>
                    </div>

                    {exam.instructions && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">{exam.instructions}</p>
                      </div>
                    )}

                    {exam.materials.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Required Materials:</p>
                        <div className="flex flex-wrap gap-2">
                          {exam.materials.slice(0, 4).map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                          {exam.materials.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{exam.materials.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {exam.conflicts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-red-700 mb-2">Issues/Conflicts:</p>
                        <div className="flex flex-wrap gap-2">
                          {exam.conflicts.map((conflict, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {conflict}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(exam)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(exam.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExaminations.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No examinations found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
