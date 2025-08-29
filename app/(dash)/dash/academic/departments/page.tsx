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
  Building2,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  GraduationCap,
  BookOpen,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Save,
  X,
  Database
} from "lucide-react"

// Import database utility
import { departmentsDB, DatabaseRecord } from "@/lib/database"

// Types
interface Department extends DatabaseRecord {
  name: string
  code: string
  description: string
  head: string
  headContact: string
  headEmail: string
  location: string
  establishedYear: number
  status: 'Active' | 'Inactive' | 'Under Review'
  totalStaff: number
  totalPrograms: number
  totalStudents: number
  budget: number
}

// Initial data to seed the database
const initialDepartments: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Business Studies',
    code: 'BUSI',
    description: 'Department for business administration, accounting, and entrepreneurship programs',
    head: 'Dr. James Kila',
    headContact: '+675-325-1234',
    headEmail: 'j.kila@npipng.ac.pg',
    location: 'Building A, Level 1',
    establishedYear: 2010,
    status: 'Active',
    totalStaff: 12,
    totalPrograms: 8,
    totalStudents: 245,
    budget: 180000
  },
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'Department specializing in computer science, software development, and IT systems',
    head: 'Ms. Sarah Temu',
    headContact: '+675-325-1235',
    headEmail: 's.temu@npipng.ac.pg',
    location: 'IT Building, Level 3',
    establishedYear: 2008,
    status: 'Active',
    totalStaff: 15,
    totalPrograms: 6,
    totalStudents: 189,
    budget: 220000
  },
  {
    name: 'Engineering',
    code: 'ENGR',
    description: 'Department for electrical, mechanical, and civil engineering programs',
    head: 'Eng. Peter Namaliu',
    headContact: '+675-325-1236',
    headEmail: 'p.namaliu@npipng.ac.pg',
    location: 'Engineering Complex',
    establishedYear: 2012,
    status: 'Active',
    totalStaff: 18,
    totalPrograms: 5,
    totalStudents: 134,
    budget: 350000
  },
  {
    name: 'Health Sciences',
    code: 'HLTH',
    description: 'Department for health-related programs including nursing and community health',
    head: 'Dr. Mary Temu',
    headContact: '+675-325-1237',
    headEmail: 'm.temu@npipng.ac.pg',
    location: 'Health Building',
    establishedYear: 2015,
    status: 'Active',
    totalStaff: 10,
    totalPrograms: 4,
    totalStudents: 156,
    budget: 195000
  },
  {
    name: 'Agriculture',
    code: 'AGRI',
    description: 'Department focusing on agricultural practices and rural development',
    head: 'Mr. John Wambi',
    headContact: '+675-325-1238',
    headEmail: 'j.wambi@npipng.ac.pg',
    location: 'Agriculture Campus',
    establishedYear: 2011,
    status: 'Under Review',
    totalStaff: 8,
    totalPrograms: 5,
    totalStudents: 89,
    budget: 145000
  }
]

