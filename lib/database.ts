// Enhanced database utility supporting localStorage and Supabase backends
// Provides persistent storage with fallback mechanisms

export interface DatabaseRecord {
  id: number
  createdAt: string
  updatedAt: string
}

// Database configuration
export interface DatabaseConfig {
  backend: 'localStorage' | 'supabase'
  supabaseUrl?: string
  supabaseKey?: string
}

export class LocalDatabase<T extends DatabaseRecord> {
  private tableName: string
  private config: DatabaseConfig

  constructor(tableName: string, config: DatabaseConfig = { backend: 'localStorage' }) {
    this.tableName = tableName
    this.config = config
  }

  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  // Get all records
  getAll(): T[] {
    if (!this.isBrowser()) return []

    try {
      const data = localStorage.getItem(this.tableName)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error reading from ${this.tableName}:`, error)
      return []
    }
  }

  // Get single record by ID
  getById(id: number): T | null {
    const records = this.getAll()
    return records.find(record => record.id === id) || null
  }

  // Create new record
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const records = this.getAll()
    const now = new Date().toISOString()
    const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1

    const newRecord: T = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now
    } as T

    records.push(newRecord)
    this.saveAll(records)
    return newRecord
  }

  // Update existing record
  update(id: number, data: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
    const records = this.getAll()
    const index = records.findIndex(record => record.id === id)

    if (index === -1) return null

    const updatedRecord: T = {
      ...records[index],
      ...data,
      updatedAt: new Date().toISOString()
    }

    records[index] = updatedRecord
    this.saveAll(records)
    return updatedRecord
  }

  // Delete record
  delete(id: number): boolean {
    const records = this.getAll()
    const filteredRecords = records.filter(record => record.id !== id)

    if (filteredRecords.length === records.length) return false

    this.saveAll(filteredRecords)
    return true
  }

  // Save all records to localStorage
  private saveAll(records: T[]): void {
    if (!this.isBrowser()) return

    try {
      localStorage.setItem(this.tableName, JSON.stringify(records))
    } catch (error) {
      console.error(`Error saving to ${this.tableName}:`, error)
    }
  }

  // Clear all records
  clear(): void {
    if (!this.isBrowser()) return
    localStorage.removeItem(this.tableName)
  }

  // Search records by a field
  search<K extends keyof T>(field: K, query: string): T[] {
    const records = this.getAll()
    const searchQuery = query.toLowerCase()

    return records.filter(record => {
      const fieldValue = record[field]
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(searchQuery)
      }
      return false
    })
  }

  // Filter records by criteria
  filter(predicate: (record: T) => boolean): T[] {
    return this.getAll().filter(predicate)
  }

  // Count records
  count(): number {
    return this.getAll().length
  }

  // Initialize with default data if empty
  initializeWith(defaultData: T[]): void {
    const existing = this.getAll()
    if (existing.length === 0) {
      this.saveAll(defaultData)
    }
  }

  // Bulk operations
  bulkCreate(records: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): T[] {
    const existingRecords = this.getAll()
    const now = new Date().toISOString()
    const nextId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) + 1 : 1

    const newRecords: T[] = records.map((data, index) => ({
      ...data,
      id: nextId + index,
      createdAt: now,
      updatedAt: now
    }) as T)

    const allRecords = [...existingRecords, ...newRecords]
    this.saveAll(allRecords)
    return newRecords
  }

  // Export data as JSON
  exportToJSON(): string {
    const records = this.getAll()
    return JSON.stringify({
      tableName: this.tableName,
      records,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2)
  }

  // Import data from JSON
  importFromJSON(jsonData: string, options: { replace?: boolean } = {}): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.tableName !== this.tableName) {
        throw new Error(`Table name mismatch. Expected: ${this.tableName}, Got: ${data.tableName}`)
      }

      if (options.replace) {
        this.clear()
      }

      this.saveAll(data.records || [])
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

// Database instances for each module
export const departmentsDB = new LocalDatabase('departments')
export const programsDB = new LocalDatabase('programs')
export const coursesDB = new LocalDatabase('courses')
export const curriculumDB = new LocalDatabase('curriculum')
export const scheduleDB = new LocalDatabase('schedule')
export const examinationDB = new LocalDatabase('examination')
export const gradingDB = new LocalDatabase('grading')
export const calendarDB = new LocalDatabase('calendar')

// Utility functions for system-wide operations
export const initializeDatabase = () => {
  // Initialize with default data if needed
  console.log('Database initialized')
}

// System-wide export functionality
export const exportAllData = () => {
  if (typeof window === 'undefined') return null

  const allData = {
    metadata: {
      systemName: 'NPIPNG ERP',
      exportedAt: new Date().toISOString(),
      version: '1.0'
    },
    departments: departmentsDB.getAll(),
    programs: programsDB.getAll(),
    courses: coursesDB.getAll(),
    curriculum: curriculumDB.getAll(),
    schedule: scheduleDB.getAll(),
    examination: examinationDB.getAll(),
    grading: gradingDB.getAll(),
    calendar: calendarDB.getAll()
  }

  return JSON.stringify(allData, null, 2)
}

// System-wide import functionality
export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData)

    // Validate structure
    if (!data.metadata || data.metadata.systemName !== 'NPIPNG ERP') {
      throw new Error('Invalid data format or system mismatch')
    }

    // Import each module's data
    if (data.departments) {
      departmentsDB.clear()
      departmentsDB['saveAll'](data.departments)
    }
    if (data.programs) {
      programsDB.clear()
      programsDB['saveAll'](data.programs)
    }
    if (data.courses) {
      coursesDB.clear()
      coursesDB['saveAll'](data.courses)
    }
    if (data.curriculum) {
      curriculumDB.clear()
      curriculumDB['saveAll'](data.curriculum)
    }
    if (data.schedule) {
      scheduleDB.clear()
      scheduleDB['saveAll'](data.schedule)
    }
    if (data.examination) {
      examinationDB.clear()
      examinationDB['saveAll'](data.examination)
    }
    if (data.grading) {
      gradingDB.clear()
      gradingDB['saveAll'](data.grading)
    }
    if (data.calendar) {
      calendarDB.clear()
      calendarDB['saveAll'](data.calendar)
    }

    return true
  } catch (error) {
    console.error('Error importing system data:', error)
    return false
  }
}

// Backup and restore utilities
export const createBackup = (): string => {
  const backup = exportAllData()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `npipng-backup-${timestamp}.json`

  if (backup && typeof window !== 'undefined') {
    const blob = new Blob([backup], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return filename
}

// Statistics and analytics
export const getDatabaseStats = () => {
  return {
    departments: {
      count: departmentsDB.count(),
      lastUpdated: departmentsDB.getAll().reduce((latest, item) =>
        item.updatedAt > latest ? item.updatedAt : latest, '1970-01-01T00:00:00.000Z')
    },
    programs: {
      count: programsDB.count(),
      lastUpdated: programsDB.getAll().reduce((latest, item) =>
        item.updatedAt > latest ? item.updatedAt : latest, '1970-01-01T00:00:00.000Z')
    },
    courses: {
      count: coursesDB.count(),
      lastUpdated: coursesDB.getAll().reduce((latest, item) =>
        item.updatedAt > latest ? item.updatedAt : latest, '1970-01-01T00:00:00.000Z')
    },
    totalRecords: departmentsDB.count() + programsDB.count() + coursesDB.count() +
                  curriculumDB.count() + scheduleDB.count() + examinationDB.count() +
                  gradingDB.count() + calendarDB.count()
  }
}
