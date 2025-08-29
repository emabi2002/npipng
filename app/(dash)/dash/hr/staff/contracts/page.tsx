export default function HRStaffContractsPage() {
  return (
    <div className="panel p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Contracts Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create New Contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Active Contracts</h3>
          <p className="text-2xl font-bold text-blue-900">235</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Expiring Soon</h3>
          <p className="text-2xl font-bold text-green-900">12</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">Pending Renewal</h3>
          <p className="text-2xl font-bold text-orange-900">8</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Expired</h3>
          <p className="text-2xl font-bold text-red-900">3</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search contracts..."
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <select className="border border-slate-300 rounded-lg px-3 py-2">
              <option>All Contract Types</option>
              <option>Permanent</option>
              <option>Fixed-term</option>
              <option>Part-time</option>
              <option>Consultancy</option>
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2">
              <option>All Status</option>
              <option>Active</option>
              <option>Expiring</option>
              <option>Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contract Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">Dr. Sarah Johnson</div>
                  <div className="text-sm text-slate-500">EMP001</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Permanent</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Jan 15, 2020</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">$85,000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                  <button className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                  <button className="text-orange-600 hover:text-orange-900">Renew</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">Prof. Michael Chen</div>
                  <div className="text-sm text-slate-500">EMP002</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Fixed-term</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Sep 1, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Aug 31, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">$92,000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Expiring Soon
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                  <button className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                  <button className="text-orange-600 hover:text-orange-900">Renew</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
