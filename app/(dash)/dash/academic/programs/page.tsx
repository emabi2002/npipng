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
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  Clock,
  Building2,
  Award,
  Calendar,
  DollarSign,
  AlertCircle,
  Save,
  X,
  User,
  Database
} from "lucide-react"

// Import database utility
import { programsDB, DatabaseRecord } from "@/lib/database"

// Types
interface Program extends DatabaseRecord {
  name: string
  code: string
  type: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Associate Degree'
  level: 'Foundation' | 'Intermediate' | 'Advanced'
  department: string
  departmentCode: string
  description: string
  duration: number // in semesters
  credits: number
  coordinator: string
  coordinatorEmail: string
  status: 'Active' | 'Inactive' | 'Under Review' | 'Suspended'
  establishedYear: number
  totalStudents: number
  capacity: number
  tuitionFee: number
  entryRequirements: string
  careerOutcomes: string[]
  accreditationBody: string
  lastReview: string
}

// Initial data to seed the database
const initialPrograms: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Diploma in Business Administration',
    code: 'DBA001',
    type: 'Diploma',
    level: 'Intermediate',
    department: 'Business Studies',
    departmentCode: 'BUSI',
    description: 'Comprehensive business administration program covering management, finance, marketing, and operations',
    duration: 4,
    credits: 120,
    coordinator: 'Dr. James Kila',
    coordinatorEmail: 'j.kila@npipng.ac.pg',
    status: 'Active',
    establishedYear: 2015,
    totalStudents: 85,
    capacity: 120,
    tuitionFee: 4500,
    entryRequirements: 'Grade 12 certificate with minimum C grade in Mathematics and English',
    careerOutcomes: ['Business Manager', 'Administrative Officer', 'Operations Coordinator', 'Team Leader'],
    accreditationBody: 'PNG National Training Council',
    lastReview: '2023-08-15'
  },
  {
    name: 'Certificate in Information Technology',
    code: 'CIT001',
    type: 'Certificate',
    level: 'Foundation',
    department: 'Information Technology',
    departmentCode: 'IT',
    description: 'Foundation program in IT covering computer basics, programming fundamentals, and system administration',
    duration: 2,
    credits: 60,
    coordinator: 'Ms. Sarah Natera',
    coordinatorEmail: 's.natera@npipng.ac.pg',
    status: 'Active',
    establishedYear: 2012,
    totalStudents: 65,
    capacity: 80,
    tuitionFee: 2800,
    entryRequirements: 'Grade 10 certificate with basic computer literacy',
    careerOutcomes: ['Computer Technician', 'Help Desk Support', 'Data Entry Clerk', 'IT Assistant'],
    accreditationBody: 'PNG National Training Council',
    lastReview: '2023-06-20'
  },
  {
    name: 'Diploma in Electrical Engineering',
    code: 'DEE001',
    type: 'Diploma',
    level: 'Advanced',
    department: 'Engineering',
    departmentCode: 'ENG',
    description: 'Advanced electrical engineering program with focus on power systems, electronics, and control systems',
    duration: 6,
    credits: 180,
    coordinator: 'Eng. Peter Mekere',
    coordinatorEmail: 'p.mekere@npipng.ac.pg',
    status: 'Active',
    establishedYear: 2010,
    totalStudents: 92,
    capacity: 100,
    tuitionFee: 6200,
    entryRequirements: 'Grade 12 certificate with A or B grade in Mathematics and Physics',
    careerOutcomes: ['Electrical Engineer', 'Power Systems Technician', 'Control Systems Engineer', 'Project Engineer'],
    accreditationBody: 'Engineers Australia',
    lastReview: '2023-09-10'
  },
  {
    name: 'Certificate in Community Health',
    code: 'CCH001',
    type: 'Certificate',
    level: 'Intermediate',
    department: 'Health Sciences',
    departmentCode: 'HLTH',
    description: 'Community health program focusing on public health, health promotion, and community wellness',
    duration: 3,
    credits: 90,
    coordinator: 'Dr. Mary Temu',
    coordinatorEmail: 'm.temu@npipng.ac.pg',
    status: 'Active',
    establishedYear: 2016,
    totalStudents: 45,
    capacity: 60,
    tuitionFee: 3500,
    entryRequirements: 'Grade 12 certificate with minimum C grade in Biology and English',
    careerOutcomes: ['Community Health Worker', 'Health Educator', 'Health Program Assistant', 'Wellness Coordinator'],
    accreditationBody: 'PNG Health Department',
    lastReview: '2023-07-05'
  },
  {
    name: 'Diploma in Sustainable Agriculture',
    code: 'DSA001',
    type: 'Diploma',
    level: 'Intermediate',
    department: 'Agriculture',
    departmentCode: 'AGRI',
    description: 'Sustainable agriculture practices with focus on crop production, soil management, and rural development',
    duration: 4,
    credits: 120,
    coordinator: 'Mr. John Wambi',
    coordinatorEmail: 'j.wambi@npipng.ac.pg',
    status: 'Under Review',
    establishedYear: 2011,
    totalStudents: 28,
    capacity: 50,
    tuitionFee: 3800,
    entryRequirements: 'Grade 12 certificate with minimum C grade in Agriculture or Biology',
    careerOutcomes: ['Agricultural Extension Officer', 'Farm Manager', 'Agricultural Technician', 'Rural Development Officer'],
    accreditationBody: 'PNG Agriculture Department',
    lastReview: '2023-05-12'
  }
]

