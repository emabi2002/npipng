import { createClient } from '../supabase/client'

const supabase = createClient()

export interface Employee {
  id: string
  user_id: string
  employee_id: string
  department_id?: string
  position?: string
  hire_date: string
  salary?: number
  employment_type?: string
  manager_id?: string
  office_location?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    full_name: string
    email: string
    phone?: string
    status: string
  }
  department?: {
    name: string
    code: string
    building?: string
  }
  manager?: {
    employee_id: string
    user?: {
      full_name: string
    }
  }
  subordinates?: Employee[]
}

export interface LeaveRecord {
  id: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  days_requested: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  // Joined data
  employee?: {
    employee_id: string
    user?: {
      full_name: string
      email: string
    }
    department?: {
      name: string
    }
  }
  approved_by_user?: {
    full_name: string
  }
}

export interface PerformanceEvaluation {
  id: string
  employee_id: string
  evaluator_id: string
  evaluation_period: string
  overall_rating: number
  goals_achievement?: any
  strengths?: string
  areas_for_improvement?: string
  comments?: string
  status: 'draft' | 'submitted' | 'approved'
  created_at: string
  updated_at: string
  // Joined data
  employee?: {
    employee_id: string
    user?: {
      full_name: string
    }
    position?: string
  }
  evaluator?: {
    employee_id: string
    user?: {
      full_name: string
    }
  }
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_of_department_id?: string
  building?: string
  budget?: number
  created_at: string
  updated_at: string
  // Joined data
  head_of_department?: {
    employee_id: string
    user?: {
      full_name: string
    }
  }
  employees_count?: number
}

export interface EmployeeFilters {
  department_id?: string
  employment_type?: string
  is_active?: boolean
  manager_id?: string
  search?: string
}

export interface LeaveFilters {
  employee_id?: string
  status?: string
  leave_type?: string
  date_from?: string
  date_to?: string
}

// Employee Management

