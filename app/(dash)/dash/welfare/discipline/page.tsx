import TopSubNav from "@/components/nav/TopSubNav";

export default function DisciplinePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="welfare" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Student Discipline</h1>
          <p className="text-slate-600 mb-6">Student conduct management and disciplinary procedures</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Incident Reporting</h3>
                <p className="text-sm text-red-700 mb-3">Report disciplinary incidents and violations</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                  Report Incident
                </button>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Case Management</h3>
                <p className="text-sm text-orange-700 mb-3">Track and manage disciplinary cases</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                  View Cases
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Appeals Process</h3>
                <p className="text-sm text-blue-700 mb-3">Submit appeals for disciplinary decisions</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  Submit Appeal
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Counselling Programs</h3>
                <p className="text-sm text-green-700 mb-3">Rehabilitation and counselling services</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  View Programs
                </button>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Code of Conduct</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Academic honesty</li>
                  <li>• Respectful behavior</li>
                  <li>• Campus safety rules</li>
                  <li>• Technology usage policy</li>
                  <li>• Dress code guidelines</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Need Help?</h3>
                <p className="text-sm text-yellow-700 mb-2">Contact the Student Affairs Office</p>
                <p className="text-sm font-medium text-yellow-900">studentaffairs@npipng.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