export default function ProgramsPage() {
  // State management
  const [programs, setPrograms] = useState<Program[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state
  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'Certificate' as const,
    level: 'Foundation' as const,
    department: '',
    departmentCode: '',
    description: '',
    duration: 2,
    credits: 60,
    coordinator: '',
    coordinatorEmail: '',
    status: 'Active' as const,
    establishedYear: new Date().getFullYear(),
    totalStudents: 0,
    capacity: 30,
    tuitionFee: 2000,
    entryRequirements: '',
    careerOutcomes: [''],
    accreditationBody: '',
    lastReview: new Date().toISOString().split('T')[0]
  })

  // Load data from database
  useEffect(() => {
    const loadPrograms = () => {
      try {
        const savedPrograms = programsDB.getAll()

        // If no data exists, initialize with default data
        if (savedPrograms.length === 0) {
          const defaultPrograms = initialPrograms.map(program =>
            programsDB.create(program)
          )
          setPrograms(defaultPrograms)
        } else {
          setPrograms(savedPrograms)
        }
      } catch (error) {
        console.error('Error loading programs:', error)
        setPrograms([])
      } finally {
        setLoading(false)
      }
    }

    loadPrograms()
  }, [])

  // Get unique departments
  const departments = Array.from(new Set(programs.map(p => p.department)))

  // Calculated statistics
  const stats = {
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.status === 'Active').length,
    totalStudents: programs.reduce((sum, p) => sum + p.totalStudents, 0),
    totalCapacity: programs.reduce((sum, p) => sum + p.capacity, 0),
    averageFee: programs.length > 0 ? Math.round(programs.reduce((sum, p) => sum + p.tuitionFee, 0) / programs.length) : 0
  }

  // CRUD Operations with database persistence
  const handleAdd = () => {
    try {
      const newProgram = programsDB.create({
        ...form,
        careerOutcomes: form.careerOutcomes.filter(outcome => outcome.trim() !== '')
      })
      setPrograms([...programs, newProgram])
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error creating program:', error)
      alert('Error creating program. Please try again.')
    }
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setForm({
      name: program.name,
      code: program.code,
      type: program.type,
      level: program.level,
      department: program.department,
      departmentCode: program.departmentCode,
      description: program.description,
      duration: program.duration,
      credits: program.credits,
      coordinator: program.coordinator,
      coordinatorEmail: program.coordinatorEmail,
      status: program.status,
      establishedYear: program.establishedYear,
      totalStudents: program.totalStudents,
      capacity: program.capacity,
      tuitionFee: program.tuitionFee,
      entryRequirements: program.entryRequirements,
      careerOutcomes: [...program.careerOutcomes, ''],
      accreditationBody: program.accreditationBody,
      lastReview: program.lastReview
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingProgram) {
      try {
        const updatedProgram = programsDB.update(editingProgram.id, {
          ...form,
          careerOutcomes: form.careerOutcomes.filter(outcome => outcome.trim() !== '')
        })
        if (updatedProgram) {
          setPrograms(programs.map(p =>
            p.id === editingProgram.id ? updatedProgram : p
          ))
          setEditingProgram(null)
          resetForm()
          setDialogOpen(false)
        }
      } catch (error) {
        console.error('Error updating program:', error)
        alert('Error updating program. Please try again.')
      }
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      try {
        const success = programsDB.delete(id)
        if (success) {
          setPrograms(programs.filter(p => p.id !== id))
        }
      } catch (error) {
        console.error('Error deleting program:', error)
        alert('Error deleting program. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      type: 'Certificate',
      level: 'Foundation',
      department: '',
      departmentCode: '',
      description: '',
      duration: 2,
      credits: 60,
      coordinator: '',
      coordinatorEmail: '',
      status: 'Active',
      establishedYear: new Date().getFullYear(),
      totalStudents: 0,
      capacity: 30,
      tuitionFee: 2000,
      entryRequirements: '',
      careerOutcomes: [''],
      accreditationBody: '',
      lastReview: new Date().toISOString().split('T')[0]
    })
    setEditingProgram(null)
  }

  // Export data function
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(programs, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `programs_export_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error exporting data. Please try again.')
    }
  }

  const addCareerOutcome = () => {
    setForm({...form, careerOutcomes: [...form.careerOutcomes, '']})
  }

  const updateCareerOutcome = (index: number, value: string) => {
    const newOutcomes = [...form.careerOutcomes]
    newOutcomes[index] = value
    setForm({...form, careerOutcomes: newOutcomes})
  }

  const removeCareerOutcome = (index: number) => {
    const newOutcomes = form.careerOutcomes.filter((_, i) => i !== index)
    setForm({...form, careerOutcomes: newOutcomes})
  }

  // Filter functions
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || program.type === filterType
    const matchesDepartment = filterDepartment === 'all' || program.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus
    return matchesSearch && matchesType && matchesDepartment && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading programs...</p>
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
            <GraduationCap className="h-8 w-8" />
            Program Management
          </h1>
          <p className="text-gray-600">
            Manage academic programs, qualifications, and course offerings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Programs
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProgram(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </DialogTitle>
                <DialogDescription>
                  {editingProgram ? 'Update the program details' : 'Create a new academic program'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Program Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        placeholder="Diploma in Business Administration"
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Program Code</Label>
                      <Input
                        id="code"
                        value={form.code}
                        onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                        placeholder="DBA001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Program Type</Label>
                      <Select value={form.type} onValueChange={(value: any) => setForm({...form, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Advanced Diploma">Advanced Diploma</SelectItem>
                          <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Select value={form.level} onValueChange={(value: any) => setForm({...form, level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Foundation">Foundation</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={form.status} onValueChange={(value: any) => setForm({...form, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Program description and objectives..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Department & Coordination */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Department & Coordination</h3>
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
                      <Label htmlFor="departmentCode">Department Code</Label>
                      <Input
                        id="departmentCode"
                        value={form.departmentCode}
                        onChange={(e) => setForm({...form, departmentCode: e.target.value.toUpperCase()})}
                        placeholder="BUSI"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coordinator">Program Coordinator</Label>
                      <Input
                        id="coordinator"
                        value={form.coordinator}
                        onChange={(e) => setForm({...form, coordinator: e.target.value})}
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coordinatorEmail">Coordinator Email</Label>
                      <Input
                        id="coordinatorEmail"
                        type="email"
                        value={form.coordinatorEmail}
                        onChange={(e) => setForm({...form, coordinatorEmail: e.target.value})}
                        placeholder="coordinator@npipng.ac.pg"
                      />
                    </div>
                  </div>
                </div>

                {/* Program Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Program Details</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (Semesters)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={form.duration}
                        onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="credits">Total Credits</Label>
                      <Input
                        id="credits"
                        type="number"
                        value={form.credits}
                        onChange={(e) => setForm({...form, credits: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Student Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={form.capacity}
                        onChange={(e) => setForm({...form, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tuitionFee">Tuition Fee (PGK)</Label>
                      <Input
                        id="tuitionFee"
                        type="number"
                        value={form.tuitionFee}
                        onChange={(e) => setForm({...form, tuitionFee: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        value={form.establishedYear}
                        onChange={(e) => setForm({...form, establishedYear: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalStudents">Current Students</Label>
                      <Input
                        id="totalStudents"
                        type="number"
                        value={form.totalStudents}
                        onChange={(e) => setForm({...form, totalStudents: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements & Outcomes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Requirements & Outcomes</h3>
                  <div>
                    <Label htmlFor="entryRequirements">Entry Requirements</Label>
                    <Textarea
                      id="entryRequirements"
                      value={form.entryRequirements}
                      onChange={(e) => setForm({...form, entryRequirements: e.target.value})}
                      placeholder="Entry requirements and prerequisites..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Career Outcomes</Label>
                    <div className="space-y-2">
                      {form.careerOutcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={outcome}
                            onChange={(e) => updateCareerOutcome(index, e.target.value)}
                            placeholder="Career outcome..."
                          />
                          {form.careerOutcomes.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCareerOutcome(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCareerOutcome}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Career Outcome
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accreditationBody">Accreditation Body</Label>
                      <Input
                        id="accreditationBody"
                        value={form.accreditationBody}
                        onChange={(e) => setForm({...form, accreditationBody: e.target.value})}
                        placeholder="PNG National Training Council"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastReview">Last Review Date</Label>
                      <Input
                        id="lastReview"
                        type="date"
                        value={form.lastReview}
                        onChange={(e) => setForm({...form, lastReview: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Data will be saved to your browser&apos;s local storage and persist across sessions.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={editingProgram ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingProgram ? 'Update' : 'Create'}
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
              <GraduationCap className="h-4 w-4 text-blue-600" />
              Total Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">Academic programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              Active Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePrograms}</div>
            <p className="text-xs text-muted-foreground">Currently offered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled across programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-600" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Maximum intake</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-indigo-600" />
              Average Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">K{stats.averageFee}</div>
            <p className="text-xs text-muted-foreground">Tuition fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Program Directory</CardTitle>
              <CardDescription>Browse and manage academic programs</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Advanced Diploma">Advanced Diploma</SelectItem>
                  <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                </SelectContent>
              </Select>
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{program.name}</h3>
                      <Badge variant="outline" className="bg-gray-50">{program.code}</Badge>
                      <Badge variant="secondary">{program.type}</Badge>
                      <Badge variant={program.status === 'Active' ? 'default' :
                                   program.status === 'Under Review' ? 'secondary' : 'outline'}>
                        {program.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{program.department}</p>
                          <p className="text-gray-500">Department</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{program.coordinator}</p>
                          <p className="text-gray-500">Coordinator</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{program.duration} semesters</p>
                          <p className="text-gray-500">Duration</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{program.level}</p>
                        <p className="text-gray-500">Level</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{program.credits}</p>
                        <p className="text-gray-500">Credits</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{program.totalStudents}/{program.capacity}</p>
                        <p className="text-gray-500">Enrollment</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">K{program.tuitionFee}</p>
                        <p className="text-gray-500">Tuition Fee</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{program.establishedYear}</p>
                        <p className="text-gray-500">Established</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{new Date(program.lastReview).getFullYear()}</p>
                        <p className="text-gray-500">Last Review</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Career Outcomes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.careerOutcomes.slice(0, 3).map((outcome, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {outcome}
                          </Badge>
                        ))}
                        {program.careerOutcomes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{program.careerOutcomes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(program.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No programs found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
