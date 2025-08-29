import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function PlacementsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="industry" />
      <RedTabs module="industry" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Student Placements</h1>
              <p className="text-slate-600">Manage internships, jobs, and career opportunities</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add New Placement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Total Placements</h3>
              <p className="text-2xl font-bold text-blue-900">127</p>
              <p className="text-sm text-blue-600">+15 this month</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">Internships</h3>
              <p className="text-2xl font-bold text-green-900">89</p>
              <p className="text-sm text-green-600">70% of total</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-1">Full-time Jobs</h3>
              <p className="text-2xl font-bold text-purple-900">38</p>
              <p className="text-sm text-purple-600">30% of total</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-1">Success Rate</h3>
              <p className="text-2xl font-bold text-orange-900">87%</p>
              <p className="text-sm text-orange-600">Above target</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Recent Placements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">Sarah Johnson</div>
                      <div className="text-sm text-slate-500">Computer Science</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Tech Solutions Ltd</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Software Developer</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Internship
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">Michael Chen</div>
                      <div className="text-sm text-slate-500">Mechanical Engineering</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Industrial Corp</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Design Engineer</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Full-time
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
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
