'use client'

import { useState, useEffect } from 'react'
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
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  Award,
  Building2,
  User,
  Calendar,
  AlertCircle,
  Save,
  X,
  GraduationCap,
  Database
} from "lucide-react"

// Import database utility
import { coursesDB, DatabaseRecord } from "@/lib/database"

// Types
interface Course extends DatabaseRecord {
  courseCode: string
  courseName: string
  description: string
  creditHours: number
  contactHours: number
  department: string
  level: 'Certificate' | 'Diploma' | 'Degree' | 'Postgraduate'
  semester: 'Semester 1' | 'Semester 2' | 'Both Semesters' | 'Year Long'
  prerequisites: string[]
  instructor: string
  status: 'Active' | 'Inactive' | 'Under Development'
  enrolledStudents: number
  maxCapacity: number
  fees: number
  academicYear: string
}

// Initial data to seed the database
const initialCourses: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    courseCode: 'BUSI101',
    courseName: 'Introduction to Business',
    description: 'Fundamental concepts of business operations, management principles, and entrepreneurship basics for first-year students.',
    creditHours: 3,
    contactHours: 4,
    department: 'Business Studies',
    level: 'Certificate',
    semester: 'Semester 1',
    prerequisites: [],
    instructor: 'Dr. James Kila',
    status: 'Active',
    enrolledStudents: 45,
    maxCapacity: 50,
    fees: 1200,
    academicYear: '2024'
  },
  {
    courseCode: 'IT201',
    courseName: 'Database Systems',
    description: 'Design, implementation, and management of relational databases including SQL, normalization, and database administration.',
    creditHours: 4,
    contactHours: 6,
    department: 'Information Technology',
    level: 'Diploma',
    semester: 'Semester 2',
    prerequisites: ['IT101', 'IT102'],
    instructor: 'Ms. Sarah Natera',
    status: 'Active',
    enrolledStudents: 32,
    maxCapacity: 35,
    fees: 1800,
    academicYear: '2024'
  },
  {
    courseCode: 'ENG301',
    courseName: 'Electrical Power Systems',
    description: 'Advanced study of electrical power generation, transmission, distribution systems and renewable energy integration.',
    creditHours: 5,
    contactHours: 8,
    department: 'Engineering',
    level: 'Degree',
    semester: 'Both Semesters',
    prerequisites: ['ENG201', 'ENG202', 'MATH201'],
    instructor: 'Eng. Peter Mekere',
    status: 'Active',
    enrolledStudents: 28,
    maxCapacity: 30,
    fees: 2500,
    academicYear: '2024'
  },
  {
    courseCode: 'HLTH151',
    courseName: 'Community Health Practice',
    description: 'Principles and practices of community health promotion, disease prevention, and public health intervention strategies.',
    creditHours: 3,
    contactHours: 5,
    department: 'Health Sciences',
    level: 'Certificate',
    semester: 'Semester 1',
    prerequisites: ['HLTH101'],
    instructor: 'Dr. Mary Temu',
    status: 'Active',
    enrolledStudents: 38,
    maxCapacity: 40,
    fees: 1500,
    academicYear: '2024'
  },
  {
    courseCode: 'AGRI202',
    courseName: 'Sustainable Agriculture',
    description: 'Modern sustainable farming techniques, crop rotation, organic farming, and environmental impact assessment.',
    creditHours: 4,
    contactHours: 6,
    department: 'Agriculture',
    level: 'Diploma',
    semester: 'Year Long',
    prerequisites: ['AGRI101'],
    instructor: 'Mr. John Wambi',
    status: 'Under Development',
    enrolledStudents: 0,
    maxCapacity: 25,
    fees: 1600,
    academicYear: '2024'
  },
  {
    courseCode: 'BUSI401',
    courseName: 'Strategic Management',
    description: 'Advanced strategic planning, competitive analysis, organizational development, and leadership in business environments.',
    creditHours: 4,
    contactHours: 5,
    department: 'Business Studies',
    level: 'Degree',
    semester: 'Semester 2',
    prerequisites: ['BUSI301', 'BUSI302', 'BUSI303'],
    instructor: 'Dr. James Kila',
    status: 'Active',
    enrolledStudents: 22,
    maxCapacity: 25,
    fees: 2200,
    academicYear: '2024'
  }
]

