import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="welfare" />
      <RedTabs module="welfare" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Health Services</h1>
          <p className="text-slate-600 mb-6">Medical care and health monitoring for students and staff</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Clinic Visits</h3>
                <p className="text-sm text-blue-700 mb-3">Schedule and manage medical appointments</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  Book Appointment
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-900 mb-2">Health Records</h3>
                <p className="text-sm text-green-700 mb-3">View medical history and health assessments</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  View Records
                </button>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Emergency Contacts</h3>
                <p className="text-sm text-orange-700 mb-3">Quick access to emergency medical services</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                  Emergency Info
                </button>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Clinic Hours</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 1:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                  <p><strong>Emergency:</strong> 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
