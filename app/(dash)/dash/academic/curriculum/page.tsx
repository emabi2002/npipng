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
  BookMarked,
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
  Target,
  CheckCircle,
  FileText
} from "lucide-react"

// Types
interface CourseRequirement {
  courseCode: string
  courseName: string
  credits: number
  semester: string
  isCore: boolean
  prerequisites: string[]
}

interface Curriculum {
  id: number
  curriculumCode: string
  curriculumName: string
  description: string
  department: string
  program: string
  level: 'Certificate' | 'Diploma' | 'Degree' | 'Postgraduate'
  totalCredits: number
  duration: string
  status: 'Active' | 'Under Development' | 'Under Review' | 'Archived'
  effectiveDate: string
  lastRevision: string
  approvedBy: string
  coreCredits: number
  electiveCredits: number
  courseRequirements: CourseRequirement[]
  graduationRequirements: string[]
  learningOutcomes: string[]
  careerOutcomes: string[]
  accreditation: string
}

// Initial mock data
const initialCurricula: Curriculum[] = [
  {
    id: 1,
    curriculumCode: 'CURR-BUSI-CERT-001',
    curriculumName: 'Certificate in Business Studies',
    description: 'Comprehensive business foundation curriculum covering management, accounting, and entrepreneurship fundamentals.',
    department: 'Business Studies',
    program: 'Certificate in Business Studies',
    level: 'Certificate',
    totalCredits: 60,
    duration: '1 Year',
    status: 'Active',
    effectiveDate: '2024-01-01',
    lastRevision: '2023-11-15',
    approvedBy: 'Academic Board',
    coreCredits: 45,
    electiveCredits: 15,
    courseRequirements: [
      { courseCode: 'BUSI101', courseName: 'Introduction to Business', credits: 3, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'ACCT101', courseName: 'Basic Accounting', credits: 3, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'MGMT101', courseName: 'Management Principles', credits: 3, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'BUSI201', courseName: 'Business Communication', credits: 3, semester: 'Semester 2', isCore: true, prerequisites: ['BUSI101'] },
      { courseCode: 'ENTR101', courseName: 'Entrepreneurship', credits: 3, semester: 'Semester 2', isCore: false, prerequisites: ['BUSI101'] }
    ],
    graduationRequirements: [
      'Complete minimum 60 credits',
      'Maintain GPA of 2.0 or higher',
      'Complete all core courses',
      'Complete practical work experience (100 hours)',
      'Submit final business project'
    ],
    learningOutcomes: [
      'Demonstrate understanding of fundamental business concepts',
      'Apply basic accounting principles',
      'Analyze business environments and opportunities',
      'Develop basic business communication skills'
    ],
    careerOutcomes: [
      'Junior Business Administrator',
      'Administrative Assistant',
      'Small Business Owner',
      'Sales Representative'
    ],
    accreditation: 'PNG Qualifications Authority'
  },
  {
    id: 2,
    curriculumCode: 'CURR-IT-DIP-001',
    curriculumName: 'Diploma in Information Technology',
    description: 'Comprehensive IT curriculum covering programming, databases, networking, and system administration.',
    department: 'Information Technology',
    program: 'Diploma in Information Technology',
    level: 'Diploma',
    totalCredits: 120,
    duration: '2 Years',
    status: 'Active',
    effectiveDate: '2024-01-01',
    lastRevision: '2023-10-20',
    approvedBy: 'Academic Board',
    coreCredits: 90,
    electiveCredits: 30,
    courseRequirements: [
      { courseCode: 'IT101', courseName: 'Computer Fundamentals', credits: 3, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'PROG101', courseName: 'Programming Basics', credits: 4, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'IT201', courseName: 'Database Systems', credits: 4, semester: 'Semester 2', isCore: true, prerequisites: ['IT101'] },
      { courseCode: 'NET201', courseName: 'Network Administration', credits: 4, semester: 'Semester 3', isCore: true, prerequisites: ['IT101'] },
      { courseCode: 'WEB301', courseName: 'Web Development', credits: 4, semester: 'Semester 4', isCore: false, prerequisites: ['PROG101', 'IT201'] }
    ],
    graduationRequirements: [
      'Complete minimum 120 credits',
      'Maintain GPA of 2.5 or higher',
      'Complete all core courses',
      'Complete industry placement (240 hours)',
      'Submit capstone project',
      'Pass comprehensive examination'
    ],
    learningOutcomes: [
      'Design and implement software solutions',
      'Administer database systems',
      'Configure and manage network infrastructure',
      'Develop web applications'
    ],
    careerOutcomes: [
      'Software Developer',
      'Database Administrator',
      'Network Technician',
      'IT Support Specialist',
      'Web Developer'
    ],
    accreditation: 'PNG Qualifications Authority'
  },
  {
    id: 3,
    curriculumCode: 'CURR-ENG-DEG-001',
    curriculumName: 'Bachelor of Engineering (Electrical)',
    description: 'Professional engineering curriculum covering electrical systems, power generation, and renewable energy.',
    department: 'Engineering',
    program: 'Bachelor of Engineering (Electrical)',
    level: 'Degree',
    totalCredits: 180,
    duration: '4 Years',
    status: 'Active',
    effectiveDate: '2024-01-01',
    lastRevision: '2023-09-10',
    approvedBy: 'Engineering Council PNG',
    coreCredits: 140,
    electiveCredits: 40,
    courseRequirements: [
      { courseCode: 'MATH101', courseName: 'Engineering Mathematics I', credits: 4, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'PHYS101', courseName: 'Engineering Physics', credits: 4, semester: 'Semester 1', isCore: true, prerequisites: [] },
      { courseCode: 'ENG201', courseName: 'Circuit Analysis', credits: 5, semester: 'Semester 3', isCore: true, prerequisites: ['MATH101', 'PHYS101'] },
      { courseCode: 'ENG301', courseName: 'Power Systems', credits: 5, semester: 'Semester 5', isCore: true, prerequisites: ['ENG201'] },
      { courseCode: 'ENG401', courseName: 'Renewable Energy', credits: 4, semester: 'Semester 7', isCore: false, prerequisites: ['ENG301'] }
    ],
    graduationRequirements: [
      'Complete minimum 180 credits',
      'Maintain GPA of 3.0 or higher',
      'Complete all core engineering courses',
      'Complete professional practice (12 weeks)',
      'Submit final year project',
      'Pass professional review'
    ],
    learningOutcomes: [
      'Design electrical power systems',
      'Analyze complex electrical circuits',
      'Implement renewable energy solutions',
      'Apply engineering ethics and standards'
    ],
    careerOutcomes: [
      'Electrical Engineer',
      'Power Systems Engineer',
      'Renewable Energy Consultant',
      'Project Engineer',
      'Design Engineer'
    ],
    accreditation: 'Engineers Australia (Provisional)'
  }
]

