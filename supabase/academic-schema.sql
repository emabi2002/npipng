-- =================================
-- ACADEMIC GRADING SYSTEM SCHEMA
-- Internal (40%) + External (60%) Assessment Management
-- =================================

-- Assessment Types Enum
CREATE TYPE assessment_type AS ENUM (
    'quiz',
    'test',
    'assignment',
    'project',
    'lab',
    'participation',
    'final_exam'
);

-- Grade Scale Enum
CREATE TYPE grade_letter AS ENUM (
    'A+', 'A', 'A-',
    'B+', 'B', 'B-',
    'C+', 'C', 'C-',
    'D+', 'D', 'D-',
    'F'
);

-- Assessment Categories
CREATE TYPE assessment_category AS ENUM (
    'internal',    -- 40% weight
    'external'     -- 60% weight
);

-- Academic Programs/Degrees
CREATE TABLE IF NOT EXISTS academic_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    duration_semesters INTEGER NOT NULL DEFAULT 8,
    total_credits INTEGER NOT NULL DEFAULT 120,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES academic_programs(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    course_id UUID REFERENCES courses(id),
    semester_year VARCHAR(20) NOT NULL, -- e.g., "Fall 2024", "Spring 2025"
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id, semester_year)
);

-- Assessment Configurations (defines assessment types per course)
CREATE TABLE IF NOT EXISTS assessment_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    semester_year VARCHAR(20) NOT NULL,
    assessment_type assessment_type NOT NULL,
    category assessment_category NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    weight_percentage DECIMAL(5,2) NOT NULL, -- percentage weight within category
    due_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES employees(id), -- faculty member who created
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual Assessments (actual assessment instances)
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES assessment_configs(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    total_marks DECIMAL(5,2) NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Grades for Individual Assessments
CREATE TABLE IF NOT EXISTS student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id),
    student_id UUID REFERENCES students(id),
    enrollment_id UUID REFERENCES course_enrollments(id),
    marks_obtained DECIMAL(5,2) DEFAULT 0.00,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN (SELECT total_marks FROM assessments WHERE id = assessment_id) > 0
            THEN (marks_obtained / (SELECT total_marks FROM assessments WHERE id = assessment_id)) * 100
            ELSE 0
        END
    ) STORED,
    grade_letter grade_letter,
    comments TEXT,
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES employees(id),
    is_submitted BOOLEAN DEFAULT false,
    is_graded BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, student_id)
);

-- Course Final Grades (calculated grades for entire course)
CREATE TABLE IF NOT EXISTS course_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id),
    student_id UUID REFERENCES students(id),
    course_id UUID REFERENCES courses(id),
    semester_year VARCHAR(20) NOT NULL,

    -- Internal Assessment Grades (40%)
    internal_total_marks DECIMAL(5,2) DEFAULT 0.00,
    internal_obtained_marks DECIMAL(5,2) DEFAULT 0.00,
    internal_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN internal_total_marks > 0
            THEN (internal_obtained_marks / internal_total_marks) * 100
            ELSE 0
        END
    ) STORED,

    -- External Assessment Grades (60%)
    external_total_marks DECIMAL(5,2) DEFAULT 0.00,
    external_obtained_marks DECIMAL(5,2) DEFAULT 0.00,
    external_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN external_total_marks > 0
            THEN (external_obtained_marks / external_total_marks) * 100
            ELSE 0
        END
    ) STORED,

    -- Final Calculated Grade (40% internal + 60% external)
    final_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        (internal_percentage * 0.40) + (external_percentage * 0.60)
    ) STORED,

    final_grade_letter grade_letter,
    quality_points DECIMAL(3,2), -- for GPA calculation
    is_finalized BOOLEAN DEFAULT false,
    finalized_by UUID REFERENCES employees(id),
    finalized_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(enrollment_id)
);

-- Academic Records/Transcripts
CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    program_id UUID REFERENCES academic_programs(id),
    semester_year VARCHAR(20) NOT NULL,
    total_credits_attempted INTEGER DEFAULT 0,
    total_credits_earned INTEGER DEFAULT 0,
    semester_gpa DECIMAL(3,2) DEFAULT 0.00,
    cumulative_gpa DECIMAL(3,2) DEFAULT 0.00,
    total_quality_points DECIMAL(6,2) DEFAULT 0.00,
    academic_status VARCHAR(50) DEFAULT 'good_standing', -- good_standing, probation, suspended
    is_finalized BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, semester_year)
);

