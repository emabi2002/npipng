import TopSubNav from "@/components/nav/TopSubNav";

export default function HousingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="welfare" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Housing Services</h1>
          <p className="text-slate-600 mb-6">Accommodation services and residential support for students</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Hostel Application</h3>
                <p className="text-sm text-blue-700 mb-3">Apply for on-campus accommodation</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  Apply Now
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Room Allocation</h3>
                <p className="text-sm text-green-700 mb-3">View current room assignments and roommates</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  View Assignment
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Maintenance Requests</h3>
                <p className="text-sm text-purple-700 mb-3">Report room maintenance issues</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                  Submit Request
                </button>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Housing Fees</h3>
                <p className="text-sm text-orange-700 mb-3">View and pay accommodation fees</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                  Pay Fees
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Available Hostels</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Male Hostel A</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Male Hostel B</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Limited</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Female Hostel A</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Female Hostel B</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Full</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Housing Rules</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Quiet hours: 10 PM - 6 AM</li>
                  <li>• No visitors after 9 PM</li>
                  <li>• Keep common areas clean</li>
                  <li>• Report damages immediately</li>
                  <li>• No alcohol or smoking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
