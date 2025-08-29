import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="setup" />
      <RedTabs module="setup" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Users & Roles</h1>
              <p className="text-slate-600">Manage user accounts and role-based access control</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add User
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Manage Roles
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-blue-900">1,247</p>
              <p className="text-sm text-blue-600">+25 this month</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">Active Users</h3>
              <p className="text-2xl font-bold text-green-900">1,189</p>
              <p className="text-sm text-green-600">95% active rate</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-1">Admin Users</h3>
              <p className="text-2xl font-bold text-purple-900">23</p>
              <p className="text-sm text-purple-600">System admins</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-1">Pending Approval</h3>
              <p className="text-2xl font-bold text-orange-900">8</p>
              <p className="text-sm text-orange-600">Require review</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">User Management</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-3 py-1 border border-slate-300 rounded text-sm"
                    />
                    <select className="px-3 py-1 border border-slate-300 rounded text-sm">
                      <option>All Roles</option>
                      <option>Students</option>
                      <option>Faculty</option>
                      <option>Staff</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">John Administrator</div>
                          <div className="text-sm text-slate-500">ID: ADM001</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">john.admin@npipng.edu</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            System Admin
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Disable</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">Dr. Sarah Johnson</div>
                          <div className="text-sm text-slate-500">ID: FAC012</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">s.johnson@npipng.edu</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Faculty
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Disable</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">Michael Chen</div>
                          <div className="text-sm text-slate-500">ID: STU2024001</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">m.chen.2024@student.npipng.edu</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Student
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                          <button className="text-red-600 hover:text-red-900">Reject</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">User Roles</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">System Admin</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Faculty</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Staff</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Students</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">1068</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Bulk Actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-sm">
                    Import Users (CSV)
                  </button>
                  <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-sm">
                    Export User List
                  </button>
                  <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-sm">
                    Send Welcome Emails
                  </button>
                  <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-sm">
                    Reset Passwords
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