-- Grade Scale Configuration
CREATE TABLE IF NOT EXISTS grade_scales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letter_grade grade_letter NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    quality_points DECIMAL(3,2) NOT NULL,
    description VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Standard Grade Scale
INSERT INTO grade_scales (letter_grade, min_percentage, max_percentage, quality_points, description) VALUES
('A+', 97.0, 100.0, 4.00, 'Outstanding'),
('A', 93.0, 96.9, 4.00, 'Excellent'),
('A-', 90.0, 92.9, 3.70, 'Very Good'),
('B+', 87.0, 89.9, 3.30, 'Good'),
('B', 83.0, 86.9, 3.00, 'Above Average'),
('B-', 80.0, 82.9, 2.70, 'Average'),
('C+', 77.0, 79.9, 2.30, 'Below Average'),
('C', 73.0, 76.9, 2.00, 'Satisfactory'),
('C-', 70.0, 72.9, 1.70, 'Minimum Pass'),
('D+', 67.0, 69.9, 1.30, 'Poor'),
('D', 63.0, 66.9, 1.00, 'Very Poor'),
('D-', 60.0, 62.9, 0.70, 'Marginal'),
('F', 0.0, 59.9, 0.00, 'Fail');

-- =================================
-- INDEXES FOR PERFORMANCE
-- =================================

CREATE INDEX idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_semester ON course_enrollments(semester_year);

CREATE INDEX idx_assessment_configs_course ON assessment_configs(course_id);
CREATE INDEX idx_assessment_configs_semester ON assessment_configs(semester_year);
CREATE INDEX idx_assessment_configs_category ON assessment_configs(category);

CREATE INDEX idx_student_grades_assessment ON student_grades(assessment_id);
CREATE INDEX idx_student_grades_student ON student_grades(student_id);
CREATE INDEX idx_student_grades_enrollment ON student_grades(enrollment_id);

CREATE INDEX idx_course_grades_student ON course_grades(student_id);
CREATE INDEX idx_course_grades_course ON course_grades(course_id);
CREATE INDEX idx_course_grades_semester ON course_grades(semester_year);

CREATE INDEX idx_academic_records_student ON academic_records(student_id);
CREATE INDEX idx_academic_records_semester ON academic_records(semester_year);

-- =================================
-- FUNCTIONS FOR GRADE CALCULATIONS
-- =================================

-- Function to calculate letter grade from percentage
CREATE OR REPLACE FUNCTION calculate_letter_grade(percentage DECIMAL)
RETURNS grade_letter AS $$
DECLARE
    result grade_letter;
BEGIN
    SELECT letter_grade INTO result
    FROM grade_scales
    WHERE percentage >= min_percentage AND percentage <= max_percentage
    AND is_active = true
    LIMIT 1;

    RETURN COALESCE(result, 'F');
END;
$$ LANGUAGE plpgsql;

-- Function to get quality points for a letter grade
CREATE OR REPLACE FUNCTION get_quality_points(letter grade_letter)
RETURNS DECIMAL AS $$
DECLARE
    points DECIMAL;
BEGIN
    SELECT quality_points INTO points
    FROM grade_scales
    WHERE letter_grade = letter
    AND is_active = true;

    RETURN COALESCE(points, 0.00);
END;
$$ LANGUAGE plpgsql;

-- Function to update course grade when individual assessments change
CREATE OR REPLACE FUNCTION update_course_grade(p_enrollment_id UUID)
RETURNS VOID AS $$
DECLARE
    internal_total DECIMAL := 0.00;
    internal_obtained DECIMAL := 0.00;
    external_total DECIMAL := 0.00;
    external_obtained DECIMAL := 0.00;
    final_letter grade_letter;
    final_points DECIMAL;
