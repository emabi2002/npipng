// Bulk Data Import/Export System for NPIPNG Academic Management

import { departmentsDB, programsDB, coursesDB } from './database'

// CSV parsing utilities
export const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n')
  return lines.map(line => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }).filter(row => row.some(cell => cell.length > 0))
}

// CSV generation utilities
export const generateCSV = (data: any[], headers: string[]): string => {
  const csvRows = []
  csvRows.push(headers.join(','))

  for (const item of data) {
    const row = headers.map(header => {
      const value = item[header]
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`
      }
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    })
    csvRows.push(row.join(','))
  }

  return csvRows.join('\n')
}

// Department data mapping
export const departmentHeaders = [
  'name', 'code', 'description', 'head', 'headContact', 'headEmail',
  'location', 'establishedYear', 'status', 'totalStaff', 'totalPrograms',
  'totalStudents', 'budget'
]

// Bulk export functions
export const exportDepartments = (): { csv: string, json: string } => {
  const departments = departmentsDB.getAll()
  const csv = generateCSV(departments, departmentHeaders)
  const json = JSON.stringify(departments, null, 2)
  return { csv, json }
}

// Complete system export
export const exportAllData = (): { csv: { [key: string]: string }, json: string } => {
  const departments = departmentsDB.getAll()
  const programs = programsDB.getAll()
  const courses = coursesDB.getAll()

  const allData = {
    departments,
    programs,
    courses,
    exportedAt: new Date().toISOString(),
    version: '1.0',
    source: 'NPIPNG Academic Management System'
  }

  return {
    csv: {
      departments: generateCSV(departments, departmentHeaders),
    },
    json: JSON.stringify(allData, null, 2)
  }
}
