import { createClient } from '../supabase/client'

const supabase = createClient()

export async function initializeSampleData() {
  try {
    console.log('🚀 Initializing sample data...')

    // Create sample departments
    await createSampleDepartments()

    // Create sample programs
    await createSamplePrograms()

    // Create sample semesters
    await createSampleSemesters()

    // Create sample users and their profiles
    await createSampleUsers()

    // Create sample courses
    await createSampleCourses()

    // Create sample books and library data
    await createSampleLibraryData()

    // Create sample fee structures
    await createSampleFeeStructures()

    console.log('✅ Sample data initialization completed!')

  } catch (error) {
    console.error('❌ Error initializing sample data:', error)
    throw error
  }
}

async function createSampleDepartments() {
  const departments = [
    {
      name: 'Computer Science & Information Technology',
      code: 'CSIT',
      description: 'Department specializing in computer science, software engineering, and information technology',
      building: 'Technology Building A'
    },
    {
      name: 'Business Administration',
      code: 'BA',
      description: 'Department of business administration, management, and entrepreneurship',
      building: 'Business Complex'
    },
    {
      name: 'Engineering',
      code: 'ENG',
      description: 'Department of engineering and applied sciences',
      building: 'Engineering Building'
    },
    {
      name: 'Arts & Sciences',
      code: 'AS',
      description: 'Department of liberal arts and sciences',
      building: 'Arts Building'
    },
    {
      name: 'Education',
      code: 'EDU',
      description: 'Department of education and teacher training',
      building: 'Education Building'
    }
  ]

  for (const dept of departments) {
    await supabase.from('departments').upsert(dept, { onConflict: 'code' })
  }

  console.log('✅ Sample departments created')
}

async function createSamplePrograms() {
  const { data: departments } = await supabase.from('departments').select('id, code')
  const deptMap = departments?.reduce((acc, dept) => ({ ...acc, [dept.code]: dept.id }), {}) || {}

  const programs = [
    {
      name: 'Bachelor of Science in Computer Science',
      code: 'BSCS',
      department_id: deptMap['CSIT'],
      degree_type: 'Bachelor',
      duration_years: 4,
      total_credits: 120,
      description: 'Comprehensive computer science program covering programming, algorithms, and software development'
    },
    {
      name: 'Bachelor of Science in Information Technology',
      code: 'BSIT',
      department_id: deptMap['CSIT'],
      degree_type: 'Bachelor',
      duration_years: 4,
      total_credits: 120,
      description: 'Information technology program focused on practical IT skills and system administration'
    },
    {
      name: 'Bachelor of Business Administration',
      code: 'BBA',
      department_id: deptMap['BA'],
      degree_type: 'Bachelor',
      duration_years: 4,
      total_credits: 120,
      description: 'Business administration program covering management, finance, and marketing'
    },
    {
      name: 'Bachelor of Science in Civil Engineering',
      code: 'BSCE',
      department_id: deptMap['ENG'],
      degree_type: 'Bachelor',
      duration_years: 5,
      total_credits: 150,
      description: 'Civil engineering program covering structural design and construction'
    },
    {
      name: 'Bachelor of Elementary Education',
      code: 'BEED',
      department_id: deptMap['EDU'],
      degree_type: 'Bachelor',
      duration_years: 4,
      total_credits: 120,
      description: 'Teacher education program for elementary level instruction'
    }
  ]

  for (const program of programs) {
    await supabase.from('programs').upsert(program, { onConflict: 'code' })
  }

  console.log('✅ Sample programs created')
}

async function createSampleSemesters() {
  const currentYear = new Date().getFullYear()
  const semesters = [
    {
      name: 'First Semester',
      code: `1SY${currentYear}-${currentYear + 1}`,
      start_date: `${currentYear}-08-15`,
      end_date: `${currentYear}-12-15`,
      registration_start: `${currentYear}-07-01`,
      registration_end: `${currentYear}-08-10`,
      is_current: true,
      academic_year: `${currentYear}-${currentYear + 1}`
    },
    {
      name: 'Second Semester',
      code: `2SY${currentYear}-${currentYear + 1}`,
      start_date: `${currentYear + 1}-01-10`,
      end_date: `${currentYear + 1}-05-20`,
      registration_start: `${currentYear}-12-01`,
      registration_end: `${currentYear + 1}-01-05`,
      is_current: false,
      academic_year: `${currentYear}-${currentYear + 1}`
    }
  ]

  for (const semester of semesters) {
    await supabase.from('semesters').upsert(semester, { onConflict: 'code' })
  }

  console.log('✅ Sample semesters created')
}

