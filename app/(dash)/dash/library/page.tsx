import TopSubNav from "@/components/nav/TopSubNav";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="library" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Library Management</h1>
          <p className="text-slate-600 mb-6">Comprehensive library services and resource management</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-3 text-xl">Book Catalog</h3>
              <p className="text-blue-700 mb-4">Search, browse, and manage library collections and resources</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Total Books:</span>
                  <span className="font-semibold text-blue-900">12,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Digital Resources:</span>
                  <span className="font-semibold text-blue-900">3,245</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-3 text-xl">Book Loans</h3>
              <p className="text-green-700 mb-4">Manage book lending, returns, and loan tracking</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Active Loans:</span>
                  <span className="font-semibold text-green-900">2,574</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Overdue Items:</span>
                  <span className="font-semibold text-green-900">126</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Library Statistics</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Daily visitors: 450+</li>
                <li>• Weekly borrowings: 1,200+</li>
                <li>• Student satisfaction: 95%</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Popular Services</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Book reservations</li>
                <li>• Research assistance</li>
                <li>• Digital archives</li>
              </ul>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-teal-900 mb-2">Library Hours</h4>
              <div className="text-sm text-teal-700 space-y-1">
                <p>Mon-Fri: 8AM - 9PM</p>
                <p>Saturday: 9AM - 6PM</p>
                <p>Sunday: 12PM - 8PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
