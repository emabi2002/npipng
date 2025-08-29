// Bulk Import/Export System for NPIPNG Academic Management
import { departmentsDB, programsDB, coursesDB, exportData, importData } from './database'

export interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  duplicates: number
}

export interface ExportData {
  departments: any[]
  programs: any[]
  courses: any[]
  metadata: {
    exportDate: string
    version: string
    totalRecords: number
  }
}

// Validation schemas
const validateDepartment = (dept: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!dept.name || typeof dept.name !== 'string') {
    errors.push('Department name is required')
  }
  if (!dept.code || typeof dept.code !== 'string') {
    errors.push('Department code is required')
  }
  if (dept.code && dept.code.length > 10) {
    errors.push('Department code must be 10 characters or less')
  }
  if (dept.establishedYear && (dept.establishedYear < 1900 || dept.establishedYear > new Date().getFullYear())) {
    errors.push('Invalid established year')
  }
  if (dept.status && !['Active', 'Inactive', 'Under Review'].includes(dept.status)) {
    errors.push('Invalid status - must be Active, Inactive, or Under Review')
  }

  return { valid: errors.length === 0, errors }
}

const validateProgram = (program: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!program.name || typeof program.name !== 'string') {
    errors.push('Program name is required')
  }
  if (!program.code || typeof program.code !== 'string') {
    errors.push('Program code is required')
  }
  if (!program.type || !['Certificate', 'Diploma', 'Advanced Diploma', 'Associate Degree'].includes(program.type)) {
    errors.push('Invalid program type')
  }
  if (!program.level || !['Foundation', 'Intermediate', 'Advanced'].includes(program.level)) {
    errors.push('Invalid program level')
  }
  if (program.duration && (program.duration < 1 || program.duration > 8)) {
    errors.push('Duration must be between 1 and 8 semesters')
  }

  return { valid: errors.length === 0, errors }
}

const validateCourse = (course: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!course.courseCode || typeof course.courseCode !== 'string') {
    errors.push('Course code is required')
  }
  if (!course.courseName || typeof course.courseName !== 'string') {
    errors.push('Course name is required')
  }
  if (course.creditHours && (course.creditHours < 1 || course.creditHours > 10)) {
    errors.push('Credit hours must be between 1 and 10')
  }
  if (course.maxCapacity && (course.maxCapacity < 1 || course.maxCapacity > 500)) {
    errors.push('Max capacity must be between 1 and 500')
  }

  return { valid: errors.length === 0, errors }
}