async function createSampleUsers() {
  // Sample admin user
  const adminUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@npipng.edu',
    full_name: 'System Administrator',
    role: 'admin',
    status: 'active',
    phone: '+675-123-4567'
  }

  // Sample faculty users
  const facultyUsers = [
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'john.smith@npipng.edu',
      full_name: 'Dr. John Smith',
      role: 'faculty',
      status: 'active',
      phone: '+675-123-4568'
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'jane.doe@npipng.edu',
      full_name: 'Prof. Jane Doe',
      role: 'faculty',
      status: 'active',
      phone: '+675-123-4569'
    }
  ]

  // Sample staff users
  const staffUsers = [
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'mary.johnson@npipng.edu',
      full_name: 'Mary Johnson',
      role: 'staff',
      status: 'active',
      phone: '+675-123-4570'
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'david.wilson@npipng.edu',
      full_name: 'David Wilson',
      role: 'librarian',
      status: 'active',
      phone: '+675-123-4571'
    }
  ]

  // Sample student users
  const studentUsers = [
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'alice.brown@student.npipng.edu',
      full_name: 'Alice Brown',
      role: 'student',
      status: 'active',
      phone: '+675-123-4572'
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      email: 'bob.davis@student.npipng.edu',
      full_name: 'Bob Davis',
      role: 'student',
      status: 'active',
      phone: '+675-123-4573'
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      email: 'carol.miller@student.npipng.edu',
      full_name: 'Carol Miller',
      role: 'student',
      status: 'active',
      phone: '+675-123-4574'
    }
  ]

  const allUsers = [adminUser, ...facultyUsers, ...staffUsers, ...studentUsers]

  for (const user of allUsers) {
    await supabase.from('users').upsert(user, { onConflict: 'id' })
  }

  // Create employee records for non-student users
  const { data: departments } = await supabase.from('departments').select('id, code')
  const deptMap = departments?.reduce((acc, dept) => ({ ...acc, [dept.code]: dept.id }), {}) || {}

  const employees = [
    {
      user_id: adminUser.id,
      employee_id: 'EMP001',
      department_id: deptMap['CSIT'],
      position: 'System Administrator',
      employment_type: 'Full-time',
      salary: 75000
    },
    {
      user_id: facultyUsers[0].id,
      employee_id: 'FAC001',
      department_id: deptMap['CSIT'],
      position: 'Professor',
      employment_type: 'Full-time',
      salary: 85000
    },
    {
      user_id: facultyUsers[1].id,
      employee_id: 'FAC002',
      department_id: deptMap['BA'],
      position: 'Associate Professor',
      employment_type: 'Full-time',
      salary: 80000
    },
    {
      user_id: staffUsers[0].id,
      employee_id: 'STF001',
      department_id: deptMap['BA'],
      position: 'Finance Officer',
      employment_type: 'Full-time',
      salary: 55000
    },
    {
      user_id: staffUsers[1].id,
      employee_id: 'LIB001',
      department_id: deptMap['AS'],
      position: 'Head Librarian',
      employment_type: 'Full-time',
      salary: 60000
    }
  ]

  for (const employee of employees) {
    await supabase.from('employees').upsert(employee, { onConflict: 'employee_id' })
  }

  // Create student records
  const { data: programs } = await supabase.from('programs').select('id, code')
  const programMap = programs?.reduce((acc, prog) => ({ ...acc, [prog.code]: prog.id }), {}) || {}

  const students = [
    {
      user_id: studentUsers[0].id,
      student_id: 'STU001',
      program_id: programMap['BSCS'],
      year_level: 3,
      section: 'A',
      gpa: 3.75,
      total_credits: 90,
      enrollment_status: 'enrolled'
    },
    {
      user_id: studentUsers[1].id,
      student_id: 'STU002',
      program_id: programMap['BSIT'],
      year_level: 2,
      section: 'B',
      gpa: 3.50,
      total_credits: 60,
      enrollment_status: 'enrolled'
    },
    {
      user_id: studentUsers[2].id,
      student_id: 'STU003',
      program_id: programMap['BBA'],
      year_level: 1,
      section: 'A',
      gpa: 3.25,
      total_credits: 30,
      enrollment_status: 'enrolled'
    }
  ]

  for (const student of students) {
    await supabase.from('students').upsert(student, { onConflict: 'student_id' })
  }

  // Create library members
  const libraryMembers = [
    {
      user_id: studentUsers[0].id,
      member_id: 'LIB001',
      membership_type: 'student',
      max_books: 5
    },
    {
      user_id: studentUsers[1].id,
      member_id: 'LIB002',
      membership_type: 'student',
      max_books: 5
    },
    {
      user_id: facultyUsers[0].id,
      member_id: 'LIB003',
      membership_type: 'faculty',
      max_books: 10
    }
  ]

  for (const member of libraryMembers) {
    await supabase.from('library_members').upsert(member, { onConflict: 'member_id' })
  }

  console.log('✅ Sample users and profiles created')
}

