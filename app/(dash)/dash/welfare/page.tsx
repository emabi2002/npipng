import TopSubNav from "@/components/nav/TopSubNav";

export default function WelfarePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="welfare" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Student Welfare Services</h1>
          <p className="text-slate-600 mb-6">Comprehensive welfare support and services for student well-being</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Health Services</h3>
              <p className="text-sm text-blue-700">Medical care, clinic visits, and health monitoring</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Counselling</h3>
              <p className="text-sm text-green-700">Psychological support and academic counselling services</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-2">Discipline</h3>
              <p className="text-sm text-orange-700">Student conduct management and disciplinary procedures</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-2">Housing</h3>
              <p className="text-sm text-purple-700">Accommodation services and residential support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
