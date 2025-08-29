// Supabase Database Service
// Extends localStorage functionality with Supabase backend
// Provides CRUD operations, real-time subscriptions, and offline fallback

import { supabase, TABLES } from "./supabase"
import { DatabaseRecord, LocalDatabase } from "./database-enhanced"

export interface SupabaseConfig {
  enableRealtime: boolean
  enableOfflineMode: boolean
  syncInterval?: number // in milliseconds
}

export class SupabaseDatabase<T extends DatabaseRecord> {
  private tableName: string
  private localDB: LocalDatabase<T>
  private config: SupabaseConfig
  private isOnline: boolean = true
  private subscriptions: { [key: string]: any } = {}

  constructor(
    tableName: string,
    config: SupabaseConfig = {
      enableRealtime: true,
      enableOfflineMode: true,
      syncInterval: 30000 // 30 seconds
    }
  ) {
    this.tableName = tableName
    this.config = config
    this.localDB = new LocalDatabase<T>(tableName)

    // Monitor online/offline status
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
      this.isOnline = navigator.onLine
    }

    // Initialize real-time subscriptions if enabled
    if (this.config.enableRealtime) {
      this.initializeRealtimeSubscription()
    }

    // Set up periodic sync if offline mode is enabled
    if (this.config.enableOfflineMode && this.config.syncInterval) {
      setInterval(() => this.syncWithServer(), this.config.syncInterval)
    }
  }

  // Initialize real-time subscription for the table
  private initializeRealtimeSubscription() {
    const channel = supabase
      .channel(`public:${this.tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: this.tableName },
        (payload) => {
          console.log("Real-time update:", payload)
          this.handleRealtimeUpdate(payload)
        }
      )
      .subscribe()

    this.subscriptions[this.tableName] = channel
  }

  // Handle real-time updates from Supabase
  private handleRealtimeUpdate(payload: { eventType: string; new: any; old: any }) {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case "INSERT":
        this.localDB.create(newRecord)
        break
      case "UPDATE":
        this.localDB.update(newRecord.id, newRecord)
        break
      case "DELETE":
        this.localDB.delete(oldRecord.id)
        break
    }
  }

  // Handle online status change
  private async handleOnline() {
    this.isOnline = true
    console.log("Back online, syncing with server...")
    await this.syncWithServer()
  }

  // Handle offline status change
  private handleOffline() {
    this.isOnline = false
    console.log("Gone offline, using local storage...")
  }

  // Sync local data with server
  private async syncWithServer() {
    if (!this.isOnline) return

    try {
      // Get server data
      const { data: serverData, error } = await supabase
        .from(this.tableName)
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) throw error

      // Get local data
      const localData = this.localDB.getAll()

      // Simple sync: replace local data with server data
      // In a production app, you might want more sophisticated conflict resolution
      if (serverData && serverData.length > 0) {
        this.localDB.clear()
        this.localDB.bulkCreate(serverData.map(item => {
          const { id, created_at, updated_at, ...rest } = item
          return {
            ...rest,
            createdAt: created_at,
            updatedAt: updated_at
          }
        }))
      }

      console.log(`Synced ${serverData?.length || 0} records for ${this.tableName}`)
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }

  // Get all records (with fallback to localStorage)
  async getAll(): Promise<T[]> {
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from(this.tableName)
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        // Convert Supabase format to local format
        const formattedData = data?.map(item => ({
          ...item,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) as T[]

        // Update local cache
        if (this.config.enableOfflineMode && formattedData) {
          this.localDB.clear()
          this.localDB.bulkCreate(formattedData.map(item => {
            const { id, createdAt, updatedAt, ...rest } = item
            return { ...rest, createdAt, updatedAt }
          }))
        }

        return formattedData || []
      } catch (error) {
        console.error("Supabase query failed, falling back to localStorage:", error)
        return this.localDB.getAll()
      }
    }

    return this.localDB.getAll()
  }

  // Get single record by ID
  async getById(id: number): Promise<T | null> {
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from(this.tableName)
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error

        return data ? {
          ...data,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        } as T : null
      } catch (error) {
        console.error("Supabase query failed, falling back to localStorage:", error)
        return this.localDB.getById(id)
      }
    }

    return this.localDB.getById(id)
  }

  // Create new record
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const recordData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (this.isOnline) {
      try {
        const { data: newRecord, error } = await supabase
          .from(this.tableName)
          .insert([recordData])
          .select()
          .single()

        if (error) throw error

        const formattedRecord = {
          ...newRecord,
          createdAt: newRecord.created_at,
          updatedAt: newRecord.updated_at
        } as T

        // Update local cache
        if (this.config.enableOfflineMode) {
          this.localDB.create(data)
        }

        return formattedRecord
      } catch (error) {
        console.error("Supabase insert failed, saving locally:", error)
        return this.localDB.create(data)
      }
    }

    return this.localDB.create(data)
  }

  // Update existing record
  async update(id: number, data: Partial<Omit<T, "id" | "createdAt">>): Promise<T | null> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    }

    if (this.isOnline) {
      try {
        const { data: updatedRecord, error } = await supabase
          .from(this.tableName)
          .update(updateData)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error

        const formattedRecord = {
          ...updatedRecord,
          createdAt: updatedRecord.created_at,
          updatedAt: updatedRecord.updated_at
        } as T

        // Update local cache
        if (this.config.enableOfflineMode) {
          this.localDB.update(id, data)
        }

        return formattedRecord
      } catch (error) {
        console.error("Supabase update failed, updating locally:", error)
        return this.localDB.update(id, data)
      }
    }

    return this.localDB.update(id, data)
  }

  // Delete record
  async delete(id: number): Promise<boolean> {
    if (this.isOnline) {
      try {
        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .eq("id", id)

        if (error) throw error

        // Update local cache
        if (this.config.enableOfflineMode) {
          this.localDB.delete(id)
        }

        return true
      } catch (error) {
        console.error("Supabase delete failed, deleting locally:", error)
        return this.localDB.delete(id)
      }
    }

    return this.localDB.delete(id)
  }

  // Search records
  async search<K extends keyof T>(field: K, query: string): Promise<T[]> {
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from(this.tableName)
          .select("*")
          .ilike(String(field), `%${query}%`)

        if (error) throw error

        return data?.map(item => ({
          ...item,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) as T[] || []
      } catch (error) {
        console.error("Supabase search failed, searching locally:", error)
        return this.localDB.search(field, query)
      }
    }

    return this.localDB.search(field, query)
  }

  // Filter records with custom predicate
  async filter(predicate: (record: T) => boolean): Promise<T[]> {
    const allRecords = await this.getAll()
    return allRecords.filter(predicate)
  }

  // Count records
  async count(): Promise<number> {
    if (this.isOnline) {
      try {
        const { count, error } = await supabase
          .from(this.tableName)
          .select("*", { count: "exact", head: true })

        if (error) throw error

        return count || 0
      } catch (error) {
        console.error("Supabase count failed, counting locally:", error)
        return this.localDB.count()
      }
    }

    return this.localDB.count()
  }

  // Bulk create records
  async bulkCreate(records: Omit<T, "id" | "createdAt" | "updatedAt">[]): Promise<T[]> {
    const now = new Date().toISOString()
    const recordsData = records.map(record => ({
      ...record,
      created_at: now,
      updated_at: now
    }))

    if (this.isOnline) {
      try {
        const { data: newRecords, error } = await supabase
          .from(this.tableName)
          .insert(recordsData)
          .select()

        if (error) throw error

        const formattedRecords = newRecords?.map(item => ({
          ...item,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) as T[]

        // Update local cache
        if (this.config.enableOfflineMode) {
          this.localDB.bulkCreate(records)
        }

        return formattedRecords || []
      } catch (error) {
        console.error("Supabase bulk insert failed, saving locally:", error)
        return this.localDB.bulkCreate(records)
      }
    }

    return this.localDB.bulkCreate(records)
  }

  // Subscribe to real-time updates with callback
  subscribe(callback: (payload: any) => void) {
    if (!this.config.enableRealtime) {
      console.warn("Real-time is not enabled for this database instance")
      return null
    }

    const channel = supabase
      .channel(`custom:${this.tableName}:${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: this.tableName },
        callback
      )
      .subscribe()

    return channel
  }

  // Unsubscribe from real-time updates
  unsubscribe(channel: any) {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }

  // Clean up subscriptions
  destroy() {
    Object.values(this.subscriptions).forEach(subscription => {
      supabase.removeChannel(subscription)
    })
    this.subscriptions = {}
  }

  // Get connection status
  getStatus() {
    return {
      isOnline: this.isOnline,
      hasLocalData: this.localDB.count() > 0,
      tableName: this.tableName,
      config: this.config
    }
  }

  // Force sync with server
  async forceSync() {
    await this.syncWithServer()
  }

  // Get local database instance for direct access
  getLocalDB() {
    return this.localDB
  }
}