async function createSampleCourses() {
  const { data: departments } = await supabase.from('departments').select('id, code')
  const deptMap = departments?.reduce((acc, dept) => ({ ...acc, [dept.code]: dept.id }), {}) || {}

  const courses = [
    {
      code: 'CS101',
      name: 'Introduction to Computer Science',
      description: 'Basic concepts of computer science and programming',
      department_id: deptMap['CSIT'],
      credits: 3,
      level: 'Undergraduate'
    },
    {
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      description: 'Fundamental data structures and algorithm design',
      department_id: deptMap['CSIT'],
      credits: 4,
      level: 'Undergraduate',
      prerequisites: ['CS101']
    },
    {
      code: 'BUS101',
      name: 'Introduction to Business',
      description: 'Basic principles of business and management',
      department_id: deptMap['BA'],
      credits: 3,
      level: 'Undergraduate'
    },
    {
      code: 'MATH101',
      name: 'Calculus I',
      description: 'Differential and integral calculus',
      department_id: deptMap['AS'],
      credits: 4,
      level: 'Undergraduate'
    },
    {
      code: 'ENG101',
      name: 'Engineering Drawing',
      description: 'Technical drawing and CAD fundamentals',
      department_id: deptMap['ENG'],
      credits: 3,
      level: 'Undergraduate'
    }
  ]

  for (const course of courses) {
    await supabase.from('courses').upsert(course, { onConflict: 'code' })
  }

  console.log('✅ Sample courses created')
}

