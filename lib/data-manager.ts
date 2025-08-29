// Data import/export system for NPIPNG ERP
import {
  departmentsDB,
  programsDB,
  coursesDB
} from './database'

export interface DataExport {
  metadata: {
    exportDate: string
    version: string
    source: string
    totalRecords: number
  }
  departments: any[]
  programs: any[]
  courses: any[]
}

export interface ImportResult {
  success: boolean
  message: string
  summary: {
    departments: { imported: number; errors: number }
    programs: { imported: number; errors: number }
    courses: { imported: number; errors: number }
  }
  errors: string[]
}

export class DataManager {

  // Full system export
  static async exportAllData(): Promise<string> {
    try {
      const exportData: DataExport = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          source: 'NPIPNG ERP System',
          totalRecords: 0
        },
        departments: departmentsDB.getAll(),
        programs: programsDB.getAll(),
        courses: coursesDB.getAll()
      }

      // Calculate total records
      exportData.metadata.totalRecords =
        exportData.departments.length +
        exportData.programs.length +
        exportData.courses.length

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw new Error('Failed to export data')
    }
  }

  // Import all data
  static async importAllData(jsonData: string, options: {
    clearExisting?: boolean
    skipDuplicates?: boolean
  } = {}): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      message: '',
      summary: {
        departments: { imported: 0, errors: 0 },
        programs: { imported: 0, errors: 0 },
        courses: { imported: 0, errors: 0 }
      },
      errors: []
    }

    try {
      const data = JSON.parse(jsonData) as DataExport

      // Clear existing data if requested
      if (options.clearExisting) {
        departmentsDB.clear()
        programsDB.clear()
        coursesDB.clear()
      }

      // Import departments
      if (data.departments) {
        for (const record of data.departments) {
          try {
            const { id, createdAt, updatedAt, ...recordData } = record
            departmentsDB.create(recordData)
            result.summary.departments.imported++
          } catch (error) {
            result.summary.departments.errors++
            result.errors.push(`Departments: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
      }

      // Import programs
      if (data.programs) {
        for (const record of data.programs) {
          try {
            const { id, createdAt, updatedAt, ...recordData } = record
            programsDB.create(recordData)
            result.summary.programs.imported++
          } catch (error) {
            result.summary.programs.errors++
            result.errors.push(`Programs: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
      }

      // Import courses
      if (data.courses) {
        for (const record of data.courses) {
          try {
            const { id, createdAt, updatedAt, ...recordData } = record
            coursesDB.create(recordData)
            result.summary.courses.imported++
          } catch (error) {
            result.summary.courses.errors++
            result.errors.push(`Courses: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
      }

      const totalImported = Object.values(result.summary).reduce((sum, module) => sum + module.imported, 0)
      const totalErrors = Object.values(result.summary).reduce((sum, module) => sum + module.errors, 0)

      result.success = totalImported > 0
      result.message = result.success
        ? `Successfully imported ${totalImported} records with ${totalErrors} errors`
        : 'Import failed - no records were imported'

      return result
    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.message = 'Import failed due to data format or processing error'
      return result
    }
  }

  // Download file helper
  static downloadFile(content: string, filename: string, contentType: string = 'application/json') {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  // Create backup
  static async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportData = await this.exportAllData()

    this.downloadFile(
      exportData,
      `npipng-backup-${timestamp}.json`,
      'application/json'
    )

    return exportData
  }
}
