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
  CalendarDays,
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
  AlertTriangle
} from "lucide-react"

// Types
interface ClassSchedule {
  id: number
  scheduleCode: string
  courseCode: string
  courseName: string
  instructor: string
  department: string
  semester: 'Semester 1' | 'Semester 2' | 'Both Semesters'
  academicYear: string
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  startTime: string
  endTime: string
  duration: number
  room: string
  building: string
  capacity: number
  enrolledStudents: number
  status: 'Scheduled' | 'Confirmed' | 'Cancelled' | 'Completed'
  notes: string
  recurringWeeks: number
  conflicts: string[]
  lastUpdated: string
}

// Initial mock data
const initialSchedules: ClassSchedule[] = [
  {
    id: 1,
    scheduleCode: 'SCH-BUSI101-001',
    courseCode: 'BUSI101',
    courseName: 'Introduction to Business',
    instructor: 'Dr. James Kila',
    department: 'Business Studies',
    semester: 'Semester 1',
    academicYear: '2024',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    room: 'B201',
    building: 'Business Building',
    capacity: 50,
    enrolledStudents: 45,
    status: 'Confirmed',
    notes: 'Standard lecture with multimedia equipment required',
    recurringWeeks: 15,
    conflicts: [],
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    scheduleCode: 'SCH-IT201-001',
    courseCode: 'IT201',
    courseName: 'Database Systems',
    instructor: 'Ms. Sarah Natera',
    department: 'Information Technology',
    semester: 'Semester 2',
    academicYear: '2024',
    dayOfWeek: 'Tuesday',
    startTime: '10:30',
    endTime: '12:30',
    duration: 120,
    room: 'IT Lab 1',
    building: 'IT Building',
    capacity: 35,
    enrolledStudents: 32,
    status: 'Confirmed',
    notes: 'Computer lab session - hands-on database exercises',
    recurringWeeks: 15,
    conflicts: [],
    lastUpdated: '2024-01-12'
  },
  {
    id: 3,
    scheduleCode: 'SCH-ENG301-001',
    courseCode: 'ENG301',
    courseName: 'Power Systems',
    instructor: 'Eng. Peter Mekere',
    department: 'Engineering',
    semester: 'Semester 1',
    academicYear: '2024',
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '17:00',
    duration: 180,
    room: 'ENG Lab 2',
    building: 'Engineering Complex',
    capacity: 30,
    enrolledStudents: 28,
    status: 'Confirmed',
    notes: 'Laboratory session with electrical equipment',
    recurringWeeks: 15,
    conflicts: [],
    lastUpdated: '2024-01-10'
  },
  {
    id: 4,
    scheduleCode: 'SCH-AGRI202-001',
    courseCode: 'AGRI202',
    courseName: 'Sustainable Agriculture',
    instructor: 'Mr. John Wambi',
    department: 'Agriculture',
    semester: 'Semester 2',
    academicYear: '2024',
    dayOfWeek: 'Friday',
    startTime: '08:00',
    endTime: '12:00',
    duration: 240,
    room: 'Field Lab',
    building: 'Agriculture Campus',
    capacity: 25,
    enrolledStudents: 20,
    status: 'Scheduled',
    notes: 'Field work - weather dependent',
    recurringWeeks: 15,
    conflicts: ['Weather conditions may affect schedule'],
    lastUpdated: '2024-01-05'
  }
]

