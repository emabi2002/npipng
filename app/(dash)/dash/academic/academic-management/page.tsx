import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function AcademicManagementPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="academic" />
      <RedTabs module="academic" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          {/* Student Information Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-700">ID:</span>
                <span className="ml-2 text-slate-900">150001002</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Total Package Amount:</span>
                <span className="ml-2 text-slate-900">264,900.00</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Collection Semester:</span>
                <span className="ml-2 text-slate-900">Spring 2023 (AM)</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Student Name:</span>
                <span className="ml-2 text-slate-900">Student 8092</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Net Payable Bill:</span>
                <span className="ml-2 text-slate-900">235,400.00</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Semester:</span>
                <span className="ml-2 text-slate-900">Cash in Campus (Main)</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Program:</span>
                <span className="ml-2 text-slate-900">BSc CST (AM)</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Net Paid:</span>
                <span className="ml-2 text-slate-900">220,460.00</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Payment Method:</span>
                <span className="ml-2 text-slate-900">Cash in Campus</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Total Credit:</span>
                <span className="ml-2 text-slate-900">148.0</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Total Semester:</span>
                <span className="ml-2 text-slate-900">12</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Package Due:</span>
                <span className="ml-2 text-slate-900">38,351.50</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Date of Receipt:</span>
                <span className="ml-2 text-slate-900">05/11/2023</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Admission:</span>
                <span className="ml-2 text-slate-900">Fall 2019 (AM)</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Semester:</span>
                <span className="ml-2 text-slate-900">22th</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Net Due on Overall Bill:</span>
                <span className="ml-2 text-slate-900">7,932.00</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Date Created:</span>
                <span className="ml-2 text-slate-900">5/11/23 6:23 PM</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                ✓ Debit (1)
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                ✓ Credit (2)
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                ⚪ Trash (1)
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Package & Discount
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Semester Bills
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                All Collection
              </button>
            </div>
          </div>

          {/* Billing Details */}
          <div className="p-4">
            <h3 className="font-medium text-slate-900 mb-4">Debit (Payable Items) of Spring 2023 (AM)</h3>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-slate-700 border-b pb-2">
                <div className="col-span-1">
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="col-span-4">Particulars</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Action</div>
              </div>

              <div className="grid grid-cols-12 gap-2 text-sm text-slate-900">
                <div className="col-span-1">
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="col-span-4">
                  <div className="font-medium">Semester Fees Spring 2023 (AM) | 11th Semester***</div>
                  <div className="text-xs text-slate-600 ml-4">
                    <div>📄 Session Fee (3500)</div>
                    <div>📄 Tuition Fee (18400)</div>
                    <div>📄 Regular Tuition Fee (4501)</div>
                  </div>
                </div>
                <div className="col-span-2">24,901.00</div>
                <div className="col-span-2">4/4/23 1:52 PM</div>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <button className="text-green-600 hover:text-green-800">+ Add Object</button>
                    <button className="text-red-600 hover:text-red-800">🗑️</button>
                    <button className="text-blue-600 hover:text-blue-800">📄</button>
                  </div>
                </div>
              </div>

              <div className="text-right text-sm">
                <div className="font-medium">This Semester Payable: <span className="text-green-600">24,901.00</span></div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Previous Balance</span>
                  <span>-2,409.00</span>
                </div>
                <div className="flex justify-between">
                  <span>This Semester Bill (+)</span>
                  <span>24,901.00</span>
                </div>
                <div className="flex justify-between">
                  <span>This Semester Paid (-)</span>
                  <span>14,560.00</span>
                </div>
                <div className="flex justify-between">
                  <span>This Semester Balance</span>
                  <span>7,932.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Net Due on Overall Bill</span>
                  <span>7,932.00</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">⚠️ Attention!</span>
                    <span>Please select a debit form left for Collection or</span>
                    <button className="text-green-600 hover:text-green-800">+ Add Semester Payment</button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div>Midterm Bill: <span className="font-medium">12,450.50</span></div>
                  <div>Midterm Due: <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">0.00</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
