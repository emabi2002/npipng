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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Save,
  RefreshCw,
  Settings,
  BarChart3,
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Calendar,
  ClipboardList,
  Target
} from "lucide-react"

import { BulkDataManager, ImportResult } from "@/lib/import-export"
import {
  departmentsDB,
  programsDB,
  coursesDB,
  curriculumDB,
  scheduleDB,
  examinationDB,
  gradingDB,
  calendarDB
} from "@/lib/database"

interface DataStats {
  moduleName: string
  displayName: string
  count: number
  icon: any
  description: string
}

export default function DataManagementPage() {
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json')
  const [importData, setImportData] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Get current data statistics
  const getDataStats = (): DataStats[] => {
    return [
      {
        moduleName: 'departments',
        displayName: 'Departments',
        count: departmentsDB.count(),
        icon: Building2,
        description: 'Academic departments and organizational structure'
      },
      {
        moduleName: 'programs',
        displayName: 'Programs',
        count: programsDB.count(),
        icon: GraduationCap,
        description: 'Academic programs and qualifications'
      },
      {
        moduleName: 'courses',
        displayName: 'Courses',
        count: coursesDB.count(),
        icon: BookOpen,
        description: 'Course catalog and curriculum'
      },
      {
        moduleName: 'curriculum',
        displayName: 'Curriculum',
        count: curriculumDB.count(),
        icon: ClipboardList,
        description: 'Curriculum requirements and structures'
      },
      {
        moduleName: 'schedule',
        displayName: 'Schedules',
        count: scheduleDB.count(),
        icon: Calendar,
        description: 'Class schedules and timetables'
      },
      {
        moduleName: 'examination',
        displayName: 'Examinations',
        count: examinationDB.count(),
        icon: Target,
        description: 'Examination schedules and venues'
      },
      {
        moduleName: 'grading',
        displayName: 'Grading',
        count: gradingDB.count(),
        icon: BarChart3,
        description: 'Student grades and assessments'
      },
      {
        moduleName: 'calendar',
        displayName: 'Calendar',
        count: calendarDB.count(),
        icon: Calendar,
        description: 'Academic calendar and events'
      }
    ]
  }

  const dataStats = getDataStats()
  const totalRecords = dataStats.reduce((sum, stat) => sum + stat.count, 0)

  // Export functions
  const handleExportAll = () => {
    try {
      const jsonData = BulkDataManager.exportAllDataAsJSON()
      BulkDataManager.downloadFile(
        jsonData,
        `npipng-complete-export-${new Date().toISOString().split('T')[0]}.json`,
        'application/json'
      )
    } catch (error) {
      alert(`Export failed: ${error}`)
    }
  }

  const handleExportModule = (moduleName: string, format: 'json' | 'csv') => {
    try {
      if (format === 'csv') {
        const csvData = BulkDataManager.exportModuleAsCSV(moduleName as any)
        BulkDataManager.downloadFile(
          csvData,
          `${moduleName}-export-${new Date().toISOString().split('T')[0]}.csv`,
          'text/csv'
        )
      } else {
        // For JSON, export just this module
        const allData = JSON.parse(BulkDataManager.exportAllDataAsJSON())
        const moduleData = { [moduleName]: allData[moduleName] }
        BulkDataManager.downloadFile(
          JSON.stringify(moduleData, null, 2),
          `${moduleName}-export-${new Date().toISOString().split('T')[0]}.json`,
          'application/json'
        )
      }
    } catch (error) {
      alert(`Export failed: ${error}`)
    }
  }

  const handleCreateBackup = () => {
    try {
      const filename = BulkDataManager.createBackup()
      alert(`Backup created successfully: ${filename}`)
    } catch (error) {
      alert(`Backup failed: ${error}`)
    }
  }

  // Import functions
  const handleImport = async () => {
    if (!importData.trim()) {
      alert('Please provide data to import')
      return
    }

    setIsProcessing(true)
    setImportProgress(0)

    try {
      let result: ImportResult

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      if (importFormat === 'json') {
        if (selectedModule === 'all') {
          result = await BulkDataManager.importFromJSON(importData)
        } else {
          // Extract module data from JSON
          const fullData = JSON.parse(importData)
          const moduleData = fullData[selectedModule]
          if (moduleData) {
            const singleModuleData = JSON.stringify({ [selectedModule]: moduleData })
            result = await BulkDataManager.importFromJSON(singleModuleData)
          } else {
            throw new Error(`No data found for module: ${selectedModule}`)
          }
        }
      } else {
        if (selectedModule === 'all') {
          throw new Error('CSV import requires selecting a specific module')
        }
        result = await BulkDataManager.importModuleFromCSV(importData, selectedModule as any)
      }

      clearInterval(progressInterval)
      setImportProgress(100)
      setImportResult(result)

      if (result.success) {
        setTimeout(() => {
          setImportDialogOpen(false)
          setImportData('')
          setImportProgress(0)
          setImportResult(null)
          window.location.reload() // Refresh to show new data
        }, 2000)
      }
    } catch (error) {
      setImportProgress(0)
      setImportResult({
        success: false,
        message: `Import failed: ${error}`,
        importedCounts: {
          departments: 0,
          programs: 0,
          courses: 0,
          curriculum: 0,
          schedule: 0,
          examination: 0,
          grading: 0,
          calendar: 0
        },
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)

      // Auto-detect format based on file extension
      if (file.name.endsWith('.csv')) {
        setImportFormat('csv')
      } else if (file.name.endsWith('.json')) {
        setImportFormat('json')
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone. It is recommended to create a backup first.')) {
      if (confirm('This will permanently delete all departments, programs, courses, and other academic data. Are you absolutely sure?')) {
        BulkDataManager.clearAllData()
        window.location.reload()
      }
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-8 w-8" />
            Data Management
          </h1>
          <p className="text-gray-600">
            Import, export, and manage academic data across all modules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateBackup}>
            <Shield className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export Academic Data</DialogTitle>
                <DialogDescription>
                  Choose the data you want to export and the format
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleExportAll} className="h-20 flex-col">
                    <FileJson className="h-6 w-6 mb-2" />
                    Export All Data (JSON)
                  </Button>
                  <Button variant="outline" onClick={() => handleExportModule('departments', 'csv')} className="h-20 flex-col">
                    <FileSpreadsheet className="h-6 w-6 mb-2" />
                    Export Individual Module
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {dataStats.map((stat) => (
                    <div key={stat.moduleName} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <stat.icon className="h-4 w-4" />
                        <span className="text-sm">{stat.displayName}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleExportModule(stat.moduleName, 'json')}>
                          JSON
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleExportModule(stat.moduleName, 'csv')}>
                          CSV
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Academic Data</DialogTitle>
                <DialogDescription>
                  Upload data from JSON or CSV files to populate the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Import will add new records to existing data.
                    Create a backup before importing if you want to preserve current state.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="module">Select Module</Label>
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules (JSON only)</SelectItem>
                        {dataStats.map((stat) => (
                          <SelectItem key={stat.moduleName} value={stat.moduleName}>
                            {stat.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="format">Format</Label>
                    <Select value={importFormat} onValueChange={(value: 'json' | 'csv') => setImportFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON Format</SelectItem>
                        <SelectItem value="csv">CSV Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept={importFormat === 'json' ? '.json' : '.csv'}
                    onChange={handleFileUpload}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Or paste data directly in the text area below
                  </p>
                </div>

                <div>
                  <Label htmlFor="importData">Data ({importFormat.toUpperCase()})</Label>
                  <Textarea
                    id="importData"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder={`Paste your ${importFormat.toUpperCase()} data here...`}
                    rows={10}
                    className="font-mono text-xs"
                  />
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Importing data...</span>
                      <span className="text-sm">{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                {importResult && (
                  <Alert className={importResult.success ? "border-green-500" : "border-red-500"}>
                    {importResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    <AlertDescription>
                      <div className="space-y-2">
                        <p><strong>{importResult.message}</strong></p>
                        {Object.entries(importResult.importedCounts).map(([module, count]) =>
                          count > 0 && (
                            <p key={module} className="text-sm">
                              {module}: {count} records imported
                            </p>
                          )
                        )}
                        {importResult.errors.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Errors:</p>
                            <ul className="text-xs list-disc list-inside">
                              {importResult.errors.slice(0, 5).map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                              {importResult.errors.length > 5 && (
                                <li>... and {importResult.errors.length - 5} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!importData.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current Data Overview
          </CardTitle>
          <CardDescription>
            Summary of all academic data currently stored in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {dataStats.map((stat) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.moduleName}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{stat.count}</p>
                        <p className="text-sm font-medium">{stat.displayName}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Total Records</h3>
                <p className="text-sm text-blue-700">Complete academic database</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">{totalRecords}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Advanced Operations
          </CardTitle>
          <CardDescription>
            Dangerous operations that affect all data - use with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These operations are irreversible. Always create a backup before proceeding.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button variant="outline" className="border-red-500 text-red-600" onClick={handleClearAllData}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Application
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
