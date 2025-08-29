import TopSubNav from "@/components/nav/TopSubNav";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="setup" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Academic Terms</h1>
              <p className="text-slate-600">Manage academic years, semesters, and term schedules</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add New Term
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Current Academic Year: 2024/2025</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Year Start</label>
                    <input
                      type="date"
                      defaultValue="2024-09-01"
                      className="w-full px-3 py-2 border border-blue-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Year End</label>
                    <input
                      type="date"
                      defaultValue="2025-07-31"
                      className="w-full px-3 py-2 border border-blue-200 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Semester Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Semester</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          Semester 1
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Sept 1, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Jan 31, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          Semester 2
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Feb 3, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">July 31, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Upcoming
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Important Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Registration Opens</label>
                    <input
                      type="date"
                      defaultValue="2024-08-15"
                      className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Registration Closes</label>
                    <input
                      type="date"
                      defaultValue="2024-09-15"
                      className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Add/Drop Deadline</label>
                    <input
                      type="date"
                      defaultValue="2024-09-30"
                      className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Withdrawal Deadline</label>
                    <input
                      type="date"
                      defaultValue="2024-11-30"
                      className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">Examination Schedule</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Mid-term Exams</label>
                    <input
                      type="date"
                      defaultValue="2024-11-15"
                      className="w-full px-3 py-2 border border-purple-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Final Exams Start</label>
                    <input
                      type="date"
                      defaultValue="2025-01-15"
                      className="w-full px-3 py-2 border border-purple-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Final Exams End</label>
                    <input
                      type="date"
                      defaultValue="2025-01-31"
                      className="w-full px-3 py-2 border border-purple-200 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3">Academic Calendar</h3>
                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 mb-2">
                  Download Calendar
                </button>
                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                  Publish Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
