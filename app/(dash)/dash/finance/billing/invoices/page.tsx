'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../../../lib/auth/auth-context'
import {
  getInvoices,
  getPayments,
  createPayment,
  getFinancialStatistics,
  getOverdueInvoices,
  type Invoice,
  type Payment,
  type FinanceFilters
} from '../../../../../../lib/api/finance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../../components/ui/card'
import { Button } from '../../../../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../../components/ui/tabs'
import { Badge } from '../../../../../../components/ui/badge'
import { Input } from '../../../../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../../components/ui/dialog'
import { AdvancedSearch } from '../../../../../../components/search/AdvancedSearch'
import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Search,
  Plus,
  FileText,
  Calendar,
  User,
  Filter,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function FinanceBillingPage() {
  const { user, hasPermission } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [statistics, setStatistics] = useState({
    totalInvoiced: 0,
    totalCollected: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    collectionRate: 0,
    totalInvoices: 0,
    totalPayments: 0
  })
  const [overdueInvoices, setOverdueInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FinanceFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('invoices')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    loadData()
  }, [currentPage, filters, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load statistics
      const stats = await getFinancialStatistics()
      setStatistics(stats)

      // Load overdue invoices
      const overdue = await getOverdueInvoices()
      setOverdueInvoices(overdue)

      if (activeTab === 'invoices') {
        const { data, totalPages: pages } = await getInvoices(filters, currentPage, 20)
        setInvoices(data)
        setTotalPages(pages)
      } else if (activeTab === 'payments') {
        const { data, totalPages: pages } = await getPayments(filters, currentPage, 20)
        setPayments(data)
        setTotalPages(pages)
      }
    } catch (error) {
      console.error('Error loading finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedInvoice || !paymentAmount || !paymentMethod || !user) return

    try {
      await createPayment({
        invoice_id: selectedInvoice.id,
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
        processed_by: user.id,
        notes: `Payment processed via ${paymentMethod}`
      })

      setPaymentDialog(false)
      setPaymentAmount('')
      setPaymentMethod('')
      setSelectedInvoice(null)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const calculateTotalPaid = (invoice: Invoice) => {
    return invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  }

  const calculateBalance = (invoice: Invoice) => {
    return invoice.net_amount - calculateTotalPaid(invoice)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Finance & Billing</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive financial management and billing operations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {hasPermission('manage_finance') && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${statistics.totalInvoiced.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Total Collected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${statistics.totalCollected.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${statistics.pendingAmount.toLocaleString()}
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
                    ${statistics.overdueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Rate & Quick Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Collection Performance</h3>
                <p className="text-sm text-gray-600">Overall financial performance metrics</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {statistics.collectionRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Collection Rate</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{statistics.totalInvoices}</div>
                <p className="text-sm text-gray-600">Total Invoices</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{statistics.totalPayments}</div>
                <p className="text-sm text-gray-600">Payments Received</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
                <p className="text-sm text-gray-600">Overdue Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-auto grid-cols-3">
                  <TabsTrigger value="invoices" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Invoices</span>
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Payments</span>
                  </TabsTrigger>
                  <TabsTrigger value="overdue" className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Overdue ({overdueInvoices.length})</span>
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
                    placeholder="Search invoices..."
                    statusOptions={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'paid', label: 'Paid' },
                      { value: 'overdue', label: 'Overdue' },
                      { value: 'cancelled', label: 'Cancelled' }
                    ]}
                  />
                </div>
              </div>

              {/* Invoices Tab */}
              <TabsContent value="invoices" className="space-y-4">
                <div className="space-y-4">
                  {invoices.length > 0 ? (
                    <>
                      {invoices.map((invoice) => (
                        <Card key={invoice.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      Invoice #{invoice.invoice_number}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {invoice.student?.user?.full_name} - {invoice.student?.student_id}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {invoice.student?.program?.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Badge className={getStatusColor(invoice.status)}>
                                      {invoice.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Amount:</span>
                                    <div className="font-semibold">${invoice.net_amount.toFixed(2)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Paid:</span>
                                    <div className="font-semibold text-green-600">
                                      ${calculateTotalPaid(invoice).toFixed(2)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Balance:</span>
                                    <div className="font-semibold text-red-600">
                                      ${calculateBalance(invoice).toFixed(2)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Due Date:</span>
                                    <div className="font-semibold">
                                      {new Date(invoice.due_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Fee Type:</span>
                                    <div className="font-semibold">{invoice.fee_structure?.name}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedInvoice(invoice)
                                    setPaymentDialog(true)
                                  }}
                                  disabled={invoice.status === 'paid' || !hasPermission('manage_finance')}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Record Payment
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print
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
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                      <p className="text-gray-600">No invoices match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <div className="space-y-4">
                  {payments.length > 0 ? (
                    <>
                      {payments.map((payment) => (
                        <Card key={payment.id} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      Payment #{payment.payment_reference}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Invoice #{payment.invoice?.invoice_number}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {payment.invoice?.student?.user?.full_name}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Amount:</span>
                                    <div className="font-semibold text-green-600">
                                      ${payment.amount.toFixed(2)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Method:</span>
                                    <div className="font-semibold">{payment.payment_method}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Date:</span>
                                    <div className="font-semibold">
                                      {new Date(payment.payment_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Processed By:</span>
                                    <div className="font-semibold">
                                      {payment.processed_by_user?.full_name || 'System'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Button size="sm" variant="outline">
                                  <Printer className="w-4 h-4 mr-2" />
                                  Receipt
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                      <p className="text-gray-600">No payments match your current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Overdue Tab */}
              <TabsContent value="overdue" className="space-y-4">
                <div className="space-y-4">
                  {overdueInvoices.length > 0 ? (
                    overdueInvoices.map((invoice) => (
                      <Card key={invoice.id} className="border-l-4 border-l-red-500 bg-red-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    Invoice #{invoice.invoice_number}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {invoice.student?.user?.full_name} - {invoice.student?.student_id}
                                  </p>
                                  <p className="text-xs text-red-600 font-medium">
                                    Overdue by {Math.floor((Date.now() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))} days
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Amount Due:</span>
                                  <div className="font-semibold text-red-600">
                                    ${calculateBalance(invoice).toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Total Amount:</span>
                                  <div className="font-semibold">${invoice.net_amount.toFixed(2)}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Due Date:</span>
                                  <div className="font-semibold text-red-600">
                                    {new Date(invoice.due_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Contact:</span>
                                  <div className="font-semibold">{invoice.student?.user?.phone || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setPaymentDialog(true)
                                }}
                                disabled={!hasPermission('manage_finance')}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Urgent Payment
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue invoices</h3>
                      <p className="text-gray-600">All invoices are current and up to date.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Record a payment for Invoice #{selectedInvoice?.invoice_number}
              </DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Student:</span>
                      <div className="font-semibold">{selectedInvoice.student?.user?.full_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Balance Due:</span>
                      <div className="font-semibold text-red-600">
                        ${calculateBalance(selectedInvoice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Amount</label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                      max={calculateBalance(selectedInvoice)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={!paymentAmount || !paymentMethod}
                  >
                    Record Payment
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
