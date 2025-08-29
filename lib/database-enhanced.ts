// Enhanced database utility with Supabase support and bulk import/export
import { DatabaseRecord, LocalDatabase } from './database'

export interface DatabaseConfig {
  useSupabase: boolean
  supabaseUrl?: string
  supabaseKey?: string
}

export class EnhancedDatabase<T extends DatabaseRecord> extends LocalDatabase<T> {
  private config: DatabaseConfig
  private supabase: any = null

  constructor(tableName: string, config: DatabaseConfig = { useSupabase: false }) {
    super(tableName)
    this.config = config
    this.initializeSupabase()
  }

  private async initializeSupabase() {
    if (this.config.useSupabase && this.config.supabaseUrl && this.config.supabaseKey) {
      try {
        // Dynamic import of Supabase client
        const { createClient } = await import('@supabase/supabase-js')
        this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseKey)
      } catch (error) {
        console.warn('Supabase not available, falling back to localStorage:', error)
        this.config.useSupabase = false
      }
    }
  }

  // Override getAll to support Supabase
  async getAllAsync(): Promise<T[]> {
    if (this.config.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error(`Error fetching from Supabase ${this.tableName}:`, error)
        // Fallback to localStorage
        return this.getAll()
      }
    }
    return this.getAll()
  }

  // Override create to support Supabase
  async createAsync(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    if (this.config.useSupabase && this.supabase) {
      try {
        const now = new Date().toISOString()
        const newRecord = {
          ...data,
          created_at: now,
          updated_at: now
        }

        const { data: result, error } = await this.supabase
          .from(this.tableName)
          .insert([newRecord])
          .select()
          .single()

        if (error) throw error

        // Also save to localStorage as backup
        const localRecord = this.create(data)
        return result || localRecord
      } catch (error) {
        console.error(`Error creating in Supabase ${this.tableName}:`, error)
        // Fallback to localStorage
        return this.create(data)
      }
    }
    return this.create(data)
  }

  // Override update to support Supabase
  async updateAsync(id: number, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    if (this.config.useSupabase && this.supabase) {
      try {
        const updateData = {
          ...data,
          updated_at: new Date().toISOString()
        }

        const { data: result, error } = await this.supabase
          .from(this.tableName)
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Also update localStorage as backup
        const localResult = this.update(id, data)
        return result || localResult
      } catch (error) {
        console.error(`Error updating in Supabase ${this.tableName}:`, error)
        // Fallback to localStorage
        return this.update(id, data)
      }
    }
    return this.update(id, data)
  }

  // Override delete to support Supabase
  async deleteAsync(id: number): Promise<boolean> {
    if (this.config.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase
          .from(this.tableName)
          .delete()
          .eq('id', id)

        if (error) throw error

        // Also delete from localStorage
        this.delete(id)
        return true
      } catch (error) {
        console.error(`Error deleting from Supabase ${this.tableName}:`, error)
        // Fallback to localStorage
        return this.delete(id)
      }
    }
    return this.delete(id)
  }

  // Bulk export functionality
  async exportData(format: 'json' | 'csv' = 'json'): Promise<string> {
    const data = await this.getAllAsync()

    if (format === 'csv') {
      return this.convertToCSV(data)
    }

    return JSON.stringify({
      tableName: this.tableName,
      exportedAt: new Date().toISOString(),
      recordCount: data.length,
      data: data
    }, null, 2)
  }

  // Bulk import functionality
  async importData(importData: string, format: 'json' | 'csv' = 'json'): Promise<{ success: number, errors: string[] }> {
    const results = { success: 0, errors: [] as string[] }

    try {
      let records: any[] = []

      if (format === 'csv') {
        records = this.convertFromCSV(importData)
      } else {
        const parsed = JSON.parse(importData)
        records = Array.isArray(parsed) ? parsed : parsed.data || []
      }

      for (const record of records) {
        try {
          // Remove id, createdAt, updatedAt if they exist
          const { id, createdAt, updatedAt, created_at, updated_at, ...cleanRecord } = record
          await this.createAsync(cleanRecord)
          results.success++
        } catch (error) {
          results.errors.push(`Failed to import record: ${error}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to parse import data: ${error}`)
    }

    return results
  }

  // Convert data to CSV format
  private convertToCSV(data: T[]): string {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(record =>
      Object.values(record).map(value =>
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    )

    return [headers, ...rows].join('\n')
  }

  // Convert CSV to data array
  private convertFromCSV(csvData: string): any[] {
    const lines = csvData.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim())
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const record: any = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      })
      return record
    })
  }

  // Sync localStorage data to Supabase
  async syncToSupabase(): Promise<{ synced: number, errors: string[] }> {
    if (!this.config.useSupabase || !this.supabase) {
      return { synced: 0, errors: ['Supabase not configured'] }
    }

    const results = { synced: 0, errors: [] as string[] }
    const localData = this.getAll()

    for (const record of localData) {
      try {
        const { id, createdAt, updatedAt, ...dataToSync } = record
        await this.createAsync(dataToSync)
        results.synced++
      } catch (error) {
        results.errors.push(`Failed to sync record ${record.id}: ${error}`)
      }
    }

    return results
  }

  // Sync Supabase data to localStorage
  async syncFromSupabase(): Promise<{ synced: number, errors: string[] }> {
    if (!this.config.useSupabase || !this.supabase) {
      return { synced: 0, errors: ['Supabase not configured'] }
    }

    const results = { synced: 0, errors: [] as string[] }

    try {
      const supabaseData = await this.getAllAsync()

      // Clear localStorage and sync from Supabase
      this.clear()

      for (const record of supabaseData) {
        try {
          const { created_at, updated_at, ...localRecord } = record
          const mappedRecord = {
            ...localRecord,
            createdAt: created_at,
            updatedAt: updated_at
          }
          this.create(mappedRecord)
          results.synced++
        } catch (error) {
          results.errors.push(`Failed to sync record ${record.id}: ${error}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to fetch from Supabase: ${error}`)
    }

    return results
  }

  // Check connection status
  async checkConnection(): Promise<{ localStorage: boolean, supabase: boolean }> {
    const localStorage = typeof window !== 'undefined' && !!window.localStorage
    let supabase = false

    if (this.config.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from(this.tableName).select('count').limit(1)
        supabase = !error
      } catch {
        supabase = false
      }
    }

    return { localStorage, supabase }
  }
}