// Export functions
export class DataExporter {
  static async exportAllData(): Promise<string> {
    try {
      const exportData: ExportData = {
        departments: departmentsDB.getAll(),
        programs: programsDB.getAll(),
        courses: coursesDB.getAll(),
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          totalRecords: 0
        }
      }

      exportData.metadata.totalRecords =
        exportData.departments.length +
        exportData.programs.length +
        exportData.courses.length

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async exportToFile(filename?: string) {
    try {
      const data = await this.exportAllData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename || `npipng_data_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Export to file failed:', error)
      return false
    }
  }

  static exportDepartmentsToCSV(): string {
    const departments = departmentsDB.getAll()
    const headers = [
      'ID', 'Name', 'Code', 'Description', 'Head', 'Head Contact', 'Head Email',
      'Location', 'Established Year', 'Status', 'Total Staff', 'Total Programs',
      'Total Students', 'Budget', 'Created At', 'Updated At'
    ]

    const csvContent = [
      headers.join(','),
      ...departments.map(dept => [
        dept.id,
        `"${dept.name}"`,
        `"${dept.code}"`,
        `"${dept.description}"`,
        `"${dept.head}"`,
        `"${dept.headContact}"`,
        `"${dept.headEmail}"`,
        `"${dept.location}"`,
        dept.establishedYear,
        `"${dept.status}"`,
        dept.totalStaff,
        dept.totalPrograms,
        dept.totalStudents,
        dept.budget,
        `"${dept.createdAt}"`,
        `"${dept.updatedAt}"`
      ].join(','))
    ].join('\n')

    return csvContent
  }

  static async exportCSVToFile(type: 'departments' | 'programs' | 'courses') {
    try {
      let csvContent = ''
      let filename = ''

      switch (type) {
        case 'departments':
          csvContent = this.exportDepartmentsToCSV()
          filename = `departments_${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'programs':
          csvContent = this.exportProgramsToCSV()
          filename = `programs_${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'courses':
          csvContent = this.exportCoursesToCSV()
          filename = `courses_${new Date().toISOString().split('T')[0]}.csv`
          break
      }

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('CSV export failed:', error)
      return false
    }
  }

  static exportProgramsToCSV(): string {
    const programs = programsDB.getAll()
    const headers = [
      'ID', 'Name', 'Code', 'Type', 'Level', 'Department', 'Description',
      'Duration', 'Credits', 'Coordinator', 'Status', 'Total Students', 'Capacity'
    ]

    const csvContent = [
      headers.join(','),
      ...programs.map(program => [
        program.id,
        `"${program.name}"`,
        `"${program.code}"`,
        `"${program.type}"`,
        `"${program.level}"`,
        `"${program.department}"`,
        `"${program.description}"`,
        program.duration,
        program.credits,
        `"${program.coordinator}"`,
        `"${program.status}"`,
        program.totalStudents || 0,
        program.capacity || 0
      ].join(','))
    ].join('\n')

    return csvContent
  }

  static exportCoursesToCSV(): string {
    const courses = coursesDB.getAll()
    const headers = [
      'ID', 'Course Code', 'Course Name', 'Description', 'Credit Hours',
      'Department', 'Level', 'Semester', 'Instructor', 'Status', 'Max Capacity'
    ]

    const csvContent = [
      headers.join(','),
      ...courses.map(course => [
        course.id,
        `"${course.courseCode}"`,
        `"${course.courseName}"`,
        `"${course.description}"`,
        course.creditHours,
        `"${course.department}"`,
        `"${course.level}"`,
        `"${course.semester}"`,
        `"${course.instructor}"`,
        `"${course.status}"`,
        course.maxCapacity
      ].join(','))
    ].join('\n')

    return csvContent
  }
}

// Import functions
export class DataImporter {
  static async importFromJSON(jsonString: string): Promise<ImportResult> {
    try {
      const data = JSON.parse(jsonString)
      let totalImported = 0
      const errors: string[] = []
      let duplicates = 0

      // Import departments
      if (data.departments && Array.isArray(data.departments)) {
        for (const dept of data.departments) {
          const validation = validateDepartment(dept)
          if (!validation.valid) {
            errors.push(`Department ${dept.name || 'unknown'}: ${validation.errors.join(', ')}`)
            continue
          }

          // Check for duplicates
          const existing = departmentsDB.getAll().find(d => d.code === dept.code)
          if (existing) {
            duplicates++
            continue
          }

          try {
            const { id, createdAt, updatedAt, ...departmentData } = dept
            departmentsDB.create(departmentData)
            totalImported++
          } catch (error) {
            errors.push(`Department ${dept.name}: Failed to import - ${error}`)
          }
        }
      }

      // Import programs
      if (data.programs && Array.isArray(data.programs)) {
        for (const program of data.programs) {
          const validation = validateProgram(program)
          if (!validation.valid) {
            errors.push(`Program ${program.name || 'unknown'}: ${validation.errors.join(', ')}`)
            continue
          }

          // Check for duplicates
          const existing = programsDB.getAll().find(p => p.code === program.code)
          if (existing) {
            duplicates++
            continue
          }

          try {
            const { id, createdAt, updatedAt, ...programData } = program
            programsDB.create(programData)
            totalImported++
          } catch (error) {
            errors.push(`Program ${program.name}: Failed to import - ${error}`)
          }
        }
      }

      // Import courses
      if (data.courses && Array.isArray(data.courses)) {
        for (const course of data.courses) {
          const validation = validateCourse(course)
          if (!validation.valid) {
            errors.push(`Course ${course.courseName || 'unknown'}: ${validation.errors.join(', ')}`)
            continue
          }

          // Check for duplicates
          const existing = coursesDB.getAll().find(c => c.courseCode === course.courseCode)
          if (existing) {
            duplicates++
            continue
          }

          try {
            const { id, createdAt, updatedAt, ...courseData } = course
            coursesDB.create(courseData)
            totalImported++
          } catch (error) {
            errors.push(`Course ${course.courseName}: Failed to import - ${error}`)
          }
        }
      }

      return {
        success: errors.length === 0,
        imported: totalImported,
        errors,
        duplicates
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: [`JSON parsing failed: ${error instanceof Error ? error.message : 'Invalid JSON'}`],
        duplicates: 0
      }
    }
  }

  static async importFromFile(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          if (file.name.endsWith('.json')) {
            const result = await this.importFromJSON(content)
            resolve(result)
          } else if (file.name.endsWith('.csv')) {
            const result = await this.importFromCSV(content, this.detectCSVType(file.name))
            resolve(result)
          } else {
            reject(new Error('Unsupported file format. Please use JSON or CSV files.'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  static detectCSVType(filename: string): 'departments' | 'programs' | 'courses' {
    const name = filename.toLowerCase()
    if (name.includes('program')) return 'programs'
    if (name.includes('course')) return 'courses'
    return 'departments' // default
  }

  static async importFromCSV(csvContent: string, type: 'departments' | 'programs' | 'courses'): Promise<ImportResult> {
    try {
      const lines = csvContent.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const dataLines = lines.slice(1).filter(line => line.trim().length > 0)

      let totalImported = 0
      const errors: string[] = []
      let duplicates = 0

      for (let i = 0; i < dataLines.length; i++) {
        try {
          const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const rowData: any = {}

          headers.forEach((header, index) => {
            if (values[index] !== undefined) {
              rowData[header.toLowerCase().replace(/ /g, '_')] = values[index]
            }
          })

          // Convert to appropriate format based on type
          let convertedData
          switch (type) {
            case 'departments':
              convertedData = this.convertCSVToDepartment(rowData)
              break
            case 'programs':
              convertedData = this.convertCSVToProgram(rowData)
              break
            case 'courses':
              convertedData = this.convertCSVToCourse(rowData)
              break
          }

          if (convertedData) {
            // Validate and import
            let validation
            switch (type) {
              case 'departments':
                validation = validateDepartment(convertedData)
                if (validation.valid) {
                  const existing = departmentsDB.getAll().find(d => d.code === convertedData.code)
                  if (existing) {
                    duplicates++
                  } else {
                    departmentsDB.create(convertedData)
                    totalImported++
                  }
                } else {
                  errors.push(`Row ${i + 2}: ${validation.errors.join(', ')}`)
                }
                break
              case 'programs':
                validation = validateProgram(convertedData)
                if (validation.valid) {
                  const existing = programsDB.getAll().find(p => p.code === convertedData.code)
                  if (existing) {
                    duplicates++
                  } else {
                    programsDB.create(convertedData)
                    totalImported++
                  }
                } else {
                  errors.push(`Row ${i + 2}: ${validation.errors.join(', ')}`)
                }
                break
              case 'courses':
                validation = validateCourse(convertedData)
                if (validation.valid) {
                  const existing = coursesDB.getAll().find(c => c.courseCode === convertedData.courseCode)
                  if (existing) {
                    duplicates++
                  } else {
                    coursesDB.create(convertedData)
                    totalImported++
                  }
                } else {
                  errors.push(`Row ${i + 2}: ${validation.errors.join(', ')}`)
                }
                break
            }
          }
        } catch (error) {
          errors.push(`Row ${i + 2}: Failed to process - ${error}`)
        }
      }

      return {
        success: errors.length === 0,
        imported: totalImported,
        errors,
        duplicates
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: [`CSV parsing failed: ${error instanceof Error ? error.message : 'Invalid CSV'}`],
        duplicates: 0
      }
    }
  }

  private static convertCSVToDepartment(csvRow: any) {
    return {
      name: csvRow.name || '',
      code: csvRow.code || '',
      description: csvRow.description || '',
      head: csvRow.head || '',
      headContact: csvRow.head_contact || '',
      headEmail: csvRow.head_email || '',
      location: csvRow.location || '',
      establishedYear: parseInt(csvRow.established_year) || new Date().getFullYear(),
      status: csvRow.status || 'Active',
      totalStaff: parseInt(csvRow.total_staff) || 0,
      totalPrograms: parseInt(csvRow.total_programs) || 0,
      totalStudents: parseInt(csvRow.total_students) || 0,
      budget: parseFloat(csvRow.budget) || 0
    }
  }

  private static convertCSVToProgram(csvRow: any) {
    return {
      name: csvRow.name || '',
      code: csvRow.code || '',
      type: csvRow.type || 'Certificate',
      level: csvRow.level || 'Foundation',
      department: csvRow.department || '',
      description: csvRow.description || '',
      duration: parseInt(csvRow.duration) || 2,
      credits: parseInt(csvRow.credits) || 60,
      coordinator: csvRow.coordinator || '',
      status: csvRow.status || 'Active',
      totalStudents: parseInt(csvRow.total_students) || 0,
      capacity: parseInt(csvRow.capacity) || 30
    }
  }

  private static convertCSVToCourse(csvRow: any) {
    return {
      courseCode: csvRow.course_code || '',
      courseName: csvRow.course_name || '',
      description: csvRow.description || '',
      creditHours: parseInt(csvRow.credit_hours) || 3,
      department: csvRow.department || '',
      level: csvRow.level || 'Certificate',
      semester: csvRow.semester || 'Semester 1',
      instructor: csvRow.instructor || '',
      status: csvRow.status || 'Active',
      maxCapacity: parseInt(csvRow.max_capacity) || 30
    }
  }
}

// Utility functions
export const downloadTemplate = (type: 'departments' | 'programs' | 'courses') => {
  let template = ''
  let filename = ''

  switch (type) {
    case 'departments':
      template = 'Name,Code,Description,Head,Head Contact,Head Email,Location,Established Year,Status,Total Staff,Total Programs,Total Students,Budget\n'
      template += '"Business Studies","BUSI","Department for business programs","Dr. John Smith","+675-325-1234","j.smith@npipng.ac.pg","Building A",2010,"Active",12,8,245,180000'
      filename = 'departments_template.csv'
      break
    case 'programs':
      template = 'Name,Code,Type,Level,Department,Description,Duration,Credits,Coordinator,Status,Total Students,Capacity\n'
      template += '"Diploma in Business","DBA","Diploma","Intermediate","Business Studies","Business administration program",4,120,"Ms. Jane Doe","Active",50,60'
      filename = 'programs_template.csv'
      break
    case 'courses':
      template = 'Course Code,Course Name,Description,Credit Hours,Department,Level,Semester,Instructor,Status,Max Capacity\n'
      template += '"BUS101","Introduction to Business","Basic business concepts",3,"Business Studies","Certificate","Semester 1","Dr. Smith","Active",30'
      filename = 'courses_template.csv'
      break
  }

  const blob = new Blob([template], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
