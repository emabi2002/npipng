import TopSubNav from "@/components/nav/TopSubNav";
import RedTabs from "@/components/nav/RedTabs";

export default function LibraryCatalogPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopSubNav module="library" />
      <RedTabs module="library" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Library Catalog</h1>
              <p className="text-slate-600">Search and manage library resources and collections</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add New Book
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Total Books</h3>
              <p className="text-2xl font-bold text-blue-900">12,450</p>
              <p className="text-sm text-blue-600">Physical & Digital</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">Available</h3>
              <p className="text-2xl font-bold text-green-900">9,876</p>
              <p className="text-sm text-green-600">Ready to borrow</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-1">On Loan</h3>
              <p className="text-2xl font-bold text-orange-900">2,574</p>
              <p className="text-sm text-orange-600">Currently borrowed</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-1">Digital Resources</h3>
              <p className="text-2xl font-bold text-purple-900">3,245</p>
              <p className="text-sm text-purple-600">E-books & Articles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Search Catalog</h3>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-md"
                  />
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Search
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900">Introduction to Machine Learning</h4>
                    <p className="text-sm text-slate-600">by Dr. Sarah Mitchell</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Available</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Computer Science</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Categories</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Computer Science</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">2,340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Engineering</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">1,980</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Business</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">1,560</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
