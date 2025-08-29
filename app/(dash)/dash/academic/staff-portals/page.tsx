import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function StaffPortalsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="academic" />
      <RedTabs module="academic" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Staff Portals</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Teaching Schedules</h3>
              <p className="text-sm text-blue-700">View and manage teaching timetables</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Materials</h3>
              <p className="text-sm text-green-700">Upload and manage course materials</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-2">Attendance</h3>
              <p className="text-sm text-purple-700">Record and track student attendance</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-2">Assessment Entry</h3>
              <p className="text-sm text-orange-700">Enter grades and assessment scores</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 cursor-pointer">
              <h3 className="font-semibold text-indigo-900 mb-2">Advisees</h3>
              <p className="text-sm text-indigo-700">Manage student advisory responsibilities</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 cursor-pointer">
              <h3 className="font-semibold text-red-900 mb-2">HR Self Services</h3>
              <p className="text-sm text-red-700">Access HR services and personal information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