export default function DepartmentsPage() {
  // State management
  const [departments, setDepartments] = useState<Department[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    headContact: '',
    headEmail: '',
    location: '',
    establishedYear: new Date().getFullYear(),
    status: 'Active' as const,
    totalStaff: 0,
    totalPrograms: 0,
    totalStudents: 0,
    budget: 0
  })

  // Load data from database
  useEffect(() => {
    const loadDepartments = () => {
      try {
        const savedDepartments = departmentsDB.getAll()

        // If no data exists, initialize with default data
        if (savedDepartments.length === 0) {
          const defaultDepartments = initialDepartments.map(dept =>
            departmentsDB.create(dept)
          )
          setDepartments(defaultDepartments)
        } else {
          setDepartments(savedDepartments)
        }
      } catch (error) {
        console.error('Error loading departments:', error)
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    loadDepartments()
  }, [])

  // Calculated statistics
  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(d => d.status === 'Active').length,
    totalStaff: departments.reduce((sum, d) => sum + d.totalStaff, 0),
    totalStudents: departments.reduce((sum, d) => sum + d.totalStudents, 0),
    totalBudget: departments.reduce((sum, d) => sum + d.budget, 0)
  }

  // CRUD Operations with database persistence
  const handleAdd = () => {
    try {
      const newDepartment = departmentsDB.create(form)
      setDepartments([...departments, newDepartment])
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error creating department:', error)
      alert('Error creating department. Please try again.')
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setForm({
      name: department.name,
      code: department.code,
      description: department.description,
      head: department.head,
      headContact: department.headContact,
      headEmail: department.headEmail,
      location: department.location,
      establishedYear: department.establishedYear,
      status: department.status,
      totalStaff: department.totalStaff,
      totalPrograms: department.totalPrograms,
      totalStudents: department.totalStudents,
      budget: department.budget
    })
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingDepartment) {
      try {
        const updatedDepartment = departmentsDB.update(editingDepartment.id, form)
        if (updatedDepartment) {
          setDepartments(departments.map(d =>
            d.id === editingDepartment.id ? updatedDepartment : d
          ))
          setEditingDepartment(null)
          resetForm()
          setDialogOpen(false)
        }
      } catch (error) {
        console.error('Error updating department:', error)
        alert('Error updating department. Please try again.')
      }
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        const success = departmentsDB.delete(id)
        if (success) {
          setDepartments(departments.filter(d => d.id !== id))
        }
      } catch (error) {
        console.error('Error deleting department:', error)
        alert('Error deleting department. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      description: '',
      head: '',
      headContact: '',
      headEmail: '',
      location: '',
      establishedYear: new Date().getFullYear(),
      status: 'Active',
      totalStaff: 0,
      totalPrograms: 0,
      totalStudents: 0,
      budget: 0
    })
    setEditingDepartment(null)
  }

  // Export data function
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(departments, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `departments_export_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error exporting data. Please try again.')
    }
  }

  // Filter functions
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.head.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || department.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading departments...</p>
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
            <Building2 className="h-8 w-8" />
            Department Management
          </h1>
          <p className="text-gray-600">
            Manage academic departments and organizational structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Departments
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDepartment ? 'Edit Department' : 'Add New Department'}
                </DialogTitle>
                <DialogDescription>
                  {editingDepartment ? 'Update the department details' : 'Create a new academic department'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Business Studies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Department Code</Label>
                    <Input
                      id="code"
                      value={form.code}
                      onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                      placeholder="BUSI"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Department description and focus areas..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="head">Department Head</Label>
                    <Input
                      id="head"
                      value={form.head}
                      onChange={(e) => setForm({...form, head: e.target.value})}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headContact">Head Contact</Label>
                    <Input
                      id="headContact"
                      value={form.headContact}
                      onChange={(e) => setForm({...form, headContact: e.target.value})}
                      placeholder="+675-325-1234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headEmail">Head Email</Label>
                    <Input
                      id="headEmail"
                      type="email"
                      value={form.headEmail}
                      onChange={(e) => setForm({...form, headEmail: e.target.value})}
                      placeholder="head@npipng.ac.pg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm({...form, location: e.target.value})}
                      placeholder="Building A, Level 2"
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
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(value: 'Active' | 'Inactive' | 'Under Review') => setForm({...form, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalStaff">Total Staff</Label>
                    <Input
                      id="totalStaff"
                      type="number"
                      value={form.totalStaff}
                      onChange={(e) => setForm({...form, totalStaff: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPrograms">Total Programs</Label>
                    <Input
                      id="totalPrograms"
                      type="number"
                      value={form.totalPrograms}
                      onChange={(e) => setForm({...form, totalPrograms: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalStudents">Total Students</Label>
                    <Input
                      id="totalStudents"
                      type="number"
                      value={form.totalStudents}
                      onChange={(e) => setForm({...form, totalStudents: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Annual Budget (PGK)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({...form, budget: parseInt(e.target.value) || 0})}
                    />
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
                <Button onClick={editingDepartment ? handleUpdate : handleAdd}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingDepartment ? 'Update' : 'Create'}
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
              <Building2 className="h-4 w-4 text-blue-600" />
              Total Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              Active Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeDepartments}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="text-indigo-600">K</span>
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">K{(stats.totalBudget / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">Annual allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Department Directory</CardTitle>
              <CardDescription>Browse and manage academic departments</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDepartments.map((department) => (
              <div key={department.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{department.name}</h3>
                      <Badge variant="outline" className="bg-gray-50">{department.code}</Badge>
                      <Badge variant={department.status === 'Active' ? 'default' :
                                   department.status === 'Under Review' ? 'secondary' : 'outline'}>
                        {department.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{department.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{department.head}</p>
                          <p className="text-gray-500">Department Head</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{department.headContact}</p>
                          <p className="text-gray-500">Contact</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{department.headEmail}</p>
                          <p className="text-gray-500">Email</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{department.location}</p>
                          <p className="text-gray-500">Location</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{department.establishedYear}</p>
                        <p className="text-gray-500">Established</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{department.totalStaff}</p>
                        <p className="text-gray-500">Staff Members</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{department.totalPrograms}</p>
                        <p className="text-gray-500">Programs</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{department.totalStudents}</p>
                        <p className="text-gray-500">Students</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">K{(department.budget / 1000).toFixed(0)}k</p>
                        <p className="text-gray-500">Annual Budget</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(department.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDepartments.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No departments found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