async function createSampleLibraryData() {
  // Create authors
  const authors = [
    {
      name: 'Robert C. Martin',
      biography: 'Software engineer and author, known for Clean Code principles',
      nationality: 'American'
    },
    {
      name: 'Thomas H. Cormen',
      biography: 'Computer scientist and professor at Dartmouth College',
      nationality: 'American'
    },
    {
      name: 'Peter Drucker',
      biography: 'Management consultant and educator',
      nationality: 'Austrian-American'
    }
  ]

  const authorIds: { [key: string]: string } = {}
  for (const author of authors) {
    const { data } = await supabase.from('authors').upsert(author, { onConflict: 'name' }).select('id, name').single()
    if (data) {
      authorIds[data.name] = data.id
    }
  }

  // Create book categories
  const { data: categories } = await supabase.from('book_categories').select('id, code')
  const categoryMap = categories?.reduce((acc, cat) => ({ ...acc, [cat.code]: cat.id }), {}) || {}

  // Create books
  const books = [
    {
      isbn: '9780132350884',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      publisher: 'Prentice Hall',
      publication_year: 2008,
      pages: 464,
      language: 'English',
      category_id: categoryMap['CS'],
      description: 'A guide to writing clean, readable, and maintainable code',
      location: 'CS-A-001',
      total_copies: 10,
      available_copies: 8
    },
    {
      isbn: '9780262033848',
      title: 'Introduction to Algorithms',
      publisher: 'MIT Press',
      publication_year: 2009,
      pages: 1312,
      language: 'English',
      category_id: categoryMap['CS'],
      description: 'Comprehensive introduction to algorithms and data structures',
      location: 'CS-A-002',
      total_copies: 15,
      available_copies: 12
    },
    {
      isbn: '9780060742614',
      title: 'The Effective Executive',
      publisher: 'Harper Business',
      publication_year: 2006,
      pages: 208,
      language: 'English',
      category_id: categoryMap['BUS'],
      description: 'Management principles for effective leadership',
      location: 'BUS-A-001',
      total_copies: 8,
      available_copies: 6
    }
  ]

  const bookIds: { [key: string]: string } = {}
  for (const book of books) {
    const { data } = await supabase.from('books').upsert(book, { onConflict: 'isbn' }).select('id, isbn').single()
    if (data) {
      bookIds[data.isbn] = data.id
    }
  }

  // Link books to authors
  const bookAuthors = [
    { book_id: bookIds['9780132350884'], author_id: authorIds['Robert C. Martin'] },
    { book_id: bookIds['9780262033848'], author_id: authorIds['Thomas H. Cormen'] },
    { book_id: bookIds['9780060742614'], author_id: authorIds['Peter Drucker'] }
  ]

  for (const bookAuthor of bookAuthors) {
    if (bookAuthor.book_id && bookAuthor.author_id) {
      await supabase.from('book_authors').upsert(bookAuthor, { onConflict: 'book_id,author_id' })
    }
  }

  console.log('✅ Sample library data created')
}

async function createSampleFeeStructures() {
  const { data: programs } = await supabase.from('programs').select('id, code')
  const programMap = programs?.reduce((acc, prog) => ({ ...acc, [prog.code]: prog.id }), {}) || {}

  const { data: semesters } = await supabase.from('semesters').select('id, code')
  const semesterMap = semesters?.reduce((acc, sem) => ({ ...acc, [sem.code]: sem.id }), {}) || {}

  const currentYear = new Date().getFullYear()
  const feeStructures = [
    {
      name: 'Computer Science - First Semester',
      program_id: programMap['BSCS'],
      semester_id: semesterMap[`1SY${currentYear}-${currentYear + 1}`],
      tuition_fee: 15000,
      lab_fee: 2000,
      library_fee: 500,
      miscellaneous_fee: 1000,
      due_date: `${currentYear}-09-15`
    },
    {
      name: 'Information Technology - First Semester',
      program_id: programMap['BSIT'],
      semester_id: semesterMap[`1SY${currentYear}-${currentYear + 1}`],
      tuition_fee: 14000,
      lab_fee: 2000,
      library_fee: 500,
      miscellaneous_fee: 1000,
      due_date: `${currentYear}-09-15`
    },
    {
      name: 'Business Administration - First Semester',
      program_id: programMap['BBA'],
      semester_id: semesterMap[`1SY${currentYear}-${currentYear + 1}`],
      tuition_fee: 12000,
      lab_fee: 1000,
      library_fee: 500,
      miscellaneous_fee: 1000,
      due_date: `${currentYear}-09-15`
    }
  ]

  for (const feeStructure of feeStructures) {
    await supabase.from('fee_structures').upsert(feeStructure)
  }

  console.log('✅ Sample fee structures created')
}

// Function to clean all sample data (for testing)
export async function cleanSampleData() {
  try {
    console.log('🧹 Cleaning sample data...')

    const tables = [
      'book_authors', 'book_loans', 'library_members', 'books', 'authors', 'book_categories',
      'payments', 'invoices', 'fee_structures', 'student_scholarships', 'scholarships',
      'performance_evaluations', 'leave_records', 'employees',
      'enrollments', 'course_sections', 'courses', 'students',
      'user_profiles', 'users', 'semesters', 'programs', 'departments'
    ]

    for (const table of tables) {
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }

    console.log('✅ Sample data cleaned')
  } catch (error) {
    console.error('❌ Error cleaning sample data:', error)
    throw error
  }
}