export const getEmployees = async (
  filters: EmployeeFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('employees')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        department:departments (
          name,
          code,
          building
        ),
        manager:employees!manager_id (
          employee_id,
          user:users (
            full_name
          )
        )
      `)

    // Apply filters
    if (filters.department_id) {
      query = query.eq('department_id', filters.department_id)
    }
    if (filters.employment_type) {
      query = query.eq('employment_type', filters.employment_type)
    }
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    if (filters.manager_id) {
      query = query.eq('manager_id', filters.manager_id)
    }
    if (filters.search) {
      query = query.or(
        `employee_id.ilike.%${filters.search}%,user.full_name.ilike.%${filters.search}%,user.email.ilike.%${filters.search}%,position.ilike.%${filters.search}%`
      )
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Employee[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          address,
          status
        ),
        department:departments (
          name,
          code,
          description,
          building
        ),
        manager:employees!manager_id (
          employee_id,
          position,
          user:users (
            full_name,
            email
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Get subordinates
    const { data: subordinates } = await supabase
      .from('employees')
      .select(`
        *,
        user:users (
          full_name,
          email
        )
      `)
      .eq('manager_id', id)
      .eq('is_active', true)

    const employeeData = {
      ...data,
      subordinates: subordinates || []
    }

    return employeeData as Employee
  } catch (error) {
    console.error('Error fetching employee:', error)
    return null
  }
}

export const getEmployeeByUserId = async (userId: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          status
        ),
        department:departments (
          name,
          code
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data as Employee
  } catch (error) {
    console.error('Error fetching employee by user ID:', error)
    return null
  }
}

export const createEmployee = async (employeeData: {
  user_id: string
  employee_id: string
  department_id?: string
  position?: string
  hire_date?: string
  salary?: number
  employment_type?: string
  manager_id?: string
  office_location?: string
}): Promise<Employee> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([{
        ...employeeData,
        hire_date: employeeData.hire_date || new Date().toISOString().split('T')[0]
      }])
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone
        ),
        department:departments (
          name,
          code
        )
      `)
      .single()

    if (error) throw error
    return data as Employee
  } catch (error) {
    console.error('Error creating employee:', error)
    throw error
  }
}

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone
        ),
        department:departments (
          name,
          code
        )
      `)
      .single()

    if (error) throw error
    return data as Employee
  } catch (error) {
    console.error('Error updating employee:', error)
    throw error
  }
}

// Leave Management

export const getLeaveRecords = async (
  filters: LeaveFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('leave_records')
      .select(`
        *,
        employee:employees (
          employee_id,
          position,
          user:users (
            full_name,
            email
          ),
          department:departments (
            name,
            code
          )
        ),
        approved_by_user:employees!approved_by (
          employee_id,
          user:users (
            full_name
          )
        )
      `)

    // Apply filters
    if (filters.employee_id) {
      query = query.eq('employee_id', filters.employee_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.leave_type) {
      query = query.eq('leave_type', filters.leave_type)
    }
    if (filters.date_from) {
      query = query.gte('start_date', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('end_date', filters.date_to)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as LeaveRecord[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching leave records:', error)
    throw error
  }
}

export const createLeaveRequest = async (leaveData: {
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  reason?: string
}): Promise<LeaveRecord> => {
  try {
    // Calculate days requested
    const startDate = new Date(leaveData.start_date)
    const endDate = new Date(leaveData.end_date)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const { data, error } = await supabase
      .from('leave_records')
      .insert([{
        ...leaveData,
        days_requested: diffDays,
        status: 'pending'
      }])
      .select(`
        *,
        employee:employees (
          employee_id,
          user:users (
            full_name,
            email
          ),
          department:departments (
            name
          )
        )
      `)
      .single()

    if (error) throw error
    return data as LeaveRecord
  } catch (error) {
    console.error('Error creating leave request:', error)
    throw error
  }
}

export const updateLeaveRecord = async (
  id: string,
  updates: {
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
    approved_by?: string
    approved_at?: string
  }
): Promise<LeaveRecord> => {
  try {
    const updateData = {
      ...updates,
      approved_at: updates.status === 'approved' ? new Date().toISOString() : updates.approved_at
    }

    const { data, error } = await supabase
      .from('leave_records')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        employee:employees (
          employee_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as LeaveRecord
  } catch (error) {
    console.error('Error updating leave record:', error)
    throw error
  }
}

// Performance Evaluation Management

export const getPerformanceEvaluations = async (
  employeeId?: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('performance_evaluations')
      .select(`
        *,
        employee:employees (
          employee_id,
          position,
          user:users (
            full_name,
            email
          ),
          department:departments (
            name
          )
        ),
        evaluator:employees!evaluator_id (
          employee_id,
          user:users (
            full_name
          )
        )
      `)

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as PerformanceEvaluation[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching performance evaluations:', error)
    throw error
  }
}

export const createPerformanceEvaluation = async (evaluationData: {
  employee_id: string
  evaluator_id: string
  evaluation_period: string
  overall_rating: number
  goals_achievement?: any
  strengths?: string
  areas_for_improvement?: string
  comments?: string
}): Promise<PerformanceEvaluation> => {
  try {
    const { data, error } = await supabase
      .from('performance_evaluations')
      .insert([{
        ...evaluationData,
        status: 'draft'
      }])
      .select(`
        *,
        employee:employees (
          employee_id,
          position,
          user:users (
            full_name
          )
        ),
        evaluator:employees!evaluator_id (
          employee_id,
          user:users (
            full_name
          )
        )
      `)
      .single()

    if (error) throw error
    return data as PerformanceEvaluation
  } catch (error) {
    console.error('Error creating performance evaluation:', error)
    throw error
  }
}

export const updatePerformanceEvaluation = async (
  id: string,
  updates: Partial<PerformanceEvaluation>
): Promise<PerformanceEvaluation> => {
  try {
    const { data, error } = await supabase
      .from('performance_evaluations')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        employee:employees (
          employee_id,
          user:users (
            full_name
          )
        )
      `)
      .single()

    if (error) throw error
    return data as PerformanceEvaluation
  } catch (error) {
    console.error('Error updating performance evaluation:', error)
    throw error
  }
}

// Department Management

