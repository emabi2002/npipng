import TopSubNav from "@/components/nav/TopSubNav";

export default function CounsellingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="welfare" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Counselling Services</h1>
          <p className="text-slate-600 mb-6">Professional counselling and psychological support services</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Academic Counselling</h3>
                <p className="text-sm text-blue-700 mb-3">Guidance on course selection, study plans, and academic progress</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  Book Session
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Personal Counselling</h3>
                <p className="text-sm text-green-700 mb-3">Individual support for personal and emotional challenges</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  Schedule Appointment
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Career Guidance</h3>
                <p className="text-sm text-purple-700 mb-3">Professional advice on career paths and job opportunities</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                  Get Guidance
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Available Services</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Individual counselling sessions</li>
                  <li>• Group therapy programs</li>
                  <li>• Stress management workshops</li>
                  <li>• Study skills development</li>
                  <li>• Crisis intervention support</li>
                  <li>• Peer counselling programs</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Emergency Support</h3>
                <p className="text-sm text-yellow-700 mb-3">24/7 crisis support hotline available</p>
                <p className="text-lg font-bold text-yellow-900">+234-XXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
