// Comprehensive API test script
const http = require("http");

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Academic Management System - Full Test    ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // ============ 1. ADMIN TESTS ============
  console.log("📋 1. ADMIN / INSTITUTION TESTS");

  // Login
  const loginRes = await makeRequest("/AdminLogin", "POST", {
    email: "admin@test.com",
    password: "password123",
  });
  assert(loginRes.status === 200 && loginRes.data._id, "Admin Login");
  const adminId = loginRes.data._id;

  // Get Admin Detail
  const adminDetail = await makeRequest(`/Admin/${adminId}`, "GET");
  assert(adminDetail.data.name === "Test Admin", "Get Admin Detail");
  assert(
    adminDetail.data.institutionName === "Test University",
    "Institution Name present",
  );

  // ============ 2. PROGRAM TESTS ============
  console.log("\n📋 2. PROGRAM TESTS");

  const programs = await makeRequest(`/Programs/${adminId}`, "GET");
  assert(
    Array.isArray(programs.data) && programs.data.length > 0,
    "Get Programs List",
  );

  const programId = programs.data.find(
    (p) => p.programName === "Computer Science",
  )?._id;
  assert(!!programId, "Find Computer Science Program");

  if (programId) {
    const programDetail = await makeRequest(`/Program/${programId}`, "GET");
    assert(
      programDetail.data.programName === "Computer Science",
      "Get Program Detail",
    );

    const programLearners = await makeRequest(
      `/Program/Learners/${programId}`,
      "GET",
    );
    assert(programLearners.status === 200, "Get Program Learners");

    const programStats = await makeRequest(`/ProgramStats/${programId}`, "GET");
    assert(programStats.data.program, "Get Program Stats");
  }

  // ============ 3. MODULE TESTS ============
  console.log("\n📋 3. MODULE TESTS");

  const modules = await makeRequest(`/Modules/${adminId}`, "GET");
  assert(
    Array.isArray(modules.data) && modules.data.length > 0,
    "Get Modules List",
  );

  const moduleId = modules.data[0]?._id;
  if (moduleId) {
    const moduleDetail = await makeRequest(`/Module/${moduleId}`, "GET");
    assert(moduleDetail.data.moduleName, "Get Module Detail");

    if (programId) {
      const freeModules = await makeRequest(`/FreeModules/${programId}`, "GET");
      assert(freeModules.status === 200, "Get Free Modules");
    }
  }

  // ============ 4. LEARNER TESTS ============
  console.log("\n📋 4. LEARNER TESTS");

  const learners = await makeRequest(`/Learners/${adminId}`, "GET");
  assert(
    Array.isArray(learners.data) && learners.data.length > 0,
    "Get Learners List",
  );

  // Login learner
  const learnerLogin = await makeRequest("/LearnerLogin", "POST", {
    enrollmentId: "001",
    learnerName: "John Learner",
    password: "password123",
  });
  assert(learnerLogin.data._id || learnerLogin.data.name, "Learner Login");

  const learnerId = learners.data.find((l) => l.name === "John Learner")?._id;
  if (learnerId) {
    const learnerDetail = await makeRequest(`/Learner/${learnerId}`, "GET");
    assert(learnerDetail.data.name === "John Learner", "Get Learner Detail");

    const transcript = await makeRequest(
      `/Learner/Transcript/${learnerId}`,
      "GET",
    );
    assert(
      transcript.data.learnerInfo || transcript.data.message,
      "Get Learner Transcript",
    );

    const performance = await makeRequest(
      `/Learner/Performance/${learnerId}`,
      "GET",
    );
    assert(performance.status === 200, "Get Learner Performance");
  }

  // ============ 5. FACULTY TESTS ============
  console.log("\n📋 5. FACULTY TESTS");

  const faculty = await makeRequest(`/Faculty/${adminId}`, "GET");
  assert(
    Array.isArray(faculty.data) && faculty.data.length > 0,
    "Get Faculty List",
  );

  // Faculty Login
  const facultyLogin = await makeRequest("/FacultyLogin", "POST", {
    email: "professor@test.com",
    password: "password123",
  });
  assert(facultyLogin.data._id || facultyLogin.data.name, "Faculty Login");

  const facultyId = faculty.data[0]?._id;
  if (facultyId) {
    const facultyDetail = await makeRequest(
      `/FacultyDetail/${facultyId}`,
      "GET",
    );
    assert(facultyDetail.data.name, "Get Faculty Detail");

    const workload = await makeRequest(`/FacultyWorkload/${facultyId}`, "GET");
    assert(workload.status === 200, "Get Faculty Workload");
  }

  // ============ 6. ANNOUNCEMENT TESTS ============
  console.log("\n📋 6. ANNOUNCEMENT TESTS");

  const createAnnouncement = await makeRequest("/AnnouncementCreate", "POST", {
    title: "Test Announcement",
    content: "This is a test announcement for the system.",
    category: "General",
    priority: "Normal",
    targetAudience: "All",
    adminID: adminId,
  });
  assert(
    createAnnouncement.data._id || createAnnouncement.data.title,
    "Create Announcement",
  );

  const announcements = await makeRequest(`/Announcements/${adminId}`, "GET");
  assert(Array.isArray(announcements.data), "Get Announcements");

  // ============ 7. FEEDBACK TESTS ============
  console.log("\n📋 7. FEEDBACK TESTS");

  if (learnerId) {
    const createFeedback = await makeRequest("/FeedbackCreate", "POST", {
      userId: learnerId,
      userType: "learner",
      feedbackType: "Suggestion",
      category: "Academic",
      subject: "Course Feedback",
      description: "Great course, would recommend more labs.",
      priority: "Medium",
      adminID: adminId,
    });
    assert(
      createFeedback.data._id || createFeedback.data.subject,
      "Create Feedback",
    );
  }

  const feedbacks = await makeRequest(`/FeedbackList/${adminId}`, "GET");
  assert(feedbacks.status === 200, "Get Feedback List");

  const feedbackStats = await makeRequest(`/FeedbackStats/${adminId}`, "GET");
  assert(feedbackStats.status === 200, "Get Feedback Stats");

  // ============ 8. ASSESSMENT TESTS ============
  console.log("\n📋 8. ASSESSMENT TESTS");

  if (moduleId && programId) {
    const createAssessment = await makeRequest("/AssessmentCreate", "POST", {
      title: "Midterm Exam",
      assessmentType: "MidTerm",
      module: moduleId,
      program: programId,
      adminID: adminId,
      maxMarks: 100,
      passingMarks: 40,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    assert(
      createAssessment.data._id || createAssessment.data.title,
      "Create Assessment",
    );

    const assessments = await makeRequest(`/Assessments/${adminId}`, "GET");
    assert(assessments.status === 200, "Get Assessments");
  }

  // ============ 9. CALENDAR TESTS ============
  console.log("\n📋 9. ACADEMIC CALENDAR TESTS");

  const createCalendar = await makeRequest("/CalendarCreate", "POST", {
    adminID: adminId,
    academicYear: "2025-2026",
    semester: "Fall 2025",
    events: [
      {
        title: "Semester Start",
        eventType: "Semester Start",
        startDate: "2025-09-01",
        endDate: "2025-09-01",
      },
    ],
  });
  assert(createCalendar.status === 200, "Create/Check Calendar");

  const calendars = await makeRequest(`/Calendars/${adminId}`, "GET");
  assert(calendars.status === 200, "Get Calendars");

  const currentCalendar = await makeRequest(
    `/CurrentCalendar/${adminId}`,
    "GET",
  );
  assert(currentCalendar.status === 200, "Get Current Calendar");

  // ============ 10. LEGACY ROUTE TESTS ============
  console.log("\n📋 10. LEGACY ROUTE TESTS");

  const students = await makeRequest(`/Students/${adminId}`, "GET");
  assert(students.status === 200, "Legacy: Get Students");

  const teachers = await makeRequest(`/Teachers/${adminId}`, "GET");
  assert(teachers.status === 200, "Legacy: Get Teachers");

  const sclasses = await makeRequest(`/SclassList/${adminId}`, "GET");
  assert(sclasses.status === 200, "Legacy: Get Sclass List");

  const notices = await makeRequest(`/NoticeList/${adminId}`, "GET");
  assert(notices.status === 200, "Legacy: Get Notice List");

  const complains = await makeRequest(`/ComplainList/${adminId}`, "GET");
  assert(complains.status === 200, "Legacy: Get Complain List");

  // ============ SUMMARY ============
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log(`║   Results: ${passed} passed, ${failed} failed              ║`);
  console.log("╚══════════════════════════════════════════════╝");

  if (failed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! System is working correctly.");
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed. Check output above.`);
  }
}

runTests().catch((e) => console.error("Test suite error:", e.message));
