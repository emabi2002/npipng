'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../lib/auth/auth-context'
import {
  getBookLoans,
  getBooks,
  getLibraryMembers,
  createBookLoan,
  returnBook,
  renewBookLoan,
  getOverdueBooks,
  getLibraryStatistics,
  searchBooks,
  type BookLoan,
  type Book,
  type LibraryMember,
  type LoanFilters
} from '../../../../../lib/api/library'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card'
import { Button } from '../../../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs'
import { Badge } from '../../../../../components/ui/badge'
import { Input } from '../../../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../components/ui/dialog'
import { AdvancedSearch } from '../../../../../components/search/AdvancedSearch'
import {
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  RotateCcw,
  CalendarDays,
  Library,
  User,
  Printer,
  Download,
  Zap,
  ArrowRight
} from 'lucide-react'

export default function LibraryCirculationPage() {
  const { user, hasPermission } = useAuth()
  const [loans, setLoans] = useState<BookLoan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<LibraryMember[]>([])
  const [overdueBooks, setOverdueBooks] = useState<BookLoan[]>([])
  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    availableBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalMembers: 0
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LoanFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('loans')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null)
  const [loanDialog, setLoanDialog] = useState(false)
  const [returnDialog, setReturnDialog] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<BookLoan | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])

  useEffect(() => {
    loadData()
  }, [currentPage, filters, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load statistics
      const stats = await getLibraryStatistics()
      setStatistics(stats)

      // Load overdue books
      const overdue = await getOverdueBooks()
      setOverdueBooks(overdue)

      if (activeTab === 'loans') {
        const { data, totalPages: pages } = await getBookLoans(filters, currentPage, 20)
        setLoans(data)
        setTotalPages(pages)
      } else if (activeTab === 'books') {
        const { data, totalPages: pages } = await getBooks({}, currentPage, 20)
        setBooks(data)
        setTotalPages(pages)
      } else if (activeTab === 'members') {
        const { data, totalPages: pages } = await getLibraryMembers(currentPage, 20)
        setMembers(data)
        setTotalPages(pages)
      }
    } catch (error) {
      console.error('Error loading library data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLoan = async () => {
    if (!selectedBook || !selectedMember || !user) return

    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) // 2 weeks loan period

      await createBookLoan({
        book_id: selectedBook.id,
        member_id: selectedMember.id,
        due_date: dueDate.toISOString().split('T')[0],
        librarian_id: user.id
      })

      setLoanDialog(false)
      setSelectedBook(null)
      setSelectedMember(null)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error creating loan:', error)
    }
  }

  const handleReturnBook = async () => {
    if (!selectedLoan || !user) return

    try {
      await returnBook(selectedLoan.id, user.id)
      setReturnDialog(false)
      setSelectedLoan(null)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error returning book:', error)
    }
  }

  const handleRenewLoan = async (loan: BookLoan) => {
    try {
      const newDueDate = new Date()
      newDueDate.setDate(newDueDate.getDate() + 14) // Extend by 2 weeks

      await renewBookLoan(loan.id, newDueDate.toISOString().split('T')[0])
      loadData() // Refresh data
    } catch (error) {
      console.error('Error renewing loan:', error)
    }
  }

  const handleBookSearch = async (query: string) => {
    if (query.length > 2) {
      const results = await searchBooks(query, 10)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'returned':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'lost':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Library Circulation</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive book lending and member management system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {hasPermission('manage_library') && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setLoanDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Loan
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalBooks.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.availableBooks.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Loans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.activeLoans.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.overdueLoans.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalMembers.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for Overdue Books */}
        {overdueBooks.length > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-800">
                    Urgent: {overdueBooks.length} Overdue Books
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" className="border-red-200">
                  <Zap className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {overdueBooks.slice(0, 3).map((loan) => (
                  <div key={loan.id} className="bg-white p-3 rounded border border-red-200">
                    <h4 className="font-medium text-gray-900 text-sm">{loan.book?.title}</h4>
                    <p className="text-xs text-gray-600">{loan.member?.user?.full_name}</p>
                    <p className="text-xs text-red-600 font-medium">
                      {getDaysOverdue(loan.due_date)} days overdue
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-auto grid-cols-4">
                  <TabsTrigger value="loans" className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Active Loans</span>
                  </TabsTrigger>
                  <TabsTrigger value="overdue" className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Overdue ({overdueBooks.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="books" className="flex items-center space-x-2">
                    <Library className="w-4 h-4" />
                    <span>Book Catalog</span>
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-3">
                  <AdvancedSearch
                    onSearch={(searchFilters) => {
                      setFilters({
                        ...filters,
                        search: searchFilters.query,
                        status: searchFilters.status,
                        date_from: searchFilters.dateFrom,
                        date_to: searchFilters.dateTo
                      })
                      setCurrentPage(1)
                    }}
                    placeholder="Search loans..."
                    statusOptions={[
                      { value: 'active', label: 'Active' },
                      { value: 'returned', label: 'Returned' },
                      { value: 'overdue', label: 'Overdue' },
                      { value: 'lost', label: 'Lost' }
                    ]}
                  />
                </div>
              </div>

              {/* Active Loans Tab */}
              <TabsContent value="loans" className="space-y-4">
                <div className="space-y-4">
                  {loans.length > 0 ? (
                    <>
                      {loans.map((loan) => (
                        <Card key={loan.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {loan.book?.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      ISBN: {loan.book?.isbn} | Location: {loan.book?.location}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Member: {loan.member?.user?.full_name} ({loan.member?.member_id})
                                    </p>
                                  </div>
                                  <div>
                                    <Badge className={getStatusColor(loan.status)}>
                                      {loan.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Loan Date:</span>
                                    <div className="font-semibold">
                                      {new Date(loan.loan_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Due Date:</span>
                                    <div className="font-semibold">
                                      {new Date(loan.due_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Renewals:</span>
                                    <div className="font-semibold">{loan.renewal_count}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Fine:</span>
                                    <div className="font-semibold text-red-600">
                                      ${loan.fine_amount.toFixed(2)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Librarian:</span>
                                    <div className="font-semibold">
                                      {loan.librarian?.full_name || 'System'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedLoan(loan)
                                    setReturnDialog(true)
                                  }}
                                  disabled={loan.status !== 'active' || !hasPermission('manage_library')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Return
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRenewLoan(loan)}
                                  disabled={loan.status !== 'active' || loan.renewal_count >= 2 || !hasPermission('manage_library')}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Renew
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Pagination */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Showing page {currentPage} of {totalPages}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No active loans found</h3>
                      <p className="text-gray-600">No loans match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Overdue Books Tab */}
              <TabsContent value="overdue" className="space-y-4">
                <div className="space-y-4">
                  {overdueBooks.length > 0 ? (
                    overdueBooks.map((loan) => (
                      <Card key={loan.id} className="border-l-4 border-l-red-500 bg-red-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {loan.book?.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {loan.member?.user?.full_name} - {loan.member?.member_id}
                                  </p>
                                  <p className="text-xs text-red-600 font-medium">
                                    Overdue by {getDaysOverdue(loan.due_date)} days
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Due Date:</span>
                                  <div className="font-semibold text-red-600">
                                    {new Date(loan.due_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Fine Amount:</span>
                                  <div className="font-semibold text-red-600">
                                    ${loan.fine_amount.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Contact:</span>
                                  <div className="font-semibold">
                                    {loan.member?.user?.email || 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Renewals:</span>
                                  <div className="font-semibold">{loan.renewal_count}/2</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  setSelectedLoan(loan)
                                  setReturnDialog(true)
                                }}
                                disabled={!hasPermission('manage_library')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Force Return
                              </Button>
                              <Button size="sm" variant="outline">
                                Send Reminder
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue books</h3>
                      <p className="text-gray-600">All books are returned on time.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Books Tab */}
              <TabsContent value="books" className="space-y-4">
                <div className="space-y-4">
                  {books.length > 0 ? (
                    books.map((book) => (
                      <Card key={book.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {book.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {book.authors?.map(a => a.name).join(', ')} | {book.publisher}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ISBN: {book.isbn} | Category: {book.category?.name}
                                  </p>
                                </div>
                                <div>
                                  <Badge className={book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {book.available_copies > 0 ? 'Available' : 'Unavailable'}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Total Copies:</span>
                                  <div className="font-semibold">{book.total_copies}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Available:</span>
                                  <div className="font-semibold text-green-600">
                                    {book.available_copies}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Location:</span>
                                  <div className="font-semibold">{book.location}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Language:</span>
                                  <div className="font-semibold">{book.language}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Year:</span>
                                  <div className="font-semibold">{book.publication_year}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedBook(book)
                                  setLoanDialog(true)
                                }}
                                disabled={book.available_copies === 0 || !hasPermission('manage_library')}
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Loan Out
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                      <p className="text-gray-600">No books match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4">
                <div className="space-y-4">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <Card key={member.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {member.user?.full_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Member ID: {member.member_id} | Role: {member.user?.role}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Email: {member.user?.email}
                                  </p>
                                </div>
                                <div>
                                  <Badge className={member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {member.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Membership Type:</span>
                                  <div className="font-semibold">{member.membership_type}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Max Books:</span>
                                  <div className="font-semibold">{member.max_books}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Fine Amount:</span>
                                  <div className="font-semibold text-red-600">
                                    ${member.fine_amount.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Expiry:</span>
                                  <div className="font-semibold">
                                    {member.membership_expiry ? new Date(member.membership_expiry).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline">
                                <User className="w-4 h-4 mr-2" />
                                View History
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                      <p className="text-gray-600">No members match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Loan Dialog */}
        <Dialog open={loanDialog} onOpenChange={setLoanDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Book Loan</DialogTitle>
              <DialogDescription>
                Issue a book to a library member
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Book Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Select Book</label>
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleBookSearch(e.target.value)
                    }}
                    placeholder="Search books by title, ISBN, or author..."
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {searchResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    {searchResults.map((book) => (
                      <div
                        key={book.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${selectedBook?.id === book.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedBook(book)
                          setSearchResults([])
                          setSearchQuery(book.title)
                        }}
                      >
                        <div className="font-medium text-sm">{book.title}</div>
                        <div className="text-xs text-gray-600">
                          {book.authors?.map(a => a.name).join(', ')} | Available: {book.available_copies}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedBook && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">{selectedBook.title}</h4>
                    <p className="text-sm text-gray-600">
                      Available copies: {selectedBook.available_copies} | Location: {selectedBook.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Member Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Select Member</label>
                <Select onValueChange={(value) => {
                  const member = members.find(m => m.id === value)
                  setSelectedMember(member || null)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a library member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.user?.full_name} ({member.member_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMember && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900">{selectedMember.user?.full_name}</h4>
                    <p className="text-sm text-gray-600">
                      Max books: {selectedMember.max_books} | Current fines: ${selectedMember.fine_amount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
                  setLoanDialog(false)
                  setSelectedBook(null)
                  setSelectedMember(null)
                  setSearchQuery('')
                  setSearchResults([])
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateLoan}
                  disabled={!selectedBook || !selectedMember}
                >
                  Create Loan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Return Book Dialog */}
        <Dialog open={returnDialog} onOpenChange={setReturnDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Book</DialogTitle>
              <DialogDescription>
                Process book return for: {selectedLoan?.book?.title}
              </DialogDescription>
            </DialogHeader>

            {selectedLoan && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Book:</span>
                      <div className="font-semibold">{selectedLoan.book?.title}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Member:</span>
                      <div className="font-semibold">{selectedLoan.member?.user?.full_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className="font-semibold">{new Date(selectedLoan.due_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fine Amount:</span>
                      <div className="font-semibold text-red-600">
                        ${selectedLoan.fine_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setReturnDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReturnBook}>
                    Process Return
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
