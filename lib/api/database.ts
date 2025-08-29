import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export type Tables = Database['public']['Tables'];
export type Student = Tables['students']['Row'];
export type Employee = Tables['employees']['Row'];
export type Course = Tables['courses']['Row'];
export type Book = Tables['books']['Row'];
export type BookLoan = Tables['book_loans']['Row'];
export type Invoice = Tables['invoices']['Row'];
export type Payment = Tables['payments']['Row'];
export type Notification = Tables['notifications']['Row'];

class DatabaseService {
  private supabase = createClientComponentClient<Database>();

  // =============================================
  // GENERIC CRUD OPERATIONS
  // =============================================

  async create<T>(table: string, data: Partial<T>): Promise<{ data: T | null; error: any }> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data as any)
        .select()
        .single();

      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async read<T>(
    table: string,
    filters?: Record<string, any>,
    select?: string,
    orderBy?: { column: string; ascending?: boolean }
  ): Promise<{ data: T[] | null; error: any }> {
    try {
      let query = this.supabase.from(table).select(select || '*');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async delete(table: string, id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // =============================================
  // STUDENT MANAGEMENT
  // =============================================

  async getStudents(filters?: {
    program_id?: string;
    semester?: number;
    is_active?: boolean;
    search?: string;
  }) {
    let query = this.supabase
      .from('students')
      .select(`
        *,
        users (full_name, email, phone, avatar_url),
        programs (name, code, degree_type)
      `);

    if (filters?.program_id) {
      query = query.eq('program_id', filters.program_id);
    }
    if (filters?.semester) {
      query = query.eq('current_semester', filters.semester);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.search) {
      query = query.or(`
        student_id.ilike.%${filters.search}%,
        users.full_name.ilike.%${filters.search}%,
        users.email.ilike.%${filters.search}%
      `);
    }

    return query.order('created_at', { ascending: false });
  }

  async getStudentById(id: string) {
    return this.supabase
      .from('students')
      .select(`
        *,
        users (full_name, email, phone, avatar_url, address, date_of_birth, gender),
        programs (name, code, degree_type, department_id, departments (name))
      `)
      .eq('id', id)
      .single();
  }

  async updateStudentCGPA(studentId: string) {
    const { data } = await this.supabase.rpc('calculate_student_cgpa', {
      student_uuid: studentId
    });

    if (data !== null) {
      await this.supabase
        .from('students')
        .update({ cgpa: data })
        .eq('id', studentId);
    }

    return data;
  }

  // =============================================
  // EMPLOYEE MANAGEMENT
  // =============================================

  async getEmployees(filters?: {
    department_id?: string;
    position_id?: string;
    status?: string;
    search?: string;
  }) {
    let query = this.supabase
      .from('employees')
      .select(`
        *,
        users (full_name, email, phone, avatar_url),
        departments (name, code),
        positions (title, description)
      `);

    if (filters?.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    if (filters?.position_id) {
      query = query.eq('position_id', filters.position_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`
        employee_id.ilike.%${filters.search}%,
        users.full_name.ilike.%${filters.search}%,
        users.email.ilike.%${filters.search}%
      `);
    }

    return query.order('created_at', { ascending: false });
  }

  async getEmployeeById(id: string) {
    return this.supabase
      .from('employees')
      .select(`
        *,
        users (full_name, email, phone, avatar_url, address, date_of_birth, gender),
        departments (name, code),
        positions (title, description, salary_range_min, salary_range_max),
        supervisor:employees!reports_to (users (full_name))
      `)
      .eq('id', id)
      .single();
  }

  // =============================================
  // COURSE MANAGEMENT
  // =============================================

  async getCourses(filters?: {
    department_id?: string;
    level?: number;
    is_active?: boolean;
    search?: string;
  }) {
    let query = this.supabase
      .from('courses')
      .select(`
        *,
        departments (name, code)
      `);

    if (filters?.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.search) {
      query = query.or(`
        code.ilike.%${filters.search}%,
        title.ilike.%${filters.search}%
      `);
    }

    return query.order('code');
  }

  async getCourseOfferings(filters?: {
    semester?: string;
    year?: number;
    course_id?: string;
    instructor_id?: string;
  }) {
    let query = this.supabase
      .from('course_offerings')
      .select(`
        *,
        courses (code, title, credits),
        instructor:users (full_name, email)
      `);

    if (filters?.semester) {
      query = query.eq('semester', filters.semester);
    }
    if (filters?.year) {
      query = query.eq('year', filters.year);
    }
    if (filters?.course_id) {
      query = query.eq('course_id', filters.course_id);
    }
    if (filters?.instructor_id) {
      query = query.eq('instructor_id', filters.instructor_id);
    }

    return query.order('created_at', { ascending: false });
  }

  async getEnrollments(filters?: {
    student_id?: string;
    course_offering_id?: string;
    status?: string;
  }) {
    let query = this.supabase
      .from('enrollments')
      .select(`
        *,
        students (student_id, users (full_name)),
        course_offerings (
          semester, year,
          courses (code, title, credits)
        )
      `);

    if (filters?.student_id) {
      query = query.eq('student_id', filters.student_id);
    }
    if (filters?.course_offering_id) {
      query = query.eq('course_offering_id', filters.course_offering_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    return query.order('enrollment_date', { ascending: false });
  }

  // =============================================
  // LIBRARY MANAGEMENT
  // =============================================

  async getBooks(filters?: {
    category?: string;
    is_active?: boolean;
    available_only?: boolean;
    search?: string;
  }) {
    let query = this.supabase
      .from('books')
      .select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.available_only) {
      query = query.gt('available_copies', 0);
    }
    if (filters?.search) {
      query = query.or(`
        title.ilike.%${filters.search}%,
        author.ilike.%${filters.search}%,
        isbn.ilike.%${filters.search}%,
        call_number.ilike.%${filters.search}%
      `);
    }

    return query.order('title');
  }

  async getBookLoans(filters?: {
    member_id?: string;
    book_id?: string;
    status?: string;
    overdue?: boolean;
  }) {
    let query = this.supabase
      .from('book_loans')
      .select(`
        *,
        books (title, author, isbn, call_number),
        library_members (
          member_id,
          users (full_name, email)
        )
      `);

    if (filters?.member_id) {
      query = query.eq('member_id', filters.member_id);
    }
    if (filters?.book_id) {
      query = query.eq('book_id', filters.book_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.overdue) {
      query = query.lt('due_date', new Date().toISOString().split('T')[0]);
      query = query.eq('status', 'active');
    }

    return query.order('loan_date', { ascending: false });
  }

  async issueBook(bookId: string, memberId: string, dueDate: string) {
    // Check book availability
    const { data: book } = await this.supabase
      .from('books')
      .select('available_copies')
      .eq('id', bookId)
      .single();

    if (!book || book.available_copies <= 0) {
      return { error: { message: 'Book not available' } };
    }

    // Create loan record
    const { data: loan, error: loanError } = await this.supabase
      .from('book_loans')
      .insert({
        book_id: bookId,
        member_id: memberId,
        due_date: dueDate,
        status: 'active'
      })
      .select()
      .single();

    if (loanError) {
      return { error: loanError };
    }

    // Update book availability
    await this.supabase
      .from('books')
      .update({
        available_copies: book.available_copies - 1
      })
      .eq('id', bookId);

    return { data: loan, error: null };
  }

  async returnBook(loanId: string) {
    const { data: loan } = await this.supabase
      .from('book_loans')
      .select('book_id, due_date')
      .eq('id', loanId)
      .single();

    if (!loan) {
      return { error: { message: 'Loan not found' } };
    }

    // Calculate fine if overdue
    const today = new Date();
    const dueDate = new Date(loan.due_date);
    let fineAmount = 0;

    if (today > dueDate) {
      const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fineAmount = daysOverdue * 0.50; // $0.50 per day
    }

    // Update loan record
    const { error: updateError } = await this.supabase
      .from('book_loans')
      .update({
        return_date: today.toISOString().split('T')[0],
        fine_amount: fineAmount,
        status: 'returned'
      })
      .eq('id', loanId);

    if (updateError) {
      return { error: updateError };
    }

    // Update book availability
    const { data: book } = await this.supabase
      .from('books')
      .select('available_copies')
      .eq('id', loan.book_id)
      .single();

    if (book) {
      await this.supabase
        .from('books')
        .update({
          available_copies: book.available_copies + 1
        })
        .eq('id', loan.book_id);
    }

    return { error: null };
  }

  // =============================================
  // FINANCE MANAGEMENT
  // =============================================

  async getInvoices(filters?: {
    student_id?: string;
    semester?: string;
    status?: string;
    academic_year?: string;
  }) {
    let query = this.supabase
      .from('invoices')
      .select(`
        *,
        students (
          student_id,
          users (full_name, email),
          programs (name, code)
        )
      `);

    if (filters?.student_id) {
      query = query.eq('student_id', filters.student_id);
    }
    if (filters?.semester) {
      query = query.eq('semester', filters.semester);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.academic_year) {
      query = query.eq('academic_year', filters.academic_year);
    }

    return query.order('created_at', { ascending: false });
  }

  async getPayments(filters?: {
    student_id?: string;
    invoice_id?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
  }) {
    let query = this.supabase
      .from('payments')
      .select(`
        *,
        students (
          student_id,
          users (full_name, email)
        ),
        invoices (invoice_number, total_amount)
      `);

    if (filters?.student_id) {
      query = query.eq('student_id', filters.student_id);
    }
    if (filters?.invoice_id) {
      query = query.eq('invoice_id', filters.invoice_id);
    }
    if (filters?.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }
    if (filters?.start_date) {
      query = query.gte('payment_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('payment_date', filters.end_date);
    }

    return query.order('payment_date', { ascending: false });
  }

  async processPayment(paymentData: {
    invoice_id: string;
    student_id: string;
    amount: number;
    payment_method: string;
    transaction_id?: string;
    bank_name?: string;
    voucher_number?: string;
  }) {
    // Create payment record
    const { data: payment, error: paymentError } = await this.supabase
      .from('payments')
      .insert({
        ...paymentData,
        payment_reference: `PAY-${Date.now()}`,
        status: 'completed'
      })
      .select()
      .single();

    if (paymentError) {
      return { error: paymentError };
    }

    // Update invoice paid amount
    const { data: invoice } = await this.supabase
      .from('invoices')
      .select('paid_amount, total_amount')
      .eq('id', paymentData.invoice_id)
      .single();

    if (invoice) {
      const newPaidAmount = invoice.paid_amount + paymentData.amount;
      const newBalance = invoice.total_amount - newPaidAmount;
      let newStatus = 'pending';

      if (newBalance <= 0) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partial';
      }

      await this.supabase
        .from('invoices')
        .update({
          paid_amount: newPaidAmount,
          balance_amount: newBalance,
          status: newStatus
        })
        .eq('id', paymentData.invoice_id);
    }

    return { data: payment, error: null };
  }

  // =============================================
  // NOTIFICATIONS
  // =============================================

  async getNotifications(userId: string, unreadOnly: boolean = false) {
    let query = this.supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    return query.order('created_at', { ascending: false });
  }

  async createNotification(notification: {
    recipient_id: string;
    title: string;
    message: string;
    type?: string;
    category?: string;
    action_url?: string;
    data?: any;
  }) {
    return this.supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
  }

  async markNotificationAsRead(notificationId: string) {
    return this.supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);
  }

  // =============================================
  // ANALYTICS & REPORTING
  // =============================================

  async getDashboardStats() {
    const [
      studentsCount,
      employeesCount,
      coursesCount,
      activeLoanCount,
      overdueLoansCount,
      pendingInvoicesCount
    ] = await Promise.all([
      this.supabase.from('students').select('id', { count: 'exact' }).eq('is_active', true),
      this.supabase.from('employees').select('id', { count: 'exact' }).eq('status', 'active'),
      this.supabase.from('courses').select('id', { count: 'exact' }).eq('is_active', true),
      this.supabase.from('book_loans').select('id', { count: 'exact' }).eq('status', 'active'),
      this.supabase.from('book_loans').select('id', { count: 'exact' }).eq('status', 'active').lt('due_date', new Date().toISOString()),
      this.supabase.from('invoices').select('id', { count: 'exact' }).in('status', ['pending', 'partial'])
    ]);

    return {
      students: studentsCount.count || 0,
      employees: employeesCount.count || 0,
      courses: coursesCount.count || 0,
      activeLoans: activeLoanCount.count || 0,
      overdueLoans: overdueLoansCount.count || 0,
      pendingInvoices: pendingInvoicesCount.count || 0
    };
  }

  // =============================================
  // SEARCH FUNCTIONALITY
  // =============================================

  async globalSearch(query: string, modules: string[] = ['students', 'employees', 'courses', 'books']) {
    const results: any = {};

    if (modules.includes('students')) {
      const { data: students } = await this.supabase
        .from('students')
        .select('id, student_id, users (full_name, email)')
        .or(`student_id.ilike.%${query}%, users.full_name.ilike.%${query}%`)
        .limit(5);
      results.students = students || [];
    }

    if (modules.includes('employees')) {
      const { data: employees } = await this.supabase
        .from('employees')
        .select('id, employee_id, users (full_name, email)')
        .or(`employee_id.ilike.%${query}%, users.full_name.ilike.%${query}%`)
        .limit(5);
      results.employees = employees || [];
    }

    if (modules.includes('courses')) {
      const { data: courses } = await this.supabase
        .from('courses')
        .select('id, code, title')
        .or(`code.ilike.%${query}%, title.ilike.%${query}%`)
        .limit(5);
      results.courses = courses || [];
    }

    if (modules.includes('books')) {
      const { data: books } = await this.supabase
        .from('books')
        .select('id, title, author, isbn')
        .or(`title.ilike.%${query}%, author.ilike.%${query}%, isbn.ilike.%${query}%`)
        .limit(5);
      results.books = books || [];
    }

    return results;
  }
}

export const db = new DatabaseService();