const departments = ['Business Studies', 'Information Technology', 'Engineering', 'Health Sciences', 'Agriculture']
const instructors = ['Dr. James Kila', 'Ms. Sarah Natera', 'Eng. Peter Mekere', 'Dr. Mary Temu', 'Mr. John Wambi']
const rooms = ['B201', 'B202', 'IT Lab 1', 'IT Lab 2', 'ENG Lab 1', 'ENG Lab 2', 'H101', 'Field Lab']
const buildings = ['Business Building', 'IT Building', 'Engineering Complex', 'Health Building', 'Agriculture Campus']
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function ClassSchedulingPage() {
  // State management
  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialSchedules)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDay, setFilterDay] = useState('all')

  // Form state
  const [form, setForm] = useState({
    scheduleCode: '',
    courseCode: '',
    courseName: '',
    instructor: '',
    department: '',
    semester: 'Semester 1' as const,
    academicYear: '2024',
    dayOfWeek: 'Monday' as const,
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    room: '',
    building: '',
    capacity: 30,
    enrolledStudents: 0,
    status: 'Scheduled' as const,
    notes: '',
    recurringWeeks: 15,
    conflicts: [] as string[],
    lastUpdated: new Date().toISOString().split('T')[0]
  })

  const [conflictInput, setConflictInput] = useState('')

  // Calculated statistics
  const stats = {
    totalSchedules: schedules.length,
    confirmedSchedules: schedules.filter(s => s.status === 'Confirmed').length,
    scheduledClasses: schedules.filter(s => s.status === 'Scheduled' || s.status === 'Confirmed').length,
    totalEnrolled: schedules.reduce((sum, s) => sum + s.enrolledStudents, 0),
    conflictsCount: schedules.filter(s => s.conflicts.length > 0).length
  }

  // CRUD Operations
  const handleAdd = () => {
    const scheduleCode = form.scheduleCode || `SCH-${form.courseCode}-${String(schedules.length + 1).padStart(3, '0')}`

    const newSchedule: ClassSchedule = {
      id: Math.max(...schedules.map(s => s.id)) + 1,
      ...form,
      scheduleCode
    }
    setSchedules([...schedules, newSchedule])
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule)
    setForm({
      scheduleCode: schedule.scheduleCode,
      courseCode: schedule.courseCode,
      courseName: schedule.courseName,
      instructor: schedule.instructor,
      department: schedule.department,
      semester: schedule.semester,
      academicYear: schedule.academicYear,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      duration: schedule.duration,
      room: schedule.room,
      building: schedule.building,
      capacity: schedule.capacity,
      enrolledStudents: schedule.enrolledStudents,
      status: schedule.status,
      notes: schedule.notes,
      recurringWeeks: schedule.recurringWeeks,
      conflicts: schedule.conflicts,
      lastUpdated: schedule.lastUpdated
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(s =>
        s.id === editingSchedule.id ? { ...editingSchedule, ...form, lastUpdated: new Date().toISOString().split('T')[0] } : s
      ))
      setEditingSchedule(null)
      resetForm()
      setDialogOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this class schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  const resetForm = () => {
    setForm({
      scheduleCode: '',
      courseCode: '',
      courseName: '',
      instructor: '',
      department: '',
      semester: 'Semester 1',
      academicYear: '2024',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
      room: '',
      building: '',
      capacity: 30,
      enrolledStudents: 0,
      status: 'Scheduled',
      notes: '',
      recurringWeeks: 15,
      conflicts: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    })
    setConflictInput('')
  }

  // Conflict management
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

  // Calculate duration when times change
  const updateDuration = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      const start = new Date(`2024-01-01 ${startTime}`)
      const end = new Date(`2024-01-01 ${endTime}`)
      const diffMs = end.getTime() - start.getTime()
      const diffMins = Math.round(diffMs / (1000 * 60))
      setForm({...form, startTime, endTime, duration: diffMins > 0 ? diffMins : 60})
    }
  }

  // Filter functions
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || schedule.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus
    const matchesDay = filterDay === 'all' || schedule.dayOfWeek === filterDay
    return matchesSearch && matchesDepartment && matchesStatus && matchesDay
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Class Scheduling Management
          </h1>
          <p className="text-gray-600">
            Manage class timetables, room assignments, and scheduling conflicts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Schedule
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule ? 'Update the class schedule details' : 'Create a new class schedule entry'}
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

                  <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Schedule Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dayOfWeek">Day of Week</Label>
                      <Select value={form.dayOfWeek} onValueChange={(value: any) => setForm({...form, dayOfWeek: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={form.startTime}
                        onChange={(e) => updateDuration(e.target.value, form.endTime)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={form.endTime}
                        onChange={(e) => updateDuration(form.startTime, e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={form.duration}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurringWeeks">Recurring Weeks</Label>
                      <Input
                        id="recurringWeeks"
                        type="number"
                        value={form.recurringWeeks}
                        onChange={(e) => setForm({...form, recurringWeeks: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Room & Capacity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Room & Capacity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="room">Room</Label>
                      <Select value={form.room} onValueChange={(value) => setForm({...form, room: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map(room => (
                            <SelectItem key={room} value={room}>{room}</SelectItem>
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

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </div>

                {/* Notes & Conflicts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notes & Conflicts</h3>
                  <div>
                    <Label htmlFor="notes">Schedule Notes</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({...form, notes: e.target.value})}
                      placeholder="Special requirements, equipment needs, etc..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Potential Conflicts</Label>
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
              <CalendarDays className="h-4 w-4 text-blue-600" />
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
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedSchedules}</div>
            <p className="text-xs text-muted-foreground">Confirmed classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Active Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.scheduledClasses}</div>
            <p className="text-xs text-muted-foreground">Scheduled + confirmed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Total Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">Students in classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.conflictsCount}</div>
            <p className="text-xs text-muted-foreground">Scheduling conflicts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Class Schedule Directory</CardTitle>
              <CardDescription>Browse and manage class schedules and timetables</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search schedules..."
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
              <Select value={filterDay} onValueChange={setFilterDay}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day.slice(0,3)}</SelectItem>
                  ))}
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
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                      <Badge variant="outline" className="bg-gray-50 font-mono text-xs">{schedule.scheduleCode}</Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{schedule.courseCode}</Badge>
                      <Badge variant={schedule.status === 'Confirmed' ? 'default' :
                                   schedule.status === 'Scheduled' ? 'secondary' :
                                   schedule.status === 'Cancelled' ? 'destructive' : 'outline'}>
                        {schedule.status}
                      </Badge>
                      {schedule.conflicts.length > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {schedule.conflicts.length} conflict{schedule.conflicts.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.instructor}</p>
                          <p className="text-gray-500">Instructor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.department}</p>
                          <p className="text-gray-500">Department</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.dayOfWeek}</p>
                          <p className="text-gray-500">{schedule.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{schedule.startTime} - {schedule.endTime}</p>
                          <p className="text-gray-500">{schedule.duration} mins</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{schedule.room}</p>
                          <p className="text-gray-500">{schedule.building}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.enrolledStudents}/{schedule.capacity}</p>
                        <p className="text-gray-500">Enrollment</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.recurringWeeks} weeks</p>
                        <p className="text-gray-500">Duration</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{schedule.academicYear}</p>
                        <p className="text-gray-500">Academic Year</p>
                      </div>
                    </div>

                    {schedule.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">{schedule.notes}</p>
                      </div>
                    )}

                    {schedule.conflicts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-red-700 mb-2">Conflicts:</p>
                        <div className="flex flex-wrap gap-2">
                          {schedule.conflicts.map((conflict, index) => (
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
                No class schedules found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
