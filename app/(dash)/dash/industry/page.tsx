import TopSubNav from "@/components/nav/TopSubNav";

export default function IndustryPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="industry" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Industry Relations</h1>
          <p className="text-slate-600 mb-6">Connect students with industry opportunities and manage employer partnerships</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-3 text-xl">Student Placements</h3>
              <p className="text-blue-700 mb-4">Manage internships, job placements, and career opportunities for students</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Active Placements:</span>
                  <span className="font-semibold text-blue-900">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">This Month:</span>
                  <span className="font-semibold text-blue-900">23 New</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-3 text-xl">Employer Partners</h3>
              <p className="text-green-700 mb-4">Build and maintain relationships with industry employers and partners</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Active Partners:</span>
                  <span className="font-semibold text-green-900">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">New This Quarter:</span>
                  <span className="font-semibold text-green-900">7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Upcoming Events</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Career Fair - March 15</li>
                <li>• Tech Symposium - March 22</li>
                <li>• Alumni Networking - April 5</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Top Industries</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Information Technology</li>
                <li>• Engineering & Manufacturing</li>
                <li>• Healthcare & Pharmaceuticals</li>
              </ul>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-teal-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full bg-teal-600 text-white py-1 px-3 rounded text-sm hover:bg-teal-700">
                  Post Job Opening
                </button>
                <button className="w-full bg-teal-600 text-white py-1 px-3 rounded text-sm hover:bg-teal-700">
                  Schedule Company Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
