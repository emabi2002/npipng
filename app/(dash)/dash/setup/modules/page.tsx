import TopSubNav from "@/components/nav/TopSubNav";

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="setup" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">System Modules</h1>
              <p className="text-slate-600">Configure system modules and feature availability</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Academic Management</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-blue-700 mb-3">Student records, course management, grading system</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Student Registration
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Course Management
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Grading System
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Transcript Generation
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-900">Finance & Billing</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-green-700 mb-3">Fee management, payments, financial reporting</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Fee Structure
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Online Payments
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Invoice Generation
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Scholarship Management
                  </label>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple-900">HR & Payroll</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-purple-700 mb-3">Staff management, payroll, leave tracking</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Employee Records
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Payroll Processing
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Leave Management
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Performance Reviews
                  </label>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-orange-900">Student Welfare</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-orange-700 mb-3">Health services, counselling, housing, discipline</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Health Services
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Counselling Services
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Housing Management
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Discipline Tracking
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-teal-900">Library Management</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-teal-700 mb-3">Book catalog, lending, digital resources</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Book Catalog
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Lending System
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Digital Library
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Reservation System
                  </label>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-indigo-900">Industry Relations</h3>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-indigo-700 mb-3">Placements, internships, industry partnerships</p>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Job Placements
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Internship Programs
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Company Partnerships
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Alumni Network
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">System Features</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Email Notifications
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    SMS Notifications
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Report Generation
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Data Backup
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded mr-2" />
                    Multi-language Support
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="rounded mr-2" />
                    Audit Logging
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Module Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Modules:</span>
                    <span className="font-semibold text-green-600">6 of 8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Features Enabled:</span>
                    <span className="font-semibold text-blue-600">18 of 24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>License Usage:</span>
                    <span className="font-semibold text-orange-600">75%</span>
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
