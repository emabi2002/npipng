import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function StudentPortalsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="academic" />
      <RedTabs module="academic" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Student Portals</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-2">Student Profile</h3>
              <p className="text-sm text-blue-700">View and manage student personal information</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-2">Admission/Enrolment</h3>
              <p className="text-sm text-green-700">Handle admission processes and enrolment</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-2">Registration</h3>
              <p className="text-sm text-purple-700">Course registration and management</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-2">Timetable</h3>
              <p className="text-sm text-orange-700">View class schedules and timetables</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 cursor-pointer">
              <h3 className="font-semibold text-indigo-900 mb-2">Grades and Transcripts</h3>
              <p className="text-sm text-indigo-700">Access academic records and transcripts</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 cursor-pointer">
              <h3 className="font-semibold text-red-900 mb-2">Fees</h3>
              <p className="text-sm text-red-700">View and pay student fees</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 cursor-pointer">
              <h3 className="font-semibold text-yellow-900 mb-2">Welfare Links</h3>
              <p className="text-sm text-yellow-700">Access student welfare services</p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 hover:bg-pink-100 cursor-pointer">
              <h3 className="font-semibold text-pink-900 mb-2">Hostel</h3>
              <p className="text-sm text-pink-700">Manage hostel accommodation</p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 hover:bg-teal-100 cursor-pointer">
              <h3 className="font-semibold text-teal-900 mb-2">Library Links</h3>
              <p className="text-sm text-teal-700">Access library resources and services</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Notices</h3>
              <p className="text-sm text-gray-700">View important announcements and notices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
