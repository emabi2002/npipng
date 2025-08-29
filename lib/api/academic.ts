import { createClient } from '../supabase/client'

const supabase = createClient()

// Types for academic system
export interface AcademicProgram {
  id: string
  name: string
  code: string
  description?: string
  duration_semesters: number
  total_credits: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  program_id: string
  name: string
  code: string
  description?: string
  credits: number
  semester: number
  is_active: boolean
  created_at: string
  updated_at: string
  academic_programs?: AcademicProgram
}

export interface CourseEnrollment {
  id: string
  student_id: string
  course_id: string
  semester_year: string
  enrollment_date: string
  status: 'enrolled' | 'dropped' | 'completed'
  created_at: string
  students?: any
  courses?: Course
}

export interface AssessmentConfig {
  id: string
  course_id: string
  semester_year: string
  assessment_type: 'quiz' | 'test' | 'assignment' | 'project' | 'lab' | 'participation' | 'final_exam'
  category: 'internal' | 'external'
  name: string
  description?: string
  max_marks: number
  weight_percentage: number
  due_date?: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
  courses?: Course
}

export interface Assessment {
  id: string
  config_id: string
  title: string
  description?: string
  instructions?: string
  start_time?: string
  end_time?: string
  duration_minutes?: number
  total_marks: number
  is_published: boolean
  created_at: string
  updated_at: string
  assessment_configs?: AssessmentConfig
}

export interface StudentGrade {
  id: string
  assessment_id: string
  student_id: string
  enrollment_id: string
  marks_obtained: number
  percentage: number
  grade_letter?: string
  comments?: string
  submitted_at?: string
  graded_at?: string
  graded_by?: string
  is_submitted: boolean
  is_graded: boolean
  created_at: string
  updated_at: string
  assessments?: Assessment
  students?: any
}

export interface CourseGrade {
  id: string
  enrollment_id: string
  student_id: string
  course_id: string
  semester_year: string
  internal_total_marks: number
  internal_obtained_marks: number
  internal_percentage: number
  external_total_marks: number
  external_obtained_marks: number
  external_percentage: number
  final_percentage: number
  final_grade_letter?: string
  quality_points?: number
  is_finalized: boolean
  finalized_by?: string
  finalized_at?: string
  created_at: string
  updated_at: string
  students?: any
  courses?: Course
  course_enrollments?: CourseEnrollment
}

export interface AcademicRecord {
  id: string
  student_id: string
  program_id: string
  semester_year: string
  total_credits_attempted: number
  total_credits_earned: number
  semester_gpa: number
  cumulative_gpa: number
  total_quality_points: number
  academic_status: string
  is_finalized: boolean
  created_at: string
  updated_at: string
  students?: any
  academic_programs?: AcademicProgram
}

// API Functions for Academic Programs
export async function getAcademicPrograms() {
  const { data, error } = await supabase
    .from('academic_programs')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data as AcademicProgram[]
}

export async function createAcademicProgram(program: Partial<AcademicProgram>) {
  const { data, error } = await supabase
    .from('academic_programs')
    .insert(program)
    .select()
    .single()

  if (error) throw error
  return data as AcademicProgram
}

