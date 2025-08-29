import TopSubNav from "@/components/nav/TopSubNav";

export default function FinanceOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="finance" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Finance Overview</h1>
          <p className="text-slate-600 mb-6">Financial dashboard and key performance indicators</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-900">$2.4M</p>
              <p className="text-sm text-green-600">+12% from last year</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Outstanding Fees</h3>
              <p className="text-2xl font-bold text-blue-900">$340K</p>
              <p className="text-sm text-blue-600">14% of total fees</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-1">Collections Rate</h3>
              <p className="text-2xl font-bold text-purple-900">86%</p>
              <p className="text-sm text-purple-600">Above target</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-1">Scholarships</h3>
              <p className="text-2xl font-bold text-orange-900">$125K</p>
              <p className="text-sm text-orange-600">189 recipients</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Tuition Payment</p>
                    <p className="text-sm text-green-600">Student ID: STU2024001</p>
                  </div>
                  <span className="font-bold text-green-900">+$2,500</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Lab Fee</p>
                    <p className="text-sm text-green-600">Student ID: STU2024045</p>
                  </div>
                  <span className="font-bold text-green-900">+$150</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Scholarship Disbursement</p>
                    <p className="text-sm text-red-600">Merit Award</p>
                  </div>
                  <span className="font-bold text-red-900">-$1,000</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Library Fine</p>
                    <p className="text-sm text-green-600">Student ID: STU2024012</p>
                  </div>
                  <span className="font-bold text-green-900">+$25</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Payment Methods</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bank Transfer</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">65%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Online Payment</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cash</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '8%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">8%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Installments</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '2%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">2%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                      Generate Invoice
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm">
                      Record Payment
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm">
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
