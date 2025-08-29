import { createClient } from '../supabase/client'

const supabase = createClient()

export interface Book {
  id: string
  isbn?: string
  title: string
  subtitle?: string
  publisher?: string
  publication_year?: number
  pages?: number
  language: string
  category_id?: string
  description?: string
  location?: string
  total_copies: number
  available_copies: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  category?: {
    name: string
    code: string
  }
  authors?: {
    name: string
    biography?: string
  }[]
}

export interface BookLoan {
  id: string
  book_id: string
  member_id: string
  loan_date: string
  due_date: string
  return_date?: string
  status: 'active' | 'returned' | 'overdue' | 'lost'
  fine_amount: number
  renewal_count: number
  librarian_id?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  book?: {
    title: string
    isbn?: string
    location?: string
  }
  member?: {
    member_id: string
    user?: {
      full_name: string
      email: string
    }
  }
  librarian?: {
    full_name: string
  }
}

export interface LibraryMember {
  id: string
  user_id: string
  member_id: string
  membership_type: string
  max_books: number
  membership_expiry?: string
  fine_amount: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    full_name: string
    email: string
    phone?: string
    role: string
  }
}

export interface BookFilters {
  category_id?: string
  language?: string
  available_only?: boolean
  search?: string
  author?: string
}

export interface LoanFilters {
  member_id?: string
  status?: string
  overdue_only?: boolean
  search?: string
}

// Book Management

export const getBooks = async (
  filters: BookFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('books')
      .select(`
        *,
        category:book_categories (
          name,
          code
        ),
        book_authors (
          author:authors (
            name,
            biography
          )
        )
      `)

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters.language) {
      query = query.eq('language', filters.language)
    }
    if (filters.available_only) {
      query = query.gt('available_copies', 0)
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,isbn.ilike.%${filters.search}%,publisher.ilike.%${filters.search}%`
      )
    }

    query = query.eq('is_active', true)

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    // Transform the data to include authors array
    const transformedData = data?.map(book => ({
      ...book,
      authors: book.book_authors?.map((ba: any) => ba.author) || []
    }))

    return {
      data: transformedData as Book[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        category:book_categories (
          name,
          code,
          description
        ),
        book_authors (
          author:authors (
            name,
            biography,
            birth_date,
            nationality
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Transform the data
    const transformedData = {
      ...data,
      authors: data.book_authors?.map((ba: any) => ba.author) || []
    }

    return transformedData as Book
  } catch (error) {
    console.error('Error fetching book:', error)
    return null
  }
}

export const createBook = async (bookData: Partial<Book>): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert([bookData])
      .select(`
        *,
        category:book_categories (
          name,
          code
        )
      `)
      .single()

    if (error) throw error
    return data as Book
  } catch (error) {
    console.error('Error creating book:', error)
    throw error
  }
}

export const updateBook = async (id: string, updates: Partial<Book>): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:book_categories (
          name,
          code
        )
      `)
      .single()

    if (error) throw error
    return data as Book
  } catch (error) {
    console.error('Error updating book:', error)
    throw error
  }
}

// Library Member Management

export const getLibraryMembers = async (
  page: number = 1,
  limit: number = 20,
  search?: string
) => {
  try {
    let query = supabase
      .from('library_members')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          role
        )
      `)

    if (search) {
      query = query.or(
        `member_id.ilike.%${search}%,user.full_name.ilike.%${search}%,user.email.ilike.%${search}%`
      )
    }

    query = query.eq('is_active', true)

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as LibraryMember[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching library members:', error)
    throw error
  }
}

export const getLibraryMemberByUserId = async (userId: string): Promise<LibraryMember | null> => {
  try {
    const { data, error } = await supabase
      .from('library_members')
      .select(`
        *,
        user:users (
          full_name,
          email,
          phone,
          role
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data as LibraryMember
  } catch (error) {
    console.error('Error fetching library member:', error)
    return null
  }
}

// Book Loan Management