// Enhanced database instances
export const enhancedDepartmentsDB = new EnhancedDatabase('departments')
export const enhancedProgramsDB = new EnhancedDatabase('programs')
export const enhancedCoursesDB = new EnhancedDatabase('courses')

// Configuration helper
export const configureDatabases = (config: DatabaseConfig) => {
  enhancedDepartmentsDB['config'] = config
  enhancedProgramsDB['config'] = config
  enhancedCoursesDB['config'] = config
}

// Bulk operations for all modules
export const bulkExportAll = async (): Promise<string> => {
  const allData = {
    export: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      source: 'NPIPNG ERP System'
    },
    departments: await enhancedDepartmentsDB.getAllAsync(),
    programs: await enhancedProgramsDB.getAllAsync(),
    courses: await enhancedCoursesDB.getAllAsync()
  }

  return JSON.stringify(allData, null, 2)
}

export const bulkImportAll = async (importData: string): Promise<{
  departments: { success: number, errors: string[] },
  programs: { success: number, errors: string[] },
  courses: { success: number, errors: string[] }
}> => {
  try {
    const parsed = JSON.parse(importData)

    const results = {
      departments: { success: 0, errors: [] as string[] },
      programs: { success: 0, errors: [] as string[] },
      courses: { success: 0, errors: [] as string[] }
    }

    if (parsed.departments) {
      results.departments = await enhancedDepartmentsDB.importData(JSON.stringify(parsed.departments))
    }

    if (parsed.programs) {
      results.programs = await enhancedProgramsDB.importData(JSON.stringify(parsed.programs))
    }

    if (parsed.courses) {
      results.courses = await enhancedCoursesDB.importData(JSON.stringify(parsed.courses))
    }

    return results
  } catch (error) {
    return {
      departments: { success: 0, errors: [`Parse error: ${error}`] },
      programs: { success: 0, errors: [`Parse error: ${error}`] },
      courses: { success: 0, errors: [`Parse error: ${error}`] }
    }
  }
}
