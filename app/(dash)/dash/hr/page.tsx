import TopSubNav from "@/components/nav/TopSubNav";

export default function HRPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="hr" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">HR & Payroll Management</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Overview</h3>
              <p className="text-sm text-blue-700">HR dashboard and key metrics</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Staff Management</h3>
              <p className="text-sm text-green-700">Manage staff profiles and contracts</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-2">Leave Management</h3>
              <p className="text-sm text-orange-700">Handle leave requests and balances</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-2">Payroll</h3>
              <p className="text-sm text-purple-700">Process payroll and generate payslips</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add New Staff Member
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Process Monthly Payroll
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                Review Leave Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
