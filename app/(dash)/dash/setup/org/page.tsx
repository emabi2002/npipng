import TopSubNav from "@/components/nav/TopSubNav";

export default function OrgPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="setup" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Organisation Setup</h1>
              <p className="text-slate-600">Configure institutional details and organizational structure</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Institution Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      defaultValue="National Polytechnic Institute"
                      className="w-full px-3 py-2 border border-blue-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Short Name</label>
                    <input
                      type="text"
                      defaultValue="NPIPNG"
                      className="w-full px-3 py-2 border border-blue-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Address</label>
                    <textarea
                      rows={3}
                      defaultValue="P.O. Box 1234, Port Moresby, Papua New Guinea"
                      className="w-full px-3 py-2 border border-blue-200 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Phone</label>
                      <input
                        type="text"
                        defaultValue="+675 123 4567"
                        className="w-full px-3 py-2 border border-blue-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="info@npipng.edu.pg"
                        className="w-full px-3 py-2 border border-blue-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Academic Structure</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Academic Year Format</label>
                    <select className="w-full px-3 py-2 border border-green-200 rounded-md">
                      <option>2024/2025</option>
                      <option>2024-2025</option>
                      <option>AY 2024-25</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Semester System</label>
                    <select className="w-full px-3 py-2 border border-green-200 rounded-md">
                      <option>Two Semesters</option>
                      <option>Three Semesters</option>
                      <option>Four Quarters</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Grading System</label>
                    <select className="w-full px-3 py-2 border border-green-200 rounded-md">
                      <option>Letter Grades (A-F)</option>
                      <option>Percentage (0-100)</option>
                      <option>GPA (0-4.0)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">Departments</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-sm font-medium">Computer Science & IT</span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-sm font-medium">Mechanical Engineering</span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-sm font-medium">Electrical Engineering</span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-sm font-medium">Business Administration</span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-sm font-medium">Applied Sciences</span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                </div>
                <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                  Add Department
                </button>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3">System Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">Enable Online Payments</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">Student Self-Registration</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">SMS Notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">Multi-language Support</span>
                    <input type="checkbox" className="rounded" />
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
