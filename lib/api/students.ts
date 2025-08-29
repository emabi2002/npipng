import { createClient } from '../supabase/client'

const supabase = createClient()

export interface Student {
  id: string
  user_id: string
  student_id: string
  program_id: string
  year_level: number
  section?: string
  gpa?: number
  total_credits: number
  enrollment_status: 'enrolled' | 'graduated' | 'dropped' | 'suspended'
  admission_date: string
  expected_graduation?: string
  advisor_id?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    full_name: string
    email: string
    phone?: string
    status: string
  }
  program?: {
    name: string
    code: string
    department?: {
      name: string
    }
  }
  advisor?: {
    full_name: string
  }
}

export interface CreateStudentData {
  user_id: string
  student_id: string
  program_id: string
  year_level?: number
  section?: string
  admission_date?: string
  advisor_id?: string
}

export interface UpdateStudentData {
  program_id?: string
  year_level?: number
  section?: string
  gpa?: number
  total_credits?: number
  enrollment_status?: 'enrolled' | 'graduated' | 'dropped' | 'suspended'
  expected_graduation?: string
  advisor_id?: string
}

export interface StudentFilters {
  program_id?: string
  year_level?: number
  enrollment_status?: string
  search?: string
  advisor_id?: string
}

// Get all students with filters and pagination
export const getStudents = async (
  filters: StudentFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('students')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        program:programs (
          name,
          code,
          department:departments (
            name
          )
        ),
        advisor:users!advisor_id (
          full_name
        )
      `)

    // Apply filters
    if (filters.program_id) {
      query = query.eq('program_id', filters.program_id)
    }
    if (filters.year_level) {
      query = query.eq('year_level', filters.year_level)
    }
    if (filters.enrollment_status) {
      query = query.eq('enrollment_status', filters.enrollment_status)
    }
    if (filters.advisor_id) {
      query = query.eq('advisor_id', filters.advisor_id)
    }
    if (filters.search) {
      query = query.or(
        `student_id.ilike.%${filters.search}%,user.full_name.ilike.%${filters.search}%,user.email.ilike.%${filters.search}%`
      )
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    // Order by created_at desc
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Student[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          address,
          status
        ),
        program:programs (
          name,
          code,
          degree_type,
          duration_years,
          total_credits,
          department:departments (
            name,
            code
          )
        ),
        advisor:users!advisor_id (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}

// Get student by student ID
export const getStudentByStudentId = async (studentId: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        program:programs (
          name,
          code,
          department:departments (
            name
          )
        )
      `)
      .eq('student_id', studentId)
      .single()

    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error fetching student by student ID:', error)
    return null
  }
}

// Get student by user ID
export const getStudentByUserId = async (userId: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        program:programs (
          name,
          code,
          department:departments (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error fetching student by user ID:', error)
    return null
  }
}

// Create new student
export const createStudent = async (studentData: CreateStudentData): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        program:programs (
          name,
          code,
          department:departments (
            name
          )
        )
      `)
      .single()

    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error creating student:', error)
    throw error
  }
}

// Update student
export const updateStudent = async (id: string, updates: UpdateStudentData): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        program:programs (
          name,
          code,
          department:departments (
            name
          )
        )
      `)
      .single()

    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}

// Delete student (soft delete by changing status)
export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('students')
      .update({ enrollment_status: 'dropped' })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting student:', error)
    return false
  }
}

// Get student enrollments
export const getStudentEnrollments = async (studentId: string, semesterId?: string) => {
  try {
    let query = supabase
      .from('enrollments')
      .select(`
        *,
        course_section:course_sections (
          section_code,
          capacity,
          enrolled_count,
          schedule,
          course:courses (
            code,
            name,
            credits,
            description
          ),
          semester:semesters (
            name,
            code,
            start_date,
            end_date
          ),
          instructor:users (
            full_name
          )
        )
      `)
      .eq('student_id', studentId)

    if (semesterId) {
      query = query.eq('course_section.semester_id', semesterId)
    }

    const { data, error } = await query.order('enrollment_date', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching student enrollments:', error)
    throw error
  }
}

// Get student financial records
export const getStudentFinancialRecords = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        fee_structure:fee_structures (
          name,
          tuition_fee,
          lab_fee,
          library_fee,
          miscellaneous_fee,
          total_fee
        ),
        payments (
          id,
          amount,
          payment_method,
          payment_date,
          payment_reference
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching student financial records:', error)
    throw error
  }
}

// Get student library loans
export const getStudentLibraryLoans = async (studentId: string) => {
  try {
    // First get the library member ID for this student
    const { data: member, error: memberError } = await supabase
      .from('library_members')
      .select('id')
      .eq('user_id', studentId)
      .single()

    if (memberError || !member) {
      return []
    }

    const { data, error } = await supabase
      .from('book_loans')
      .select(`
        *,
        book:books (
          title,
          isbn,
          publisher,
          location
        )
      `)
      .eq('member_id', member.id)
      .order('loan_date', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching student library loans:', error)
    throw error
  }
}

// Get academic statistics
export const getAcademicStatistics = async () => {
  try {
    const [
      { count: totalStudents },
      { count: activeStudents },
      { count: graduatedStudents },
      { count: droppedStudents }
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'enrolled'),
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'graduated'),
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'dropped')
    ])

    return {
      totalStudents: totalStudents || 0,
      activeStudents: activeStudents || 0,
      graduatedStudents: graduatedStudents || 0,
      droppedStudents: droppedStudents || 0
    }
  } catch (error) {
    console.error('Error fetching academic statistics:', error)
    return {
      totalStudents: 0,
      activeStudents: 0,
      graduatedStudents: 0,
      droppedStudents: 0
    }
  }
}

// Get students by program
export const getStudentsByProgram = async (programId: string) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users (
          full_name,
          email
        )
      `)
      .eq('program_id', programId)
      .eq('enrollment_status', 'enrolled')
      .order('year_level')

    if (error) throw error
    return data as Student[]
  } catch (error) {
    console.error('Error fetching students by program:', error)
    throw error
  }
}
