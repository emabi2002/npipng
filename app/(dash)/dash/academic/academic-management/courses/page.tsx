export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Title and Action Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Course Management System</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input
              type="text"
              placeholder="CS401 - Software Engineering"
              className="w-48 px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Department</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>All Departments</option>
              <option>Computer Science & IT</option>
              <option>Mechanical Engineering</option>
              <option>Business Administration</option>
              <option>Applied Sciences</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Semester</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>Spring 2024</option>
              <option>Fall 2024</option>
              <option>Spring 2025</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Level</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>All Levels</option>
              <option>100 Level</option>
              <option>200 Level</option>
              <option>300 Level</option>
              <option>400 Level</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded" />
            Active Only
          </label>

          <div className="flex gap-2 ml-auto">
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
              + Add Course
            </button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              📅 Schedule Classes
            </button>
            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
              👥 Assign Faculty
            </button>
            <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
              📊 Course Report
            </button>
            <button className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
              📤 Export Curriculum
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Panel - Course Details */}
          <div className="col-span-8">
            <div className="bg-white border border-gray-200 rounded">
              {/* Course Information */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">CS401</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">Software Engineering</h2>
                    <p className="text-blue-600 font-medium">Course Code: CS401</p>
                    <p className="text-sm text-gray-600">Computer Science & IT Department - 4th Semester</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                    <p className="text-xs text-gray-500 mt-1">3 Credit Hours</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
                  <div className="flex">
                    <span className="w-24 text-gray-600">Course Title:</span>
                    <span className="font-medium">Software Engineering</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Credit Hours:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Course Type:</span>
                    <span>Core</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 text-gray-600">Department:</span>
                    <span>Computer Science & IT</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Contact Hours:</span>
                    <span>4 hours/week</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Lab Hours:</span>
                    <span>2 hours/week</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 text-gray-600">Prerequisites:</span>
                    <span className="text-blue-600">CS301, CS302</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Max Students:</span>
                    <span>40</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Current Enrolled:</span>
                    <span className="font-medium">36</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 text-gray-600">Instructor:</span>
                    <span className="text-blue-600">Dr. Sarah Johnson</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Room:</span>
                    <span>CS Lab 1</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-600">Schedule:</span>
                    <span>Mon-Wed 2:00-4:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border-b-2 border-blue-500">
                  📚 Course Content
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  👥 Enrolled Students (36)
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  📅 Class Schedule
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  📊 Assessments
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  📄 Resources
                </button>
              </div>

              {/* Course Content Table */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">Course Curriculum & Weekly Schedule</h3>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    📝 Edit Curriculum
                  </button>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2">Week</th>
                      <th className="text-left p-2">Topic</th>
                      <th className="text-center p-2">Learning Outcomes</th>
                      <th className="text-center p-2">Assessment</th>
                      <th className="text-center p-2">Resources</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2 font-medium">Week 1-2</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-900">Introduction to Software Engineering</div>
                          <div className="text-xs text-gray-500">Software development lifecycle, methodologies</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">4 Outcomes</span>
                      </td>
                      <td className="text-center p-2">Quiz 1</td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 font-medium">Week 3-4</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-900">Requirements Analysis & Design</div>
                          <div className="text-xs text-gray-500">User requirements, system specifications, UML</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">5 Outcomes</span>
                      </td>
                      <td className="text-center p-2">Assignment 1</td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">In Progress</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 font-medium">Week 5-6</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-900">Software Architecture & Design Patterns</div>
                          <div className="text-xs text-gray-500">Architectural patterns, design principles</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">6 Outcomes</span>
                      </td>
                      <td className="text-center p-2">Lab Project</td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Scheduled</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 font-medium">Week 7-8</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-900">Implementation & Testing</div>
                          <div className="text-xs text-gray-500">Coding practices, unit testing, integration</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">7 Outcomes</span>
                      </td>
                      <td className="text-center p-2">Midterm</td>
                      <td className="text-center p-2">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">TBD</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Scheduled</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Course Statistics */}
                <div className="mt-4 bg-gray-100 p-3 rounded">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">Total Weeks</div>
                      <div className="text-lg font-bold text-blue-600">16</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">Completed</div>
                      <div className="text-lg font-bold text-green-600">25%</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">Enrolled Students</div>
                      <div className="text-lg font-bold text-purple-600">36/40</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">Average Grade</div>
                      <div className="text-lg font-bold text-orange-600">B+</div>
                    </div>
                  </div>
                </div>

                {/* Course Objectives */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-medium text-blue-900 mb-2">Course Learning Objectives</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-blue-700">
                    <p>• Understand software development lifecycle and methodologies</p>
                    <p>• Apply software engineering principles to real-world projects</p>
                    <p>• Design and implement software systems using best practices</p>
                    <p>• Evaluate and select appropriate software engineering tools and techniques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Course Management */}
          <div className="col-span-4">
            <div className="space-y-4">

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-3">Course Management</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                    📝 Edit Course Details
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700">
                    👥 Manage Enrollment
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700">
                    📅 Update Schedule
                  </button>
                  <button className="w-full bg-orange-600 text-white py-2 rounded text-sm hover:bg-orange-700">
                    📚 Manage Resources
                  </button>
                  <button className="w-full bg-teal-600 text-white py-2 rounded text-sm hover:bg-teal-700">
                    📊 View Analytics
                  </button>
                </div>
              </div>

              {/* Class Schedule */}
              <div className="bg-white border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-3">Weekly Schedule</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday:</span>
                    <span className="font-medium">2:00 - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wednesday:</span>
                    <span className="font-medium">2:00 - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lab Session:</span>
                    <span className="font-medium">Friday 9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">CS Lab 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">40 Students</span>
                  </div>
                </div>
              </div>

              {/* Assessment Overview */}
              <div className="bg-white border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-3">Assessment Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assignments:</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lab Projects:</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Midterm Exam:</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final Exam:</span>
                    <span className="font-medium">25%</span>
                  </div>
                </div>
              </div>

              {/* Course Status */}
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-medium text-green-900 mb-3">✅ Course Status</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Enrollment Status:</strong> Open</p>
                  <p><strong>Current Capacity:</strong> 90% Full</p>
                  <p><strong>Prerequisites:</strong> Met</p>
                  <p><strong>Resources:</strong> Available</p>
                  <p><strong>Faculty Assigned:</strong> Dr. Sarah Johnson</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
