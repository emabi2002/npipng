import TopSubNav from "@/components/nav/TopSubNav";

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="finance" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Finance Management</h1>
          <p className="text-slate-600 mb-6">Comprehensive financial management and billing system</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-3 text-xl">Finance Overview</h3>
              <p className="text-blue-700 mb-4">Financial dashboard with key performance indicators and metrics</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Total Revenue:</span>
                  <span className="font-semibold text-blue-900">$2.4M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Outstanding:</span>
                  <span className="font-semibold text-blue-900">$340K</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-3 text-xl">Billing System</h3>
              <p className="text-green-700 mb-4">Manage invoices, payments, and student fee structures</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Active Invoices:</span>
                  <span className="font-semibold text-green-900">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">This Month:</span>
                  <span className="font-semibold text-green-900">156 Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-3 text-xl">Financial Reports</h3>
              <p className="text-purple-700 mb-4">Generate comprehensive financial reports and analytics</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-600">Collection Rate:</span>
                  <span className="font-semibold text-purple-900">86%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-600">Reports Generated:</span>
                  <span className="font-semibold text-purple-900">23</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Recent Transactions</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Tuition payment - $2,500</li>
                <li>• Lab fee - $150</li>
                <li>• Library fine - $25</li>
              </ul>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-teal-900 mb-2">Payment Methods</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Bank Transfer (65%)</li>
                <li>• Online Payment (25%)</li>
                <li>• Cash (10%)</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700">
                  Generate Invoice
                </button>
                <button className="w-full bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700">
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