const departments = ['Business Studies', 'Information Technology', 'Engineering', 'Health Sciences', 'Agriculture']
const instructors = ['Dr. James Kila', 'Ms. Sarah Natera', 'Eng. Peter Mekere', 'Dr. Mary Temu', 'Mr. John Wambi']

export default function CoursesPage() {
  // State management
  const [courses, setCourses] = useState<Course[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state
  const [form, setForm] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    creditHours: 3,
    contactHours: 4,
    department: '',
    level: 'Certificate' as const,
    semester: 'Semester 1' as const,
    prerequisites: [] as string[],
    instructor: '',
    status: 'Active' as const,
    enrolledStudents: 0,
    maxCapacity: 30,
    fees: 1000,
    academicYear: '2024'
  })

  const [prerequisiteInput, setPrerequisiteInput] = useState('')

  // Load data from database
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const savedCourses = await coursesDB.getAll()

        // If no data exists, initialize with default data
        if (savedCourses.length === 0) {
          const defaultCourses = []
          for (const course of initialCourses) {
            const newCourse = await coursesDB.create(course)
            defaultCourses.push(newCourse)
          }
          setCourses(defaultCourses)
        } else {
          setCourses(savedCourses)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Calculated statistics
  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === 'Active').length,
    totalEnrolled: courses.reduce((sum, c) => sum + c.enrolledStudents, 0),
    totalCapacity: courses.reduce((sum, c) => sum + c.maxCapacity, 0),
    averageEnrollment: courses.length > 0 ? Math.round((courses.reduce((sum, c) => sum + c.enrolledStudents, 0) / courses.length) * 10) / 10 : 0
  }

  // CRUD Operations with database persistence
  const handleAdd = async () => {
    try {
      const newCourse = await coursesDB.create(form)
      setCourses([...courses, newCourse])
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Error creating course. Please try again.')
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description,
      creditHours: course.creditHours,
      contactHours: course.contactHours,
      department: course.department,
      level: course.level,
      semester: course.semester,
      prerequisites: course.prerequisites,
      instructor: course.instructor,
      status: course.status,
      enrolledStudents: course.enrolledStudents,
      maxCapacity: course.maxCapacity,
      fees: course.fees,
      academicYear: course.academicYear
    })
    setDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (editingCourse) {
      try {
        const updatedCourse = await coursesDB.update(editingCourse.id, form)
        if (updatedCourse) {
          setCourses(courses.map(c =>
            c.id === editingCourse.id ? updatedCourse : c
          ))
          setEditingCourse(null)
          resetForm()
          setDialogOpen(false)
        }
      } catch (error) {
        console.error('Error updating course:', error)
        alert('Error updating course. Please try again.')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        const success = await coursesDB.delete(id)
        if (success) {
          setCourses(courses.filter(c => c.id !== id))
        } else {
          alert('Error deleting course. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Error deleting course. Please try again.')
      }
    }
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(courses, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `courses_export_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error exporting data. Please try again.')
    }
  }

  const resetForm = () => {
    setForm({
      courseCode: '',
      courseName: '',
      description: '',
      creditHours: 3,
      contactHours: 4,
      department: '',
      level: 'Certificate',
      semester: 'Semester 1',
      prerequisites: [],
      instructor: '',
      status: 'Active',
      enrolledStudents: 0,
      maxCapacity: 30,
      fees: 1000,
      academicYear: '2024'
    })
    setPrerequisiteInput('')
  }

  // Prerequisite management
  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !form.prerequisites.includes(prerequisiteInput.trim())) {
      setForm({
        ...form,
        prerequisites: [...form.prerequisites, prerequisiteInput.trim().toUpperCase()]
      })
      setPrerequisiteInput('')
    }
  }

  const removePrerequisite = (prereq: string) => {
    setForm({
      ...form,
      prerequisites: form.prerequisites.filter(p => p !== prereq)
    })
  }

  // Filter functions
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus
  })

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-lg">
          <Database className="h-6 w-6 animate-pulse" />
          Loading courses...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Course Management
          </h1>
          <p className="text-gray-600">
            Manage course catalog, descriptions, prerequisites, and enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Courses
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCourse(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update the course details' : 'Create a new course offering'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Detailed course description, learning outcomes, and content overview..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="creditHours">Credit Hours</Label>
                    <Input
                      id="creditHours"
                      type="number"
                      value={form.creditHours}
                      onChange={(e) => setForm({...form, creditHours: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactHours">Contact Hours/Week</Label>
                    <Input
                      id="contactHours"
                      type="number"
                      value={form.contactHours}
                      onChange={(e) => setForm({...form, contactHours: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fees">Course Fees (PGK)</Label>
                    <Input
                      id="fees"
                      type="number"
                      value={form.fees}
                      onChange={(e) => setForm({...form, fees: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="level">Level</Label>
                    <Select value={form.level} onValueChange={(value: 'Certificate' | 'Diploma' | 'Degree' | 'Postgraduate') => setForm({...form, level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Degree">Degree</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={form.semester} onValueChange={(value: 'Semester 1' | 'Semester 2' | 'Both Semesters' | 'Year Long') => setForm({...form, semester: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Semester 1">Semester 1</SelectItem>
                        <SelectItem value="Semester 2">Semester 2</SelectItem>
                        <SelectItem value="Both Semesters">Both Semesters</SelectItem>
                        <SelectItem value="Year Long">Year Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(value: 'Active' | 'Inactive' | 'Under Development') => setForm({...form, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Under Development">Under Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="enrolledStudents">Enrolled Students</Label>
                    <Input
                      id="enrolledStudents"
                      type="number"
                      value={form.enrolledStudents}
                      onChange={(e) => setForm({...form, enrolledStudents: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={form.maxCapacity}
                      onChange={(e) => setForm({...form, maxCapacity: parseInt(e.target.value)})}
                    />
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
                </div>

                <div>
                  <Label>Prerequisites</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={prerequisiteInput}
                      onChange={(e) => setPrerequisiteInput(e.target.value)}
                      placeholder="Enter course code (e.g., IT101)"
                      onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                    />
                    <Button type="button" onClick={addPrerequisite} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {prereq}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removePrerequisite(prereq)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={editingCourse ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingCourse ? 'Update' : 'Create'}
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
              <BookOpen className="h-4 w-4 text-blue-600" />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Total Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">Students enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-600" />
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Total capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              Avg Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.averageEnrollment}</div>
            <p className="text-xs text-muted-foreground">Students per course</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Course Catalog</CardTitle>
              <CardDescription>Browse and manage course offerings</CardDescription>
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
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Under Development">Under Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{course.courseName}</h3>
                      <Badge variant="outline" className="bg-gray-50 font-mono">{course.courseCode}</Badge>
                      <Badge variant={course.level === 'Certificate' ? 'default' :
                                   course.level === 'Diploma' ? 'secondary' :
                                   course.level === 'Degree' ? 'outline' : 'destructive'}>
                        {course.level}
                      </Badge>
                      <Badge variant={course.status === 'Active' ? 'default' :
                                   course.status === 'Under Development' ? 'secondary' : 'outline'}>
                        {course.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{course.department}</p>
                          <p className="text-gray-500">Department</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{course.instructor}</p>
                          <p className="text-gray-500">Instructor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{course.semester}</p>
                          <p className="text-gray-500">Semester</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{course.creditHours} Credits</p>
                          <p className="text-gray-500">{course.contactHours}hrs/week</p>
                        </div>
                      </div>
                    </div>

                    {course.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{course.enrolledStudents}/{course.maxCapacity}</p>
                        <p className="text-gray-500">Enrollment</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">K{(course.fees / 1000).toFixed(1)}k</p>
                        <p className="text-gray-500">Course Fees</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{course.academicYear}</p>
                        <p className="text-gray-500">Academic Year</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {Math.round((course.enrolledStudents / course.maxCapacity) * 100)}%
                        </p>
                        <p className="text-gray-500">Capacity Used</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No courses found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
