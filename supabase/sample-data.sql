-- =================================
-- SAMPLE DATA FOR ACADEMIC GRADING SYSTEM TESTING
-- Execute this AFTER running academic-schema.sql
-- =================================

-- Sample Users (Faculty and Students)
INSERT INTO auth.users (id, email, phone, confirmed_at, email_confirmed_at, created_at, updated_at, role, aud)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.professor@npipng.edu', NULL, NOW(), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane.student@npipng.edu', NULL, NOW(), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('550e8400-e29b-41d4-a716-446655440003', 'bob.student@npipng.edu', NULL, NOW(), NOW(), NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Sample Employees (Faculty)
INSERT INTO employees (id, user_id, employee_id, first_name, last_name, email, department_id, position, role, status, hire_date)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'FAC001', 'John', 'Professor', 'john.professor@npipng.edu',
   (SELECT id FROM departments WHERE name = 'Computer Science' LIMIT 1),
   'Professor', 'faculty', 'active', '2020-01-15')
ON CONFLICT (employee_id) DO NOTHING;

-- Sample Students
INSERT INTO students (id, user_id, student_id, first_name, last_name, email, program, year_level, section, enrollment_status, enrollment_date)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'STU001', 'Jane', 'Smith', 'jane.student@npipng.edu', 'Computer Science', 2, 'CS-2A', 'enrolled', '2023-08-15'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'STU002', 'Bob', 'Johnson', 'bob.student@npipng.edu', 'Computer Science', 2, 'CS-2A', 'enrolled', '2023-08-15')
ON CONFLICT (student_id) DO NOTHING;

-- Sample Course Enrollments for Fall 2024
INSERT INTO course_enrollments (student_id, course_id, semester_year, enrollment_date, status)
SELECT
  s.id as student_id,
  c.id as course_id,
  'Fall 2024' as semester_year,
  '2024-08-15' as enrollment_date,
  'enrolled' as status
FROM students s
CROSS JOIN courses c
WHERE s.student_id IN ('STU001', 'STU002')
AND c.code IN ('CS101', 'CS201', 'MATH101')
ON CONFLICT (student_id, course_id, semester_year) DO NOTHING;

-- Sample Assessment Configurations for CS101 (Programming Fundamentals)
DO $$
DECLARE
    cs101_course_id UUID;
    faculty_id UUID;
BEGIN
    -- Get course and faculty IDs
    SELECT id INTO cs101_course_id FROM courses WHERE code = 'CS101' LIMIT 1;
    SELECT id INTO faculty_id FROM employees WHERE employee_id = 'FAC001' LIMIT 1;

    IF cs101_course_id IS NOT NULL AND faculty_id IS NOT NULL THEN
        -- Internal Assessments (40% total weight)
        INSERT INTO assessment_configs (course_id, semester_year, assessment_type, category, name, description, max_marks, weight_percentage, created_by, due_date)
        VALUES
          (cs101_course_id, 'Fall 2024', 'quiz', 'internal', 'Weekly Quiz 1', 'Basic programming concepts', 25, 5, faculty_id, '2024-09-15'),
          (cs101_course_id, 'Fall 2024', 'quiz', 'internal', 'Weekly Quiz 2', 'Variables and data types', 25, 5, faculty_id, '2024-09-22'),
          (cs101_course_id, 'Fall 2024', 'assignment', 'internal', 'Programming Assignment 1', 'Simple calculator program', 50, 10, faculty_id, '2024-10-01'),
          (cs101_course_id, 'Fall 2024', 'test', 'internal', 'Midterm Test', 'Comprehensive programming test', 100, 15, faculty_id, '2024-10-15'),
          (cs101_course_id, 'Fall 2024', 'participation', 'internal', 'Class Participation', 'Active participation in class', 25, 5, faculty_id, '2024-12-15'),

        -- External Assessment (60% total weight)
          (cs101_course_id, 'Fall 2024', 'final_exam', 'external', 'Final Examination', 'Comprehensive final exam', 150, 60, faculty_id, '2024-12-20')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Sample Assessment Configurations for CS201 (Data Structures)
DO $$
DECLARE
    cs201_course_id UUID;
    faculty_id UUID;
