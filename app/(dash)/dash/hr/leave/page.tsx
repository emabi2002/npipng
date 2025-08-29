import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function HRLeavePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="hr" />
      <RedTabs module="hr" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Leave Management</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Leave Requests</h3>
              <p className="text-sm text-blue-700">Review and manage leave applications from staff</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Leave Balances</h3>
              <p className="text-sm text-green-700">Monitor staff leave balances and entitlements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Pending Requests</h3>
              <p className="text-2xl font-bold text-orange-900">8</p>
              <p className="text-sm text-orange-700">Awaiting approval</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Approved Today</h3>
              <p className="text-2xl font-bold text-green-900">3</p>
              <p className="text-sm text-green-700">Requests approved</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">On Leave Now</h3>
              <p className="text-2xl font-bold text-blue-900">12</p>
              <p className="text-sm text-blue-700">Staff currently away</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">This Month</h3>
              <p className="text-2xl font-bold text-purple-900">45</p>
              <p className="text-sm text-purple-700">Total leave days taken</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Leave Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Dr. Sarah Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Annual Leave</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 19, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button className="text-green-600 hover:text-green-900 mr-2">Approve</button>
                      <button className="text-red-600 hover:text-red-900">Reject</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Ms. Emily Rodriguez</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Sick Leave</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 10, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 12, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">3</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
