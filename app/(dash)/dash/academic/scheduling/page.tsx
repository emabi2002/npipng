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
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users,
  Building2,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  BookOpen,
  Zap
} from "lucide-react"

// Types
interface Schedule {
  id: number
  courseCode: string
  courseName: string
  instructor: string
  instructorEmail: string
  department: string
  program: string
  semester: 'Semester 1' | 'Semester 2' | 'Year Long'
  year: number
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  startTime: string
  endTime: string
  duration: number // in minutes
  room: string
  building: string
  capacity: number
  enrolledStudents: number
  scheduleType: 'Lecture' | 'Laboratory' | 'Tutorial' | 'Seminar' | 'Workshop'
  status: 'Active' | 'Cancelled' | 'Postponed' | 'Completed'
  recurring: boolean
  startDate: string
  endDate: string
  notes: string
}

// Initial mock data
const initialSchedules: Schedule[] = [
  {
    id: 1,
    courseCode: 'BUSI101',
    courseName: 'Introduction to Business Management',
    instructor: 'Dr. James Kila',
    instructorEmail: 'j.kila@npipng.ac.pg',
    department: 'Business Studies',
    program: 'Diploma in Business Administration',
    semester: 'Semester 1',
    year: 2024,
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    room: 'LT-101',
    building: 'Business Building',
    capacity: 50,
    enrolledStudents: 35,
    scheduleType: 'Lecture',
    status: 'Active',
    recurring: true,
    startDate: '2024-02-05',
    endDate: '2024-06-28',
    notes: 'Weekly lecture with case study discussions'
  },
  {
    id: 2,
    courseCode: 'IT102',
    courseName: 'Programming Fundamentals',
    instructor: 'Ms. Sarah Natera',
    instructorEmail: 's.natera@npipng.ac.pg',
    department: 'Information Technology',
    program: 'Certificate in Information Technology',
    semester: 'Semester 1',
    year: 2024,
    dayOfWeek: 'Tuesday',
    startTime: '10:30',
    endTime: '12:30',
    duration: 120,
    room: 'Lab-201',
    building: 'IT Building',
    capacity: 25,
    enrolledStudents: 22,
    scheduleType: 'Laboratory',
    status: 'Active',
    recurring: true,
    startDate: '2024-02-06',
    endDate: '2024-06-25',
    notes: 'Hands-on programming sessions with Python'
  },
  {
    id: 3,
    courseCode: 'ENG201',
    courseName: 'Electrical Circuit Analysis',
    instructor: 'Eng. Peter Mekere',
    instructorEmail: 'p.mekere@npipng.ac.pg',
    department: 'Engineering',
    program: 'Diploma in Electrical Engineering',
    semester: 'Semester 2',
    year: 2024,
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    duration: 120,
    room: 'ENG-301',
    building: 'Engineering Complex',
    capacity: 30,
    enrolledStudents: 18,
    scheduleType: 'Lecture',
    status: 'Active',
    recurring: true,
    startDate: '2024-07-22',
    endDate: '2024-11-30',
    notes: 'Advanced circuit analysis with simulation software'
  },
  {
    id: 4,
    courseCode: 'HLTH105',
    courseName: 'Community Health Promotion',
    instructor: 'Dr. Mary Temu',
    instructorEmail: 'm.temu@npipng.ac.pg',
    department: 'Health Sciences',
    program: 'Certificate in Community Health',
    semester: 'Semester 1',
    year: 2024,
    dayOfWeek: 'Thursday',
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    room: 'SEM-105',
    building: 'Health Building',
    capacity: 35,
    enrolledStudents: 24,
    scheduleType: 'Seminar',
    status: 'Active',
    recurring: true,
    startDate: '2024-02-08',
    endDate: '2024-06-27',
    notes: 'Interactive seminars with community case studies'
  },
  {
    id: 5,
    courseCode: 'AGRI103',
    courseName: 'Sustainable Crop Production',
    instructor: 'Mr. John Wambi',
    instructorEmail: 'j.wambi@npipng.ac.pg',
    department: 'Agriculture',
    program: 'Diploma in Sustainable Agriculture',
    semester: 'Year Long',
    year: 2024,
    dayOfWeek: 'Friday',
    startTime: '13:00',
    endTime: '16:00',
    duration: 180,
    room: 'Field-A',
    building: 'Agriculture Campus',
    capacity: 20,
    enrolledStudents: 12,
    scheduleType: 'Workshop',
    status: 'Postponed',
    recurring: true,
    startDate: '2024-02-09',
    endDate: '2024-11-29',
    notes: 'Field work sessions - weather dependent'
  }
]

