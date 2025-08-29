# 🧪 Academic Grading System Testing Guide

Follow this step-by-step guide to test your complete 40%/60% academic grading system.

## 📋 **Step 1: Execute Database Schema**

### 1.1 Open Supabase SQL Editor
1. **Go to**: https://mphukdmfachfactydnht.supabase.co/project/_/sql/new
2. **Login** with your Supabase credentials

### 1.2 Execute Academic Schema
1. **Open file**: `/supabase/academic-schema.sql` in your project
2. **Copy all content** (456 lines of SQL)
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** to execute the schema
5. **Wait for completion** (should take 30-60 seconds)

### 1.3 Execute Sample Data (Optional)
1. **Open file**: `/supabase/sample-data.sql`
2. **Copy all content** and paste in SQL Editor
3. **Click "Run"** to create test data
4. **Verify success** - should show sample counts

---

## 🎓 **Step 2: Test Faculty Assessment Management**

### 2.1 Access Faculty Portal
1. **Start dev server**: `bun run dev`
2. **Navigate to**: http://localhost:3000/dash/academic/faculty-assessments
3. **Login** as a faculty member (or use demo account)

### 2.2 Course Overview Testing
**Expected View:**
```
📊 Course Statistics Cards:
├── Enrolled Students: [Number]
├── Internal Assessments: [Count] (40% weight)
├── External Assessments: [Count] (60% weight)
└── Pending Grades: [Count]
```

### 2.3 Create Assessment Configuration
1. **Click "Create Assessment Type"**
2. **Fill out form**:
   - **Assessment Type**: Quiz
   - **Category**: Internal (40%)
   - **Name**: "Weekly Quiz 1"
   - **Weight Percentage**: 10
   - **Max Marks**: 50

3. **Submit and verify** assessment appears in list

### 2.4 Create External Assessment
1. **Create another assessment**:
   - **Assessment Type**: Final Exam
   - **Category**: External (60%)
   - **Name**: "Final Examination"
   - **Weight Percentage**: 60
   - **Max Marks**: 150

### 2.5 Test Assessment Creation
1. **Select an assessment configuration**
2. **Click "Create Assessment"**
3. **Fill details**:
   - **Title**: "Midterm Quiz - Programming Basics"
   - **Total Marks**: 50
   - **Duration**: 60 minutes

### 2.6 Test Grading Interface
1. **Go to "Grading" tab**
2. **View student submissions**
3. **Enter sample grades** for testing
4. **Verify grade calculations** update automatically

**Expected Grade Display:**
```
Student: Jane Smith
Marks: 42/50
Percentage: 84.0%
Grade: B+
Status: ✅ Graded
```

---

## 🎓 **Step 3: Test Student Grade Portal**

### 3.1 Access Student Portal
1. **Navigate to**: http://localhost:3000/dash/academic/student-grades
2. **Switch to student role** or use demo student account

### 3.2 Test GPA Dashboard
**Expected View:**
```
📊 Key Metrics:
├── Overall GPA: [X.XX]/4.0
├── Credits Earned: [Number]
├── Current Courses: [Count]
└── Semester GPA: [X.XX]
```

### 3.3 Test Progress Indicators
**Verify:**
- **Degree Progress Bar**: Shows completion percentage
- **GPA Target Tracking**: Progress toward 3.0+ GPA
- **Academic Standing**: Good Standing/Warning status

### 3.4 Test Course Grades Tab
**Expected Display for Each Course:**
```
📚 CS101 - Programming Fundamentals
├── Final Grade: B+ (87.5%)
├── Internal (40%): 85.0%
│   ├── Quiz 1: 42/50 (84%)
│   ├── Assignment 1: 88/100 (88%)
│   └── Participation: 23/25 (92%)
└── External (60%): 135/150 (90%)
    └── Final Exam: 135/150 (90%)
```

### 3.5 Test Assessment Details Tab
**Verify:**
- **Individual assessment breakdown**
- **Submission status indicators**
- **Grade letter assignments**
- **Category labeling** (Internal 40% / External 60%)

### 3.6 Test Analytics Tab
**Expected Charts:**
- **GPA Trend Over Time**: Line chart showing progress
- **Grade Distribution**: Bar chart of letter grades
- **Performance Summary**: Highest, lowest, average grades

### 3.7 Test Academic Record Tab
**Verify:**
- **Semester-wise breakdown**
- **Official transcript format**
- **Credit calculations**
- **Quality point tracking**

---

## 📊 **Step 4: Test Analytics Dashboard**

### 4.1 Access Analytics
1. **Navigate to**: http://localhost:3000/dash/analytics
2. **Verify admin/faculty access**