BEGIN
    -- Calculate internal assessment totals
    SELECT
        COALESCE(SUM(a.total_marks), 0),
        COALESCE(SUM(sg.marks_obtained), 0)
    INTO internal_total, internal_obtained
    FROM student_grades sg
    JOIN assessments a ON sg.assessment_id = a.id
    JOIN assessment_configs ac ON a.config_id = ac.id
    WHERE sg.enrollment_id = p_enrollment_id
    AND ac.category = 'internal'
    AND sg.is_graded = true;

    -- Calculate external assessment totals
    SELECT
        COALESCE(SUM(a.total_marks), 0),
        COALESCE(SUM(sg.marks_obtained), 0)
    INTO external_total, external_obtained
    FROM student_grades sg
    JOIN assessments a ON sg.assessment_id = a.id
    JOIN assessment_configs ac ON a.config_id = ac.id
    WHERE sg.enrollment_id = p_enrollment_id
    AND ac.category = 'external'
    AND sg.is_graded = true;

    -- Update or insert course grade
    INSERT INTO course_grades (
        enrollment_id, student_id, course_id, semester_year,
        internal_total_marks, internal_obtained_marks,
        external_total_marks, external_obtained_marks
    )
    SELECT
        ce.id, ce.student_id, ce.course_id, ce.semester_year,
        internal_total, internal_obtained,
        external_total, external_obtained
    FROM course_enrollments ce
    WHERE ce.id = p_enrollment_id
    ON CONFLICT (enrollment_id)
    DO UPDATE SET
        internal_total_marks = EXCLUDED.internal_total_marks,
        internal_obtained_marks = EXCLUDED.internal_obtained_marks,
        external_total_marks = EXCLUDED.external_total_marks,
        external_obtained_marks = EXCLUDED.external_obtained_marks,
        updated_at = NOW();

    -- Update final letter grade and quality points
    UPDATE course_grades
    SET
        final_grade_letter = calculate_letter_grade(final_percentage),
        quality_points = get_quality_points(calculate_letter_grade(final_percentage))
    WHERE enrollment_id = p_enrollment_id;
END;
$$ LANGUAGE plpgsql;

-- =================================
-- TRIGGERS
-- =================================

-- Trigger to update course grades when individual grades change
CREATE OR REPLACE FUNCTION trigger_update_course_grade()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_course_grade(NEW.enrollment_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_student_grade_update
    AFTER INSERT OR UPDATE ON student_grades
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_course_grade();

-- Trigger to automatically set grade letter when percentage is updated
CREATE OR REPLACE FUNCTION trigger_set_grade_letter()
RETURNS TRIGGER AS $$
BEGIN
    NEW.grade_letter := calculate_letter_grade(NEW.percentage);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_student_grade_letter_update
    BEFORE INSERT OR UPDATE ON student_grades
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_grade_letter();

-- =================================
-- ROW LEVEL SECURITY
-- =================================

ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_scales ENABLE ROW LEVEL SECURITY;

-- Policies for students - can view their own data
CREATE POLICY "Students can view their enrollments" ON course_enrollments
    FOR SELECT USING (student_id = (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their grades" ON student_grades
    FOR SELECT USING (student_id = (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their course grades" ON course_grades
    FOR SELECT USING (student_id = (SELECT id FROM students WHERE user_id = auth.uid()));

-- Policies for faculty - can manage assessments for their courses
CREATE POLICY "Faculty can manage assessments" ON assessment_configs
    FOR ALL USING (created_by = (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "Faculty can grade assessments" ON student_grades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assessments a
            JOIN assessment_configs ac ON a.config_id = ac.id
            WHERE a.id = student_grades.assessment_id
            AND ac.created_by = (SELECT id FROM employees WHERE user_id = auth.uid())
        )
    );

-- Admin policies - full access
CREATE POLICY "Admins have full access" ON academic_programs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM employees WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Similar admin policies for other tables...
CREATE POLICY "Admins manage courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM employees WHERE user_id = auth.uid() AND role IN ('admin', 'staff'))
);

-- =================================
-- SAMPLE DATA
-- =================================

-- Insert sample academic programs
INSERT INTO academic_programs (name, code, description, duration_semesters, total_credits) VALUES
('Bachelor of Computer Science', 'BCS', 'Comprehensive computer science program', 8, 120),
('Bachelor of Business Administration', 'BBA', 'Business administration and management', 8, 120),
('Bachelor of Engineering', 'BE', 'Engineering program with multiple specializations', 8, 128);

-- Insert sample courses
INSERT INTO courses (program_id, name, code, description, credits, semester)
SELECT
    ap.id,
    course_data.name,
    course_data.code,
    course_data.description,
    course_data.credits,
    course_data.semester
FROM academic_programs ap
CROSS JOIN (VALUES
    ('Programming Fundamentals', 'CS101', 'Introduction to programming concepts', 3, 1),
    ('Data Structures', 'CS201', 'Fundamental data structures and algorithms', 4, 2),
    ('Database Systems', 'CS301', 'Database design and management', 3, 3),
    ('Software Engineering', 'CS401', 'Software development lifecycle', 4, 4),
    ('Mathematics I', 'MATH101', 'Calculus and linear algebra', 3, 1),
    ('Statistics', 'STAT201', 'Statistical analysis and probability', 3, 2)
) AS course_data(name, code, description, credits, semester)
WHERE ap.code = 'BCS';

-- The schema is now ready for the academic grading system!
