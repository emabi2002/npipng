import { createClient } from '../supabase/client'
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns'

const supabase = createClient()

// Types for analytics data
export interface DashboardMetrics {
  students: {
    total: number
    active: number
    newThisMonth: number
    graduatingThisYear: number
  }
  finance: {
    totalRevenue: number
    pendingPayments: number
    collectionRate: number
    overdueFees: number
  }
  library: {
    totalBooks: number
    activeLoans: number
    overdueBooks: number
    popularBooks: Array<{ title: string; loans: number }>
  }
  hr: {
    totalStaff: number
    activeStaff: number
    onLeave: number
    pendingLeaves: number
  }
}

export interface ChartData {
  date: string
  value: number
  label?: string
}

export interface ModuleAnalytics {
  enrollmentTrend: ChartData[]
  financialPerformance: ChartData[]
  libraryUsage: ChartData[]
  staffPerformance: ChartData[]
}

// Get dashboard overview metrics
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  try {
    // Student metrics
    const { data: students } = await supabase
      .from('students')
      .select('id, enrollment_date, status, graduation_year')

    const totalStudents = students?.length || 0
    const activeStudents = students?.filter(s => s.status === 'active').length || 0
    const newThisMonth = students?.filter(s =>
      new Date(s.enrollment_date) >= monthStart && new Date(s.enrollment_date) <= monthEnd
    ).length || 0
    const graduatingThisYear = students?.filter(s =>
      s.graduation_year === currentDate.getFullYear()
    ).length || 0

    // Financial metrics
    const { data: invoices } = await supabase
      .from('invoices')
      .select('amount, status, due_date')

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0
    const pendingPayments = invoices?.filter(inv => inv.status === 'pending').length || 0
    const overdueInvoices = invoices?.filter(inv =>
      inv.status === 'pending' && new Date(inv.due_date) < currentDate
    ) || []
    const overdueFees = overdueInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0
    const collectionRate = invoices?.length ? (paidInvoices / invoices.length) * 100 : 0

    // Library metrics
    const { data: books } = await supabase
      .from('books')
      .select('id, title')

    const { data: loans } = await supabase
      .from('book_loans')
      .select('id, book_id, due_date, return_date, books(title)')

    const totalBooks = books?.length || 0
    const activeLoans = loans?.filter(loan => !loan.return_date).length || 0
    const overdueBooks = loans?.filter(loan =>
      !loan.return_date && new Date(loan.due_date) < currentDate
    ).length || 0

    // Popular books (top 5 most loaned)
    const bookLoanCounts = loans?.reduce((acc, loan) => {
      const title = loan.books?.title || 'Unknown'
      acc[title] = (acc[title] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const popularBooks = Object.entries(bookLoanCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([title, loans]) => ({ title, loans }))

    // HR metrics
    const { data: employees } = await supabase
      .from('employees')
      .select('id, status')

    const { data: leaveRequests } = await supabase
      .from('leave_requests')
      .select('id, status, start_date, end_date')

    const totalStaff = employees?.length || 0
    const activeStaff = employees?.filter(emp => emp.status === 'active').length || 0
    const currentlyOnLeave = leaveRequests?.filter(leave => {
      const start = new Date(leave.start_date)
      const end = new Date(leave.end_date)
      return leave.status === 'approved' && start <= currentDate && end >= currentDate
    }).length || 0
    const pendingLeaves = leaveRequests?.filter(leave => leave.status === 'pending').length || 0

    return {
      students: {
        total: totalStudents,
        active: activeStudents,
        newThisMonth,
        graduatingThisYear
      },
      finance: {
        totalRevenue,
        pendingPayments,
        collectionRate,
        overdueFees
      },
      library: {
        totalBooks,
        activeLoans,
        overdueBooks,
        popularBooks
      },
      hr: {
        totalStaff,
        activeStaff,
        onLeave: currentlyOnLeave,
        pendingLeaves
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    // Return default metrics on error
    return {
      students: { total: 0, active: 0, newThisMonth: 0, graduatingThisYear: 0 },
      finance: { totalRevenue: 0, pendingPayments: 0, collectionRate: 0, overdueFees: 0 },
      library: { totalBooks: 0, activeLoans: 0, overdueBooks: 0, popularBooks: [] },
      hr: { totalStaff: 0, activeStaff: 0, onLeave: 0, pendingLeaves: 0 }
    }
  }
}

// Get enrollment trend data for charts
export async function getEnrollmentTrend(days = 30): Promise<ChartData[]> {
  try {
    const { data } = await supabase
      .from('students')
      .select('enrollment_date')
      .gte('enrollment_date', format(subDays(new Date(), days), 'yyyy-MM-dd'))
      .order('enrollment_date')

    // Group by date and count enrollments
    const enrollmentByDate = data?.reduce((acc, student) => {
      const date = format(new Date(student.enrollment_date), 'MMM dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(enrollmentByDate).map(([date, value]) => ({
      date,
      value
    }))
  } catch (error) {
    console.error('Error fetching enrollment trend:', error)
    return []
  }
}

// Get financial performance data
export async function getFinancialTrend(months = 6): Promise<ChartData[]> {
  try {
    const { data } = await supabase
      .from('invoices')
      .select('amount, created_at, status')
      .gte('created_at', format(subMonths(new Date(), months), 'yyyy-MM-dd'))
      .order('created_at')

    // Group by month and sum amounts
    const revenueByMonth = data?.reduce((acc, invoice) => {
      const month = format(new Date(invoice.created_at), 'MMM yyyy')
      if (invoice.status === 'paid') {
        acc[month] = (acc[month] || 0) + (invoice.amount || 0)
      }
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(revenueByMonth).map(([date, value]) => ({
      date,
      value
    }))
  } catch (error) {
    console.error('Error fetching financial trend:', error)
    return []
  }
}

// Get library usage statistics
export async function getLibraryUsage(days = 30): Promise<ChartData[]> {
  try {
    const { data } = await supabase
      .from('book_loans')
      .select('loan_date')
      .gte('loan_date', format(subDays(new Date(), days), 'yyyy-MM-dd'))
      .order('loan_date')

    // Group by date and count loans
    const loansByDate = data?.reduce((acc, loan) => {
      const date = format(new Date(loan.loan_date), 'MMM dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(loansByDate).map(([date, value]) => ({
      date,
      value
    }))
  } catch (error) {
    console.error('Error fetching library usage:', error)
    return []
  }
}

// Get staff performance metrics
export async function getStaffMetrics(): Promise<ChartData[]> {
  try {
    const { data } = await supabase
      .from('employees')
      .select('department_id, status, departments(name)')

    // Group by department and count active staff
    const staffByDepartment = data?.reduce((acc, employee) => {
      const dept = employee.departments?.name || 'Unknown'
      if (employee.status === 'active') {
        acc[dept] = (acc[dept] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(staffByDepartment).map(([date, value]) => ({
      date,
      value
    }))
  } catch (error) {
    console.error('Error fetching staff metrics:', error)
    return []
  }
}

// Get comprehensive module analytics
export async function getModuleAnalytics(): Promise<ModuleAnalytics> {
  try {
    const [enrollmentTrend, financialPerformance, libraryUsage, staffPerformance] = await Promise.all([
      getEnrollmentTrend(),
      getFinancialTrend(),
      getLibraryUsage(),
      getStaffMetrics()
    ])

    return {
      enrollmentTrend,
      financialPerformance,
      libraryUsage,
      staffPerformance
    }
  } catch (error) {
    console.error('Error fetching module analytics:', error)
    return {
      enrollmentTrend: [],
      financialPerformance: [],
      libraryUsage: [],
      staffPerformance: []
    }
  }
}

// Get real-time updates subscription
export function subscribeToAnalytics(callback: () => void) {
  const channels = [
    supabase.channel('students').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, callback),
    supabase.channel('invoices').on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, callback),
    supabase.channel('book_loans').on('postgres_changes', { event: '*', schema: 'public', table: 'book_loans' }, callback),
    supabase.channel('employees').on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, callback)
  ]

  channels.forEach(channel => channel.subscribe())

  return () => {
    channels.forEach(channel => supabase.removeChannel(channel))
  }
}
