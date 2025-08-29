export default function HRLeaveRequestsPage() {
  return (
    <div className="panel p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Leave Requests</h2>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Bulk Approve
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-yellow-900">8</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Approved</h3>
          <p className="text-2xl font-bold text-green-900">45</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Rejected</h3>
          <p className="text-2xl font-bold text-red-900">3</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-blue-900">56</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search requests..."
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <select className="border border-slate-300 rounded-lg px-3 py-2">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2">
              <option>All Leave Types</option>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Maternity Leave</option>
              <option>Emergency Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">Dr. Sarah Johnson</div>
                  <div className="text-sm text-slate-500">Computer Science</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Annual Leave</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 15, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Mar 19, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Family vacation</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-2">Approve</button>
                  <button className="text-red-600 hover:text-red-900 mr-2">Reject</button>
                  <button className="text-blue-600 hover:text-blue-900">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