export const getDepartments = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        head_of_department:employees!head_of_department_id (
          employee_id,
          user:users (
            full_name
          )
        )
      `)
      .order('name')

    if (error) throw error

    // Get employee count for each department
    const departmentsWithCounts = await Promise.all(
      (data || []).map(async (dept) => {
        const { count } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', dept.id)
          .eq('is_active', true)

        return {
          ...dept,
          employees_count: count || 0
        }
      })
    )

    return departmentsWithCounts as Department[]
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw error
  }
}

export const createDepartment = async (departmentData: {
  name: string
  code: string
  description?: string
  head_of_department_id?: string
  building?: string
  budget?: number
}): Promise<Department> => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert([departmentData])
      .select()
      .single()

    if (error) throw error
    return data as Department
  } catch (error) {
    console.error('Error creating department:', error)
    throw error
  }
}

// HR Statistics and Reports

export const getHRStatistics = async () => {
  try {
    const [
      { count: totalEmployees },
      { count: activeEmployees },
      { count: pendingLeaves },
      { count: approvedLeaves },
      { data: avgSalaryResult }
    ] = await Promise.all([
      supabase.from('employees').select('*', { count: 'exact', head: true }),
      supabase.from('employees').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('leave_records').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('leave_records').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('employees').select('salary').not('salary', 'is', null)
    ])

    const avgSalary = avgSalaryResult && avgSalaryResult.length > 0
      ? avgSalaryResult.reduce((sum, emp) => sum + (emp.salary || 0), 0) / avgSalaryResult.length
      : 0

    return {
      totalEmployees: totalEmployees || 0,
      activeEmployees: activeEmployees || 0,
      inactiveEmployees: (totalEmployees || 0) - (activeEmployees || 0),
      pendingLeaves: pendingLeaves || 0,
      approvedLeaves: approvedLeaves || 0,
      averageSalary: Math.round(avgSalary)
    }
  } catch (error) {
    console.error('Error fetching HR statistics:', error)
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      inactiveEmployees: 0,
      pendingLeaves: 0,
      approvedLeaves: 0,
      averageSalary: 0
    }
  }
}

// Get employees by department
export const getEmployeesByDepartment = async (departmentId: string) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users (
          full_name,
          email
        )
      `)
      .eq('department_id', departmentId)
      .eq('is_active', true)
      .order('position')

    if (error) throw error
    return data as Employee[]
  } catch (error) {
    console.error('Error fetching employees by department:', error)
    throw error
  }
}

// Get pending leave requests for manager
export const getPendingLeaveRequests = async (managerId: string) => {
  try {
    // Get employees managed by this manager
    const { data: managedEmployees, error: empError } = await supabase
      .from('employees')
      .select('id')
      .eq('manager_id', managerId)

    if (empError) throw empError

    const employeeIds = managedEmployees.map(emp => emp.id)

    if (employeeIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('leave_records')
      .select(`
        *,
        employee:employees (
          employee_id,
          position,
          user:users (
            full_name,
            email
          )
        )
      `)
      .in('employee_id', employeeIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as LeaveRecord[]
  } catch (error) {
    console.error('Error fetching pending leave requests:', error)
    throw error
  }
}

// Get leave balance for employee
export const getLeaveBalance = async (employeeId: string, year: number = new Date().getFullYear()) => {
  try {
    const { data, error } = await supabase
      .from('leave_records')
      .select('leave_type, days_requested')
      .eq('employee_id', employeeId)
      .eq('status', 'approved')
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`)

    if (error) throw error

    // Calculate used days by leave type
    const leaveBalance = data.reduce((acc: any, leave) => {
      const type = leave.leave_type
      acc[type] = (acc[type] || 0) + leave.days_requested
      return acc
    }, {})

    // Standard leave entitlements (can be configurable)
    const entitlements = {
      'Annual Leave': 21,
      'Sick Leave': 10,
      'Personal Leave': 5,
      'Maternity Leave': 90,
      'Paternity Leave': 10
    }

    // Calculate remaining balance
    const balanceInfo = Object.keys(entitlements).map(type => ({
      leave_type: type,
      entitled: entitlements[type as keyof typeof entitlements],
      used: leaveBalance[type] || 0,
      remaining: entitlements[type as keyof typeof entitlements] - (leaveBalance[type] || 0)
    }))

    return balanceInfo
  } catch (error) {
    console.error('Error fetching leave balance:', error)
    throw error
  }
}
