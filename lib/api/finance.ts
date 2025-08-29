import { createClient } from '../supabase/client'

const supabase = createClient()

export interface Invoice {
  id: string
  invoice_number: string
  student_id: string
  fee_structure_id: string
  amount: number
  discount_amount: number
  net_amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  student?: {
    student_id: string
    user?: {
      full_name: string
      email: string
      phone?: string
    }
    program?: {
      name: string
      code: string
    }
  }
  fee_structure?: {
    name: string
    tuition_fee: number
    lab_fee: number
    library_fee: number
    miscellaneous_fee: number
    total_fee: number
  }
  payments?: Payment[]
}

export interface Payment {
  id: string
  payment_reference: string
  invoice_id: string
  amount: number
  payment_method: string
  payment_date: string
  transaction_id?: string
  processed_by?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  processed_by_user?: {
    full_name: string
  }
}

export interface FeeStructure {
  id: string
  name: string
  program_id?: string
  semester_id?: string
  tuition_fee: number
  lab_fee: number
  library_fee: number
  miscellaneous_fee: number
  total_fee: number
  due_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  program?: {
    name: string
    code: string
  }
  semester?: {
    name: string
    code: string
  }
}

export interface Scholarship {
  id: string
  name: string
  description?: string
  amount?: number
  percentage?: number
  eligibility_criteria?: string
  application_deadline?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudentScholarship {
  id: string
  student_id: string
  scholarship_id: string
  amount_awarded: number
  semester_id?: string
  status: 'active' | 'suspended' | 'completed'
  awarded_date: string
  created_at: string
  updated_at: string
  // Joined data
  scholarship?: Scholarship
  student?: {
    student_id: string
    user?: {
      full_name: string
    }
  }
  semester?: {
    name: string
    code: string
  }
}

export interface FinanceFilters {
  student_id?: string
  status?: string
  program_id?: string
  semester_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

// Invoice Management

export const getInvoices = async (
  filters: FinanceFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        student:students (
          student_id,
          user:users (
            full_name,
            email,
            phone
          ),
          program:programs (
            name,
            code
          )
        ),
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

    // Apply filters
    if (filters.student_id) {
      query = query.eq('student_id', filters.student_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    if (filters.search) {
      query = query.or(
        `invoice_number.ilike.%${filters.search}%,student.student_id.ilike.%${filters.search}%,student.user.full_name.ilike.%${filters.search}%`
      )
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Invoice[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        student:students (
          student_id,
          year_level,
          section,
          user:users (
            full_name,
            email,
            phone,
            address
          ),
          program:programs (
            name,
            code,
            degree_type
          )
        ),
        fee_structure:fee_structures (
          name,
          tuition_fee,
          lab_fee,
          library_fee,
          miscellaneous_fee,
          total_fee,
          semester:semesters (
            name,
            code,
            academic_year
          )
        ),
        payments (
          *,
          processed_by_user:users!processed_by (
            full_name
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Invoice
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return null
  }
}

export const createInvoice = async (invoiceData: {
  student_id: string
  fee_structure_id: string
  amount: number
  discount_amount?: number
  due_date: string
  notes?: string
}): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([{
        ...invoiceData,
        discount_amount: invoiceData.discount_amount || 0
      }])
      .select(`
        *,
        student:students (
          student_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as Invoice
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        student:students (
          student_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as Invoice
  } catch (error) {
    console.error('Error updating invoice:', error)
    throw error
  }
}

// Payment Management

export const getPayments = async (
  filters: { invoice_id?: string; date_from?: string; date_to?: string } = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('payments')
      .select(`
        *,
        invoice:invoices (
          invoice_number,
          student:students (
            student_id,
            user:users (
              full_name
            )
          )
        ),
        processed_by_user:users!processed_by (
          full_name
        )
      `)

    if (filters.invoice_id) {
      query = query.eq('invoice_id', filters.invoice_id)
    }
    if (filters.date_from) {
      query = query.gte('payment_date', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('payment_date', filters.date_to)
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('payment_date', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Payment[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
    throw error
  }
}

export const createPayment = async (paymentData: {
  invoice_id: string
  amount: number
  payment_method: string
  payment_date?: string
  transaction_id?: string
  processed_by: string
  notes?: string
}): Promise<Payment> => {
  try {
    // Start a transaction to create payment and update invoice
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        ...paymentData,
        payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
        payment_reference: `PAY-${Date.now()}`
      }])
      .select()
      .single()

    if (paymentError) throw paymentError

    // Check if invoice is fully paid
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('net_amount, payments(amount)')
      .eq('id', paymentData.invoice_id)
      .single()

    if (invoiceError) throw invoiceError

    const totalPaid = invoice.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0
    const newTotalPaid = totalPaid + paymentData.amount

    // Update invoice status if fully paid
    if (newTotalPaid >= invoice.net_amount) {
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', paymentData.invoice_id)
    }

    return payment as Payment
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}

// Fee Structure Management

export const getFeeStructures = async (programId?: string, semesterId?: string) => {
  try {
    let query = supabase
      .from('fee_structures')
      .select(`
        *,
        program:programs (
          name,
          code
        ),
        semester:semesters (
          name,
          code,
          academic_year
        )
      `)

    if (programId) {
      query = query.eq('program_id', programId)
    }
    if (semesterId) {
      query = query.eq('semester_id', semesterId)
    }

    query = query.eq('is_active', true)
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data as FeeStructure[]
  } catch (error) {
    console.error('Error fetching fee structures:', error)
    throw error
  }
}

export const createFeeStructure = async (feeData: Partial<FeeStructure>): Promise<FeeStructure> => {
  try {
    const { data, error } = await supabase
      .from('fee_structures')
      .insert([feeData])
      .select(`
        *,
        program:programs (
          name,
          code
        ),
        semester:semesters (
          name,
          code
        )
      `)
      .single()

    if (error) throw error
    return data as FeeStructure
  } catch (error) {
    console.error('Error creating fee structure:', error)
    throw error
  }
}

// Scholarship Management

export const getScholarships = async (activeOnly: boolean = true) => {
  try {
    let query = supabase
      .from('scholarships')
      .select('*')

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    query = query.order('name')

    const { data, error } = await query

    if (error) throw error
    return data as Scholarship[]
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    throw error
  }
}

export const getStudentScholarships = async (studentId?: string) => {
  try {
    let query = supabase
      .from('student_scholarships')
      .select(`
        *,
        scholarship:scholarships (
          name,
          description,
          amount,
          percentage
        ),
        student:students (
          student_id,
          user:users (
            full_name
          )
        ),
        semester:semesters (
          name,
          code,
          academic_year
        )
      `)

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    query = query.order('awarded_date', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data as StudentScholarship[]
  } catch (error) {
    console.error('Error fetching student scholarships:', error)
    throw error
  }
}

// Financial Statistics and Reports

export const getFinancialStatistics = async (filters: {
  start_date?: string
  end_date?: string
  program_id?: string
} = {}) => {
  try {
    let invoiceQuery = supabase
      .from('invoices')
      .select('status, net_amount, created_at')

    let paymentQuery = supabase
      .from('payments')
      .select('amount, payment_date')

    if (filters.start_date) {
      invoiceQuery = invoiceQuery.gte('created_at', filters.start_date)
      paymentQuery = paymentQuery.gte('payment_date', filters.start_date)
    }
    if (filters.end_date) {
      invoiceQuery = invoiceQuery.lte('created_at', filters.end_date)
      paymentQuery = paymentQuery.lte('payment_date', filters.end_date)
    }

    const [invoicesResult, paymentsResult] = await Promise.all([
      invoiceQuery,
      paymentQuery
    ])

    if (invoicesResult.error) throw invoicesResult.error
    if (paymentsResult.error) throw paymentsResult.error

    const invoices = invoicesResult.data || []
    const payments = paymentsResult.data || []

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.net_amount, 0)
    const totalCollected = payments.reduce((sum, pay) => sum + pay.amount, 0)
    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.net_amount, 0)
    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.net_amount, 0)

    return {
      totalInvoiced,
      totalCollected,
      pendingAmount,
      overdueAmount,
      collectionRate: totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0,
      totalInvoices: invoices.length,
      totalPayments: payments.length
    }
  } catch (error) {
    console.error('Error fetching financial statistics:', error)
    return {
      totalInvoiced: 0,
      totalCollected: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      collectionRate: 0,
      totalInvoices: 0,
      totalPayments: 0
    }
  }
}

// Get overdue invoices
export const getOverdueInvoices = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        student:students (
          student_id,
          user:users (
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date')

    if (error) throw error
    return data as Invoice[]
  } catch (error) {
    console.error('Error fetching overdue invoices:', error)
    throw error
  }
}

// Generate bulk invoices for a semester
export const generateBulkInvoices = async (
  semesterId: string,
  feeStructureId: string,
  dueDate: string
) => {
  try {
    // Get all enrolled students for the semester
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        course_section:course_sections (
          semester_id
        )
      `)
      .eq('course_section.semester_id', semesterId)
      .eq('status', 'enrolled')

    if (enrollmentError) throw enrollmentError

    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map(e => e.student_id))]

    // Get fee structure details
    const { data: feeStructure, error: feeError } = await supabase
      .from('fee_structures')
      .select('total_fee')
      .eq('id', feeStructureId)
      .single()

    if (feeError) throw feeError

    // Create invoices for all students
    const invoiceData = studentIds.map(studentId => ({
      student_id: studentId,
      fee_structure_id: feeStructureId,
      amount: feeStructure.total_fee,
      due_date: dueDate,
      status: 'pending'
    }))

    const { data, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error generating bulk invoices:', error)
    throw error
  }
}
