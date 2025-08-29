import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function FinanceReportsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="finance" />
      <RedTabs module="finance" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Financial Reports</h1>
              <p className="text-slate-600">Generate and view financial reports and analytics</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Generate Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Revenue Reports</h3>
              <p className="text-sm text-blue-700 mb-3">Income analysis and revenue tracking</p>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                View Reports
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Collections Reports</h3>
              <p className="text-sm text-green-700 mb-3">Payment collections and outstanding dues</p>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                View Reports
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">A/R Aging</h3>
              <p className="text-sm text-purple-700 mb-3">Accounts receivable aging analysis</p>
              <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                View Reports
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Monthly Revenue Trend</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">January 2025</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">$425K</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">December 2024</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{width: '95%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">$475K</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">November 2024</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{width: '78%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">$390K</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">October 2024</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div className="bg-orange-600 h-3 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">$360K</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">September 2024</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div className="bg-teal-600 h-3 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">$500K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Available Reports</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Student Fee Summary</h4>
                    <p className="text-sm text-slate-600">Comprehensive fee collection report</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Generate
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Outstanding Balances</h4>
                    <p className="text-sm text-slate-600">Students with pending payments</p>
                  </div>
                  <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                    Generate
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Scholarship Report</h4>
                    <p className="text-sm text-slate-600">Financial aid and scholarships</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Generate
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Daily Cash Flow</h4>
                    <p className="text-sm text-slate-600">Daily financial transactions</p>
                  </div>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    Generate
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Department Revenue</h4>
                    <p className="text-sm text-slate-600">Revenue breakdown by department</p>
                  </div>
                  <button className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
                    Generate
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700">
                      Export to PDF
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700">
                      Export to Excel
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