export default function SchedulingPage() {
  // State management
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterDay, setFilterDay] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state
  const [form, setForm] = useState({
    courseCode: '',
    courseName: '',
    instructor: '',
    instructorEmail: '',
    department: '',
    program: '',
    semester: 'Semester 1' as const,
    year: new Date().getFullYear(),
    dayOfWeek: 'Monday' as const,
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    room: '',
    building: '',
    capacity: 30,
    enrolledStudents: 0,
    scheduleType: 'Lecture' as const,
    status: 'Active' as const,
    recurring: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
    notes: ''
  })

  // Get unique values for filters
  const departments = Array.from(new Set(schedules.map(s => s.department)))
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Calculated statistics
  const stats = {
    totalSchedules: schedules.length,
    activeSchedules: schedules.filter(s => s.status === 'Active').length,
    totalEnrollment: schedules.reduce((sum, s) => sum + s.enrolledStudents, 0),
    totalCapacity: schedules.reduce((sum, s) => sum + s.capacity, 0),
    roomUtilization: Math.round((schedules.filter(s => s.status === 'Active').length / schedules.length) * 100)
  }

  // CRUD Operations
  const handleAdd = () => {
    const newSchedule: Schedule = {
      id: Math.max(...schedules.map(s => s.id)) + 1,
      ...form,
      duration: calculateDuration(form.startTime, form.endTime)
    }
    setSchedules([...schedules, newSchedule])
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setForm({
      courseCode: schedule.courseCode,
      courseName: schedule.courseName,
      instructor: schedule.instructor,
      instructorEmail: schedule.instructorEmail,
      department: schedule.department,
      program: schedule.program,
      semester: schedule.semester,
      year: schedule.year,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      duration: schedule.duration,
      room: schedule.room,
      building: schedule.building,
      capacity: schedule.capacity,
      enrolledStudents: schedule.enrolledStudents,
      scheduleType: schedule.scheduleType,
      status: schedule.status,
      recurring: schedule.recurring,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      notes: schedule.notes
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(s =>
        s.id === editingSchedule.id ? {
          ...editingSchedule,
          ...form,
          duration: calculateDuration(form.startTime, form.endTime)
        } : s
      ))
      setEditingSchedule(null)
      resetForm()
      setDialogOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  const resetForm = () => {
    setForm({
      courseCode: '',
      courseName: '',
      instructor: '',
      instructorEmail: '',
      department: '',
      program: '',
      semester: 'Semester 1',
      year: new Date().getFullYear(),
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
      room: '',
      building: '',
      capacity: 30,
      enrolledStudents: 0,
      scheduleType: 'Lecture',
      status: 'Active',
      recurring: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
      notes: ''
    })
  }

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2024-01-01T${startTime}:00`)
    const end = new Date(`2024-01-01T${endTime}:00`)
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  }

  // Filter functions
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || schedule.department === filterDepartment
    const matchesDay = filterDay === 'all' || schedule.dayOfWeek === filterDay
    const matchesType = filterType === 'all' || schedule.scheduleType === filterType
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus
    return matchesSearch && matchesDepartment && matchesDay && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Class Scheduling Management
          </h1>
          <p className="text-gray-600">
            Manage class schedules, timetables, and room allocations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Timetable
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingSchedule(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule ? 'Update the schedule details' : 'Create a new class schedule'}
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
                    <Label htmlFor="scheduleType">Schedule Type</Label>
                    <Select value={form.scheduleType} onValueChange={(value: any) => setForm({...form, scheduleType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lecture">Lecture</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={form.courseName}
                    onChange={(e) => setForm({...form, courseName: e.target.value})}
                    placeholder="Introduction to Business Management"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={form.instructor}
                      onChange={(e) => setForm({...form, instructor: e.target.value})}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructorEmail">Instructor Email</Label>
                    <Input
                      id="instructorEmail"
                      type="email"
                      value={form.instructorEmail}
                      onChange={(e) => setForm({...form, instructorEmail: e.target.value})}
                      placeholder="instructor@npipng.ac.pg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={form.department}
                      onChange={(e) => setForm({...form, department: e.target.value})}
                      placeholder="Business Studies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Input
                      id="program"
                      value={form.program}
                      onChange={(e) => setForm({...form, program: e.target.value})}
                      placeholder="Diploma in Business Administration"
                    />
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
                        <SelectItem value="Year Long">Year Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({...form, year: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dayOfWeek">Day of Week</Label>
                    <Select value={form.dayOfWeek} onValueChange={(value: any) => setForm({...form, dayOfWeek: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({...form, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm({...form, endTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={form.room}
                      onChange={(e) => setForm({...form, room: e.target.value})}
                      placeholder="LT-101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={form.building}
                      onChange={(e) => setForm({...form, building: e.target.value})}
                      placeholder="Business Building"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="capacity">Room Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({...form, capacity: parseInt(e.target.value)})}
                    />
                  </div>
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
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(value: any) => setForm({...form, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Postponed">Postponed</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({...form, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({...form, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    placeholder="Additional notes or requirements..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={editingSchedule ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingSchedule ? 'Update' : 'Create'}
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
              <Calendar className="h-4 w-4 text-blue-600" />
              Total Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSchedules}</div>
            <p className="text-xs text-muted-foreground">Class schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Active Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSchedules}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Total Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalEnrollment}</div>
            <p className="text-xs text-muted-foreground">Students scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Room Capacity
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
              <Zap className="h-4 w-4 text-indigo-600" />
              Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.roomUtilization}%</div>
            <p className="text-xs text-muted-foreground">Room utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Schedule Directory</CardTitle>
              <CardDescription>Browse and manage class schedules</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDay} onValueChange={setFilterDay}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Postponed">Postponed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{schedule.courseName}</h3>
                      <Badge variant="outline" className="bg-gray-50">{schedule.courseCode}</Badge>
                      <Badge variant="secondary">{schedule.scheduleType}</Badge>
                      <Badge variant={schedule.status === 'Active' ? 'default' :
                                   schedule.status === 'Postponed' ? 'secondary' : 'outline'}>
                        {schedule.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.instructor}</p>
                          <p className="text-gray-500">Instructor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.dayOfWeek}</p>
                          <p className="text-gray-500">{schedule.startTime} - {schedule.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.room}</p>
                          <p className="text-gray-500">{schedule.building}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.enrolledStudents}/{schedule.capacity}</p>
                          <p className="text-gray-500">Enrollment</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{schedule.department}</p>
                        <p className="text-gray-500">Department</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.semester}</p>
                        <p className="text-gray-500">Semester</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.duration} min</p>
                        <p className="text-gray-500">Duration</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.recurring ? 'Yes' : 'No'}</p>
                        <p className="text-gray-500">Recurring</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{new Date(schedule.startDate).toLocaleDateString()}</p>
                        <p className="text-gray-500">Start Date</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{new Date(schedule.endDate).toLocaleDateString()}</p>
                        <p className="text-gray-500">End Date</p>
                      </div>
                    </div>

                    {schedule.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{schedule.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(schedule)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(schedule.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSchedules.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No schedules found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