### 4.2 Test Real-time Metrics
**Expected KPI Cards:**
```
📈 Executive Dashboard:
├── Total Students: [Count] (+5.2% increase)
├── Total Revenue: $[Amount] (+8.1% increase)
├── Library Books: [Count] (Active loans)
└── Active Staff: [Count] (On leave count)
```

### 4.3 Test Academic Charts
**Verify Charts Display:**
- **Student Enrollment Trend**: Line chart over time
- **Financial Performance**: Area chart of revenue
- **Grade Distribution**: Donut chart of letter grades
- **Popular Assessment Types**: Horizontal bar chart

---

## ✅ **Step 5: Verification Checklist**

### 5.1 Core Functionality ✅
- [ ] **40%/60% Weight Distribution**: Internal + External calculations
- [ ] **Automated GPA Calculations**: Real-time 4.0 scale updates
- [ ] **Grade Letter Assignment**: A+ to F based on percentages
- [ ] **Multi-Assessment Types**: Quiz, Test, Assignment, Project, Lab, Final
- [ ] **Real-time Updates**: Grade changes reflect immediately

### 5.2 Faculty Features ✅
- [ ] **Course Management**: View enrolled students and statistics
- [ ] **Assessment Configuration**: Create internal/external assessment types
- [ ] **Assessment Creation**: Build specific assessments from configurations
- [ ] **Grading Interface**: Enter grades with automatic calculations
- [ ] **Performance Analytics**: View grade distributions and trends

### 5.3 Student Features ✅
- [ ] **GPA Tracking**: Overall and semester GPA with progress indicators
- [ ] **Grade Breakdown**: See internal (40%) and external (60%) components
- [ ] **Academic Progress**: Degree completion tracking with credit counts
- [ ] **Assessment Details**: Individual assessment grades and status
- [ ] **Transcript Generation**: Official academic record display

### 5.4 System Features ✅
- [ ] **Role-based Access**: Faculty vs Student vs Admin permissions
- [ ] **Real-time Data**: Live updates across all interfaces
- [ ] **Data Integrity**: Proper grade calculations and validations
- [ ] **Professional UI**: ERP-style interfaces with responsive design
- [ ] **Analytics Dashboard**: Executive reporting with interactive charts

---

## 🔧 **Testing Scenarios**

### Scenario 1: Complete Grade Workflow
1. **Faculty creates** assessment configuration (Internal, 10% weight)
2. **Faculty creates** specific assessment from configuration
3. **Students submit** (simulated with sample data)
4. **Faculty grades** student submissions
5. **System calculates** course grade (40% internal + 60% external)
6. **Student views** updated GPA and progress
7. **Analytics reflect** new grade data in charts

### Scenario 2: GPA Calculation Testing
1. **Enter grades** for multiple assessments
2. **Verify internal percentage** calculation (weighted average)
3. **Enter external exam grade**
4. **Verify final grade** = (Internal × 0.40) + (External × 0.60)
5. **Check GPA update** in student portal
6. **Verify transcript** shows correct quality points

### Scenario 3: Multi-Course Testing
1. **Create assessments** for different courses
2. **Enter grades** across multiple courses
3. **Verify semester GPA** calculation
4. **Check cumulative GPA** updates
5. **Test progress indicators** for degree completion

---

## 🚨 **Expected Results**

### Grade Calculation Example:
```
Course: CS101 Programming Fundamentals (3 credits)

Internal Assessments (40%):
├── Quiz 1: 42/50 = 84%
├── Assignment 1: 88/100 = 88%
├── Participation: 23/25 = 92%
└── Internal Average: 88% × 0.40 = 35.2%

External Assessment (60%):
└── Final Exam: 135/150 = 90% × 0.60 = 54.0%

Final Grade: 35.2% + 54.0% = 89.2% = B+
Quality Points: 3.3 × 3 credits = 9.9 points
```

### GPA Calculation:
```
Total Quality Points: 9.9 + [other courses]
Total Credits: 3 + [other courses]
GPA: Total Quality Points ÷ Total Credits
```

---

## 🎉 **Success Indicators**

When testing is complete, you should see:
- ✅ **Automated 40%/60% calculations** working correctly
- ✅ **Real-time GPA updates** as grades are entered
- ✅ **Professional ERP interfaces** for faculty and students
- ✅ **Comprehensive analytics** with live data visualization
- ✅ **Role-based access control** working properly
- ✅ **Complete academic workflow** from assessment to transcript

**Your academic grading system is now fully functional and ready for production use!** 🎓