BEGIN
    SELECT id INTO cs201_course_id FROM courses WHERE code = 'CS201' LIMIT 1;
    SELECT id INTO faculty_id FROM employees WHERE employee_id = 'FAC001' LIMIT 1;

    IF cs201_course_id IS NOT NULL AND faculty_id IS NOT NULL THEN
        INSERT INTO assessment_configs (course_id, semester_year, assessment_type, category, name, description, max_marks, weight_percentage, created_by, due_date)
        VALUES
          (cs201_course_id, 'Fall 2024', 'quiz', 'internal', 'Data Structures Quiz 1', 'Arrays and linked lists', 30, 6, faculty_id, '2024-09-20'),
          (cs201_course_id, 'Fall 2024', 'assignment', 'internal', 'Implementation Project', 'Implement stack and queue', 70, 14, faculty_id, '2024-10-10'),
          (cs201_course_id, 'Fall 2024', 'test', 'internal', 'Midterm Examination', 'Trees and graphs', 100, 20, faculty_id, '2024-11-01'),
          (cs201_course_id, 'Fall 2024', 'final_exam', 'external', 'Final Examination', 'Comprehensive data structures exam', 150, 60, faculty_id, '2024-12-22')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create Sample Assessments from Configurations
INSERT INTO assessments (config_id, title, description, total_marks, is_published, start_time, end_time, duration_minutes)
SELECT
    ac.id as config_id,
    ac.name as title,
    ac.description,
    ac.max_marks as total_marks,
    true as is_published,
    NOW() + INTERVAL '1 day' as start_time,
    NOW() + INTERVAL '2 days' as end_time,
    CASE
        WHEN ac.assessment_type = 'quiz' THEN 30
        WHEN ac.assessment_type = 'test' THEN 90
        WHEN ac.assessment_type = 'final_exam' THEN 180
        ELSE 60
    END as duration_minutes
FROM assessment_configs ac
WHERE ac.semester_year = 'Fall 2024'
ON CONFLICT DO NOTHING;

-- Sample Student Grades for Testing
DO $$
DECLARE
    assessment_rec RECORD;
    student_rec RECORD;
    enrollment_rec RECORD;
    random_marks DECIMAL;
BEGIN
    -- Loop through assessments and create sample grades
    FOR assessment_rec IN (
        SELECT a.id, a.total_marks, ac.course_id, ac.assessment_type
        FROM assessments a
        JOIN assessment_configs ac ON a.config_id = ac.id
        WHERE ac.semester_year = 'Fall 2024'
    ) LOOP
        -- Loop through enrolled students
        FOR enrollment_rec IN (
            SELECT ce.id as enrollment_id, ce.student_id
            FROM course_enrollments ce
            WHERE ce.course_id = assessment_rec.course_id
            AND ce.semester_year = 'Fall 2024'
        ) LOOP
            -- Generate realistic random marks (70-95% range for good students)
            random_marks := assessment_rec.total_marks * (0.70 + (RANDOM() * 0.25));

            INSERT INTO student_grades (
                assessment_id,
                student_id,
                enrollment_id,
                marks_obtained,
                submitted_at,
                graded_at,
                graded_by,
                is_submitted,
                is_graded
            )
            SELECT
                assessment_rec.id,
                enrollment_rec.student_id,
                enrollment_rec.enrollment_id,
                round(random_marks, 2),
                NOW() - INTERVAL '1 day',
                NOW(),
                (SELECT id FROM employees WHERE employee_id = 'FAC001' LIMIT 1),
                true,
                true
            WHERE NOT EXISTS (
                SELECT 1 FROM student_grades
                WHERE assessment_id = assessment_rec.id
                AND student_id = enrollment_rec.student_id
            );
        END LOOP;
    END LOOP;
END $$;

-- Update Course Grades (This will trigger automatic calculation)
SELECT update_course_grade(ce.id)
FROM course_enrollments ce
WHERE ce.semester_year = 'Fall 2024';

-- Sample Academic Records
INSERT INTO academic_records (student_id, program_id, semester_year, total_credits_attempted, total_credits_earned, is_finalized)
SELECT
    s.id as student_id,
    ap.id as program_id,
    'Fall 2024' as semester_year,
    12 as total_credits_attempted,
    12 as total_credits_earned,
    false as is_finalized
FROM students s
CROSS JOIN academic_programs ap
WHERE s.student_id IN ('STU001', 'STU002')
AND ap.code = 'BCS'
ON CONFLICT (student_id, semester_year) DO NOTHING;

-- Display Summary of Sample Data
SELECT
    'Sample Data Created Successfully!' as status,
    (SELECT COUNT(*) FROM students WHERE student_id LIKE 'STU%') as sample_students,
    (SELECT COUNT(*) FROM employees WHERE employee_id LIKE 'FAC%') as sample_faculty,
    (SELECT COUNT(*) FROM course_enrollments WHERE semester_year = 'Fall 2024') as sample_enrollments,
    (SELECT COUNT(*) FROM assessment_configs WHERE semester_year = 'Fall 2024') as sample_assessments,
    (SELECT COUNT(*) FROM student_grades WHERE is_graded = true) as sample_grades;