// Create database instances for each module
export const supabaseDepartmentsDB = new SupabaseDatabase(TABLES.DEPARTMENTS)
export const supabaseProgramsDB = new SupabaseDatabase(TABLES.PROGRAMS)
export const supabaseCoursesDB = new SupabaseDatabase(TABLES.COURSES)
export const supabaseCurriculumDB = new SupabaseDatabase(TABLES.CURRICULUM)
export const supabaseScheduleDB = new SupabaseDatabase(TABLES.SCHEDULE)
export const supabaseExaminationDB = new SupabaseDatabase(TABLES.EXAMINATION)
export const supabaseGradingDB = new SupabaseDatabase(TABLES.GRADING)
export const supabaseCalendarDB = new SupabaseDatabase(TABLES.CALENDAR)

// System-wide utilities
export const initializeSupabaseDatabase = async () => {
  console.log("Initializing Supabase database connections...")

  // Test connection
  try {
    const { data, error } = await supabase.from("departments").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection failed:", error)
      return false
    }

    console.log("Supabase connection established successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize Supabase:", error)
    return false
  }
}

// Get system-wide database statistics
export const getSupabaseStats = async () => {
  const stats = {}

  for (const [key, tableName] of Object.entries(TABLES)) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true })

      if (!error) {
        stats[key.toLowerCase()] = { count: count || 0, status: "connected" }
      } else {
        stats[key.toLowerCase()] = { count: 0, status: "error", error: error.message }
      }
    } catch (error) {
      stats[key.toLowerCase()] = { count: 0, status: "error", error: error.message }
    }
  }

  return stats
}

export default SupabaseDatabase