// API Functions for Courses
export async function getCourses(filters: {
  program_id?: string
  semester?: number
  search?: string
} = {}) {
  let query = supabase
    .from('courses')
    .select(`
      *,
      academic_programs(*)
    `)
    .eq('is_active', true)

  if (filters.program_id) {
    query = query.eq('program_id', filters.program_id)
  }
  if (filters.semester) {
    query = query.eq('semester', filters.semester)
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order('semester', { ascending: true })

  if (error) throw error
  return data as Course[]
}

export async function createCourse(course: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single()

  if (error) throw error
  return data as Course
}

// API Functions for Course Enrollments
export async function getCourseEnrollments(filters: {
  student_id?: string
  course_id?: string
  semester_year?: string
  status?: string
} = {}) {
  let query = supabase
    .from('course_enrollments')
    .select(`
      *,
      students(*),
      courses(*, academic_programs(*))
    `)

  if (filters.student_id) {
    query = query.eq('student_id', filters.student_id)
  }
  if (filters.course_id) {
    query = query.eq('course_id', filters.course_id)
  }
  if (filters.semester_year) {
    query = query.eq('semester_year', filters.semester_year)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('enrollment_date', { ascending: false })

  if (error) throw error
  return data as CourseEnrollment[]
}

export async function enrollStudentInCourse(enrollment: {
  student_id: string
  course_id: string
  semester_year: string
}) {
  const { data, error } = await supabase
    .from('course_enrollments')
    .insert(enrollment)
    .select()
    .single()

  if (error) throw error
  return data as CourseEnrollment
}

// API Functions for Assessment Configurations
export async function getAssessmentConfigs(filters: {
  course_id?: string
  semester_year?: string
  category?: 'internal' | 'external'
  created_by?: string
} = {}) {
  let query = supabase
    .from('assessment_configs')
    .select(`
      *,
      courses(*, academic_programs(*))
    `)
    .eq('is_active', true)

  if (filters.course_id) {
    query = query.eq('course_id', filters.course_id)
  }
  if (filters.semester_year) {
    query = query.eq('semester_year', filters.semester_year)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.created_by) {
    query = query.eq('created_by', filters.created_by)
  }

  const { data, error } = await query.order('due_date', { ascending: true })

  if (error) throw error
  return data as AssessmentConfig[]
}

export async function createAssessmentConfig(config: Partial<AssessmentConfig>) {
  const { data, error } = await supabase
    .from('assessment_configs')
    .insert(config)
    .select()
    .single()

  if (error) throw error
  return data as AssessmentConfig
}

export async function updateAssessmentConfig(id: string, updates: Partial<AssessmentConfig>) {
  const { data, error } = await supabase
    .from('assessment_configs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as AssessmentConfig
}

// API Functions for Assessments
export async function getAssessments(filters: {
  config_id?: string
  course_id?: string
  is_published?: boolean
} = {}) {
  let query = supabase
    .from('assessments')
    .select(`
      *,
      assessment_configs(*, courses(*))
    `)

  if (filters.config_id) {
    query = query.eq('config_id', filters.config_id)
  }
  if (filters.is_published !== undefined) {
    query = query.eq('is_published', filters.is_published)
  }
  if (filters.course_id) {
    query = query.eq('assessment_configs.course_id', filters.course_id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Assessment[]
}

export async function createAssessment(assessment: Partial<Assessment>) {
  const { data, error } = await supabase
    .from('assessments')
    .insert(assessment)
    .select()
    .single()

  if (error) throw error
  return data as Assessment
}

export async function updateAssessment(id: string, updates: Partial<Assessment>) {
  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Assessment
}

// API Functions for Student Grades
export async function getStudentGrades(filters: {
  student_id?: string
  assessment_id?: string
  enrollment_id?: string
  course_id?: string
  is_graded?: boolean
} = {}) {
  let query = supabase
    .from('student_grades')
    .select(`
      *,
      assessments(*, assessment_configs(*, courses(*))),
      students(*)
    `)

  if (filters.student_id) {
    query = query.eq('student_id', filters.student_id)
  }
  if (filters.assessment_id) {
    query = query.eq('assessment_id', filters.assessment_id)
  }
  if (filters.enrollment_id) {
    query = query.eq('enrollment_id', filters.enrollment_id)
  }
  if (filters.is_graded !== undefined) {
    query = query.eq('is_graded', filters.is_graded)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as StudentGrade[]
}

export async function submitStudentGrade(grade: Partial<StudentGrade>) {
  const { data, error } = await supabase
    .from('student_grades')
    .upsert({
      ...grade,
      submitted_at: new Date().toISOString(),
      is_submitted: true
    })
    .select()
    .single()

  if (error) throw error
  return data as StudentGrade
}

export async function gradeAssessment(gradeId: string, updates: {
  marks_obtained: number
  comments?: string
  graded_by: string
}) {
  const { data, error } = await supabase
    .from('student_grades')
    .update({
      ...updates,
      graded_at: new Date().toISOString(),
      is_graded: true
    })
    .eq('id', gradeId)
    .select()
    .single()

  if (error) throw error
  return data as StudentGrade
}

// API Functions for Course Grades (Final grades)
export async function getCourseGrades(filters: {
  student_id?: string
  course_id?: string
  semester_year?: string
  is_finalized?: boolean
} = {}) {
  let query = supabase
    .from('course_grades')
    .select(`
      *,
      students(*),
      courses(*, academic_programs(*)),
      course_enrollments(*)
    `)

  if (filters.student_id) {
    query = query.eq('student_id', filters.student_id)
  }
  if (filters.course_id) {
    query = query.eq('course_id', filters.course_id)
  }
  if (filters.semester_year) {
    query = query.eq('semester_year', filters.semester_year)
  }
  if (filters.is_finalized !== undefined) {
    query = query.eq('is_finalized', filters.is_finalized)
  }

  const { data, error } = await query.order('semester_year', { ascending: false })

  if (error) throw error
  return data as CourseGrade[]
}

export async function finalizeCourseGrade(enrollmentId: string, finalizedBy: string) {
  const { data, error } = await supabase
    .from('course_grades')
    .update({
      is_finalized: true,
      finalized_by: finalizedBy,
      finalized_at: new Date().toISOString()
    })
    .eq('enrollment_id', enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data as CourseGrade
}

// API Functions for Academic Records
export async function getAcademicRecords(filters: {
  student_id?: string
  program_id?: string
  semester_year?: string
} = {}) {
  let query = supabase
    .from('academic_records')
    .select(`
      *,
      students(*),
      academic_programs(*)
    `)

  if (filters.student_id) {
    query = query.eq('student_id', filters.student_id)
  }
  if (filters.program_id) {
    query = query.eq('program_id', filters.program_id)
  }
  if (filters.semester_year) {
    query = query.eq('semester_year', filters.semester_year)
  }

  const { data, error } = await query.order('semester_year', { ascending: false })

  if (error) throw error
  return data as AcademicRecord[]
}

// Utility Functions for Grade Calculations
export async function calculateGPA(studentId: string, semesterYear?: string) {
  let query = supabase
    .from('course_grades')
    .select('quality_points, courses!inner(credits)')
    .eq('student_id', studentId)
    .eq('is_finalized', true)

  if (semesterYear) {
    query = query.eq('semester_year', semesterYear)
  }

  const { data, error } = await query

  if (error) throw error

  if (!data || data.length === 0) {
    return { gpa: 0, totalCredits: 0, qualityPoints: 0 }
  }

  const totalQualityPoints = data.reduce((sum, record) => {
    return sum + ((record.quality_points || 0) * (record.courses?.credits || 0))
  }, 0)

  const totalCredits = data.reduce((sum, record) => {
    return sum + (record.courses?.credits || 0)
  }, 0)

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0

  return {
    gpa: parseFloat(gpa.toFixed(2)),
    totalCredits,
    qualityPoints: totalQualityPoints
  }
}

// Get student's academic progress
export async function getStudentAcademicProgress(studentId: string) {
  try {
    const [enrollments, grades, records] = await Promise.all([
      getCourseEnrollments({ student_id: studentId }),
      getCourseGrades({ student_id: studentId }),
      getAcademicRecords({ student_id: studentId })
    ])

    // Calculate overall GPA
    const overallGPA = await calculateGPA(studentId)

    // Get current semester courses
    const currentSemester = new Date().getFullYear() + ' ' + (new Date().getMonth() < 6 ? 'Spring' : 'Fall')
    const currentCourses = enrollments.filter(e => e.semester_year === currentSemester && e.status === 'enrolled')

    return {
      enrollments,
      grades,
      records,
      overallGPA,
      currentCourses,
      totalCreditsEarned: grades.filter(g => g.is_finalized && g.final_grade_letter !== 'F').reduce((sum, g) => sum + (g.courses?.credits || 0), 0),
      totalCreditsAttempted: grades.reduce((sum, g) => sum + (g.courses?.credits || 0), 0)
    }
  } catch (error) {
    console.error('Error fetching student academic progress:', error)
    throw error
  }
}

// Get faculty teaching assignments
export async function getFacultyAssignments(facultyId: string, semesterYear?: string) {
  let query = supabase
    .from('assessment_configs')
    .select(`
      course_id,
      courses(*, academic_programs(*))
    `)
    .eq('created_by', facultyId)

  if (semesterYear) {
    query = query.eq('semester_year', semesterYear)
  }

  const { data, error } = await query

  if (error) throw error

  // Get unique courses
  const uniqueCourses = data?.reduce((acc, config) => {
    if (!acc.find(course => course.id === config.course_id)) {
      acc.push(config.courses)
    }
    return acc
  }, [] as Course[]) || []

  return uniqueCourses
}

export default {
  // Programs
  getAcademicPrograms,
  createAcademicProgram,

  // Courses
  getCourses,
  createCourse,

  // Enrollments
  getCourseEnrollments,
  enrollStudentInCourse,

  // Assessment Configs
  getAssessmentConfigs,
  createAssessmentConfig,
  updateAssessmentConfig,

  // Assessments
  getAssessments,
  createAssessment,
  updateAssessment,

  // Grading
  getStudentGrades,
  submitStudentGrade,
  gradeAssessment,

  // Course Grades
  getCourseGrades,
  finalizeCourseGrade,

  // Academic Records
  getAcademicRecords,

  // Utilities
  calculateGPA,
  getStudentAcademicProgress,
  getFacultyAssignments
}