const departments = ['Business Studies', 'Information Technology', 'Engineering', 'Health Sciences', 'Agriculture']
const programs = [
  'Certificate in Business Studies',
  'Diploma in Information Technology',
  'Bachelor of Engineering (Electrical)',
  'Certificate in Community Health',
  'Diploma in Sustainable Agriculture'
]

export default function CurriculumPage() {
  // State management
  const [curricula, setCurricula] = useState<Curriculum[]>(initialCurricula)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state
  const [form, setForm] = useState({
    curriculumCode: '',
    curriculumName: '',
    description: '',
    department: '',
    program: '',
    level: 'Certificate' as const,
    totalCredits: 60,
    duration: '',
    status: 'Under Development' as const,
    effectiveDate: '',
    lastRevision: new Date().toISOString().split('T')[0],
    approvedBy: '',
    coreCredits: 45,
    electiveCredits: 15,
    courseRequirements: [] as CourseRequirement[],
    graduationRequirements: [] as string[],
    learningOutcomes: [] as string[],
    careerOutcomes: [] as string[],
    accreditation: ''
  })

  // Input states for array fields
  const [requirementInput, setRequirementInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')
  const [careerInput, setCareerInput] = useState('')

  // Calculated statistics
  const stats = {
    totalCurricula: curricula.length,
    activeCurricula: curricula.filter(c => c.status === 'Active').length,
    totalCredits: curricula.reduce((sum, c) => sum + c.totalCredits, 0),
    averageCredits: Math.round((curricula.reduce((sum, c) => sum + c.totalCredits, 0) / curricula.length) * 10) / 10,
    programsOffered: curricula.length
  }

  // CRUD Operations
  const handleAdd = () => {
    const newCurriculum: Curriculum = {
      id: Math.max(...curricula.map(c => c.id)) + 1,
      ...form
    }
    setCurricula([...curricula, newCurriculum])
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (curriculum: Curriculum) => {
    setEditingCurriculum(curriculum)
    setForm({
      curriculumCode: curriculum.curriculumCode,
      curriculumName: curriculum.curriculumName,
      description: curriculum.description,
      department: curriculum.department,
      program: curriculum.program,
      level: curriculum.level,
      totalCredits: curriculum.totalCredits,
      duration: curriculum.duration,
      status: curriculum.status,
      effectiveDate: curriculum.effectiveDate,
      lastRevision: curriculum.lastRevision,
      approvedBy: curriculum.approvedBy,
      coreCredits: curriculum.coreCredits,
      electiveCredits: curriculum.electiveCredits,
      courseRequirements: curriculum.courseRequirements,
      graduationRequirements: curriculum.graduationRequirements,
      learningOutcomes: curriculum.learningOutcomes,
      careerOutcomes: curriculum.careerOutcomes,
      accreditation: curriculum.accreditation
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingCurriculum) {
      setCurricula(curricula.map(c =>
        c.id === editingCurriculum.id ? { ...editingCurriculum, ...form } : c
      ))
      setEditingCurriculum(null)
      resetForm()
      setDialogOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this curriculum?')) {
      setCurricula(curricula.filter(c => c.id !== id))
    }
  }

  const resetForm = () => {
    setForm({
      curriculumCode: '',
      curriculumName: '',
      description: '',
      department: '',
      program: '',
      level: 'Certificate',
      totalCredits: 60,
      duration: '',
      status: 'Under Development',
      effectiveDate: '',
      lastRevision: new Date().toISOString().split('T')[0],
      approvedBy: '',
      coreCredits: 45,
      electiveCredits: 15,
      courseRequirements: [],
      graduationRequirements: [],
      learningOutcomes: [],
      careerOutcomes: [],
      accreditation: ''
    })
    setRequirementInput('')
    setOutcomeInput('')
    setCareerInput('')
  }

  // Array management functions
  const addRequirement = () => {
    if (requirementInput.trim() && !form.graduationRequirements.includes(requirementInput.trim())) {
      setForm({
        ...form,
        graduationRequirements: [...form.graduationRequirements, requirementInput.trim()]
      })
      setRequirementInput('')
    }
  }

  const removeRequirement = (requirement: string) => {
    setForm({
      ...form,
      graduationRequirements: form.graduationRequirements.filter(r => r !== requirement)
    })
  }

  const addOutcome = () => {
    if (outcomeInput.trim() && !form.learningOutcomes.includes(outcomeInput.trim())) {
      setForm({
        ...form,
        learningOutcomes: [...form.learningOutcomes, outcomeInput.trim()]
      })
      setOutcomeInput('')
    }
  }

  const removeOutcome = (outcome: string) => {
    setForm({
      ...form,
      learningOutcomes: form.learningOutcomes.filter(o => o !== outcome)
    })
  }

  const addCareer = () => {
    if (careerInput.trim() && !form.careerOutcomes.includes(careerInput.trim())) {
      setForm({
        ...form,
        careerOutcomes: [...form.careerOutcomes, careerInput.trim()]
      })
      setCareerInput('')
    }
  }

  const removeCareer = (career: string) => {
    setForm({
      ...form,
      careerOutcomes: form.careerOutcomes.filter(c => c !== career)
    })
  }

  // Filter functions
  const filteredCurricula = curricula.filter(curriculum => {
    const matchesSearch = curriculum.curriculumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curriculum.curriculumCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curriculum.program.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || curriculum.department === filterDepartment
    const matchesLevel = filterLevel === 'all' || curriculum.level === filterLevel
    const matchesStatus = filterStatus === 'all' || curriculum.status === filterStatus
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookMarked className="h-8 w-8" />
            Curriculum Management
          </h1>
          <p className="text-gray-600">
            Manage curriculum structures, course sequences, and degree requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Curricula
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCurriculum(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Curriculum
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCurriculum ? 'Edit Curriculum' : 'Add New Curriculum'}
                </DialogTitle>
                <DialogDescription>
                  {editingCurriculum ? 'Update the curriculum details' : 'Create a new curriculum structure'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="curriculumCode">Curriculum Code</Label>
                      <Input
                        id="curriculumCode"
                        value={form.curriculumCode}
                        onChange={(e) => setForm({...form, curriculumCode: e.target.value.toUpperCase()})}
                        placeholder="CURR-BUSI-CERT-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalCredits">Total Credits</Label>
                      <Input
                        id="totalCredits"
                        type="number"
                        value={form.totalCredits}
                        onChange={(e) => setForm({...form, totalCredits: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="curriculumName">Curriculum Name</Label>
                    <Input
                      id="curriculumName"
                      value={form.curriculumName}
                      onChange={(e) => setForm({...form, curriculumName: e.target.value})}
                      placeholder="Certificate in Business Studies"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Comprehensive curriculum description..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                      <Label htmlFor="level">Level</Label>
                      <Select value={form.level} onValueChange={(value: any) => setForm({...form, level: value})}>
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
                      <Label htmlFor="status">Status</Label>
                      <Select value={form.status} onValueChange={(value: any) => setForm({...form, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under Development">Under Development</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program">Program</Label>
                      <Select value={form.program} onValueChange={(value) => setForm({...form, program: value})}>
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
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={form.duration}
                        onChange={(e) => setForm({...form, duration: e.target.value})}
                        placeholder="1 Year, 2 Years, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coreCredits">Core Credits</Label>
                      <Input
                        id="coreCredits"
                        type="number"
                        value={form.coreCredits}
                        onChange={(e) => setForm({...form, coreCredits: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="electiveCredits">Elective Credits</Label>
                      <Input
                        id="electiveCredits"
                        type="number"
                        value={form.electiveCredits}
                        onChange={(e) => setForm({...form, electiveCredits: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={form.effectiveDate}
                        onChange={(e) => setForm({...form, effectiveDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="approvedBy">Approved By</Label>
                      <Input
                        id="approvedBy"
                        value={form.approvedBy}
                        onChange={(e) => setForm({...form, approvedBy: e.target.value})}
                        placeholder="Academic Board"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accreditation">Accreditation</Label>
                      <Input
                        id="accreditation"
                        value={form.accreditation}
                        onChange={(e) => setForm({...form, accreditation: e.target.value})}
                        placeholder="PNG Qualifications Authority"
                      />
                    </div>
                  </div>
                </div>

                {/* Graduation Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Graduation Requirements</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      placeholder="Enter graduation requirement..."
                      onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    />
                    <Button type="button" onClick={addRequirement} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.graduationRequirements.map((requirement, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {requirement}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeRequirement(requirement)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learning Outcomes</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={outcomeInput}
                      onChange={(e) => setOutcomeInput(e.target.value)}
                      placeholder="Enter learning outcome..."
                      onKeyPress={(e) => e.key === 'Enter' && addOutcome()}
                    />
                    <Button type="button" onClick={addOutcome} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.learningOutcomes.map((outcome, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {outcome}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeOutcome(outcome)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Career Outcomes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Career Outcomes</h3>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={careerInput}
                      onChange={(e) => setCareerInput(e.target.value)}
                      placeholder="Enter career outcome..."
                      onKeyPress={(e) => e.key === 'Enter' && addCareer()}
                    />
                    <Button type="button" onClick={addCareer} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.careerOutcomes.map((career, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {career}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCareer(career)}
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
                <Button onClick={editingCurriculum ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingCurriculum ? 'Update' : 'Create'}
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
              <BookMarked className="h-4 w-4 text-blue-600" />
              Total Curricula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCurricula}</div>
            <p className="text-xs text-muted-foreground">Curriculum structures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Active Curricula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCurricula}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              Programs Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.programsOffered}</div>
            <p className="text-xs text-muted-foreground">Academic programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-600" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalCredits}</div>
            <p className="text-xs text-muted-foreground">Credit hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600" />
              Avg Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.averageCredits}</div>
            <p className="text-xs text-muted-foreground">Per curriculum</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Curriculum Directory</CardTitle>
              <CardDescription>Browse and manage curriculum structures</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search curricula..."
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
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Development">Under Development</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCurricula.map((curriculum) => (
              <div key={curriculum.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{curriculum.curriculumName}</h3>
                      <Badge variant="outline" className="bg-gray-50 font-mono text-xs">{curriculum.curriculumCode}</Badge>
                      <Badge variant={curriculum.level === 'Certificate' ? 'default' :
                                   curriculum.level === 'Diploma' ? 'secondary' :
                                   curriculum.level === 'Degree' ? 'outline' : 'destructive'}>
                        {curriculum.level}
                      </Badge>
                      <Badge variant={curriculum.status === 'Active' ? 'default' :
                                   curriculum.status === 'Under Development' ? 'secondary' :
                                   curriculum.status === 'Under Review' ? 'outline' : 'destructive'}>
                        {curriculum.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{curriculum.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{curriculum.department}</p>
                          <p className="text-gray-500">Department</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{curriculum.program}</p>
                          <p className="text-gray-500">Program</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{curriculum.duration}</p>
                          <p className="text-gray-500">Duration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{curriculum.totalCredits} Credits</p>
                          <p className="text-gray-500">Total Required</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-4">
                      <div>
                        <p className="font-medium text-gray-900">{curriculum.coreCredits}</p>
                        <p className="text-gray-500">Core Credits</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{curriculum.electiveCredits}</p>
                        <p className="text-gray-500">Elective Credits</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{curriculum.courseRequirements.length}</p>
                        <p className="text-gray-500">Course Requirements</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{curriculum.accreditation}</p>
                        <p className="text-gray-500">Accreditation</p>
                      </div>
                    </div>

                    {curriculum.careerOutcomes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Career Outcomes:</p>
                        <div className="flex flex-wrap gap-2">
                          {curriculum.careerOutcomes.slice(0, 4).map((career, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {career}
                            </Badge>
                          ))}
                          {curriculum.careerOutcomes.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{curriculum.careerOutcomes.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => {}}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(curriculum)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(curriculum.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCurricula.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No curricula found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
