import TopSubNav from "@/components/nav/TopSubNav";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="setup" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">System Setup</h1>
          <p className="text-slate-600 mb-6">Configure and manage system-wide settings and organizational structure</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Organisation</h3>
              <p className="text-sm text-blue-700">Configure institutional details, departments, and organizational hierarchy</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Academic Terms</h3>
              <p className="text-sm text-green-700">Manage academic years, semesters, and term configurations</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-2">Users & Roles</h3>
              <p className="text-sm text-purple-700">Manage user accounts, permissions, and role-based access control</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-2">Modules</h3>
              <p className="text-sm text-orange-700">Configure system modules and feature availability</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Connection</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Backup System</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Warning</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Security Updates</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Current</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-3">Quick Setup Tasks</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Configure academic calendar
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Set up department structure
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Import user accounts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Configure email templates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