export const getBookLoans = async (
  filters: LoanFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('book_loans')
      .select(`
        *,
        book:books (
          title,
          isbn,
          location
        ),
        member:library_members (
          member_id,
          user:users (
            full_name,
            email
          )
        ),
        librarian:users (
          full_name
        )
      `)

    // Apply filters
    if (filters.member_id) {
      query = query.eq('member_id', filters.member_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.overdue_only) {
      query = query.eq('status', 'overdue')
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('loan_date', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as BookLoan[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching book loans:', error)
    throw error
  }
}

export const createBookLoan = async (loanData: {
  book_id: string
  member_id: string
  due_date: string
  librarian_id: string
}): Promise<BookLoan> => {
  try {
    // Check if book is available
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('available_copies, total_copies')
      .eq('id', loanData.book_id)
      .single()

    if (bookError) throw bookError
    if (!book || book.available_copies <= 0) {
      throw new Error('Book is not available for loan')
    }

    // Create the loan
    const { data, error } = await supabase
      .from('book_loans')
      .insert([{
        ...loanData,
        loan_date: new Date().toISOString().split('T')[0],
        status: 'active'
      }])
      .select(`
        *,
        book:books (
          title,
          isbn,
          location
        ),
        member:library_members (
          member_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as BookLoan
  } catch (error) {
    console.error('Error creating book loan:', error)
    throw error
  }
}

export const returnBook = async (loanId: string, librarian_id: string): Promise<BookLoan> => {
  try {
    const { data, error } = await supabase
      .from('book_loans')
      .update({
        return_date: new Date().toISOString().split('T')[0],
        status: 'returned',
        librarian_id
      })
      .eq('id', loanId)
      .select(`
        *,
        book:books (
          title,
          isbn,
          location
        ),
        member:library_members (
          member_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as BookLoan
  } catch (error) {
    console.error('Error returning book:', error)
    throw error
  }
}

export const renewBookLoan = async (loanId: string, newDueDate: string): Promise<BookLoan> => {
  try {
    const { data, error } = await supabase
      .from('book_loans')
      .update({
        due_date: newDueDate,
        renewal_count: supabase.raw('renewal_count + 1')
      })
      .eq('id', loanId)
      .select(`
        *,
        book:books (
          title,
          isbn,
          location
        ),
        member:library_members (
          member_id,
          user:users (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error
    return data as BookLoan
  } catch (error) {
    console.error('Error renewing book loan:', error)
    throw error
  }
}

// Get overdue books
export const getOverdueBooks = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('book_loans')
      .select(`
        *,
        book:books (
          title,
          isbn
        ),
        member:library_members (
          member_id,
          user:users (
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('status', 'active')
      .lt('due_date', today)
      .order('due_date')

    if (error) throw error
    return data as BookLoan[]
  } catch (error) {
    console.error('Error fetching overdue books:', error)
    throw error
  }
}

// Get book categories
export const getBookCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('book_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching book categories:', error)
    throw error
  }
}

// Library statistics
export const getLibraryStatistics = async () => {
  try {
    const [
      { count: totalBooks },
      { count: availableBooks },
      { count: activeLoans },
      { count: overdueLoans },
      { count: totalMembers }
    ] = await Promise.all([
      supabase.from('books').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('books').select('*', { count: 'exact', head: true }).gt('available_copies', 0),
      supabase.from('book_loans').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('book_loans').select('*', { count: 'exact', head: true }).eq('status', 'overdue'),
      supabase.from('library_members').select('*', { count: 'exact', head: true }).eq('is_active', true)
    ])

    return {
      totalBooks: totalBooks || 0,
      availableBooks: availableBooks || 0,
      activeLoans: activeLoans || 0,
      overdueLoans: overdueLoans || 0,
      totalMembers: totalMembers || 0
    }
  } catch (error) {
    console.error('Error fetching library statistics:', error)
    return {
      totalBooks: 0,
      availableBooks: 0,
      activeLoans: 0,
      overdueLoans: 0,
      totalMembers: 0
    }
  }
}

// Search books with full-text search
export const searchBooks = async (searchTerm: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        category:book_categories (
          name,
          code
        ),
        book_authors (
          author:authors (
            name
          )
        )
      `)
      .or(
        `title.ilike.%${searchTerm}%,isbn.ilike.%${searchTerm}%,publisher.ilike.%${searchTerm}%`
      )
      .eq('is_active', true)
      .limit(limit)

    if (error) throw error

    // Transform the data
    const transformedData = data?.map(book => ({
      ...book,
      authors: book.book_authors?.map((ba: any) => ba.author) || []
    }))

    return transformedData as Book[]
  } catch (error) {
    console.error('Error searching books:', error)
    throw error
  }
}
