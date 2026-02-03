// Script to create test data
const http = require("http");

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function createTestData() {
  console.log("=== Creating Test Data ===\n");

  // 1. Register Admin
  console.log("1. Registering Admin...");
  const adminResult = await makeRequest("/AdminReg", "POST", {
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    schoolName: "Test University",
    institutionName: "Test University",
  });
  console.log("Admin Result:", JSON.stringify(adminResult, null, 2));

  let adminId = adminResult._id;
  if (!adminId) {
    console.log("Admin registration failed, trying to login with existing...");
    const loginResult = await makeRequest("/AdminLogin", "POST", {
      email: "admin@test.com",
      password: "password123",
    });
    console.log("Login Result:", JSON.stringify(loginResult, null, 2));
    adminId = loginResult._id;
    if (!adminId) {
      console.error("Could not get Admin ID. Aborting.");
      return;
    }
  }

  // 2. Create a Program
  console.log("\n2. Creating Program...");
  const programResult = await makeRequest("/ProgramCreate", "POST", {
    programName: "Computer Science",
    programCode: "CS101",
    adminID: adminId,
  });
  console.log("Program Result:", JSON.stringify(programResult, null, 2));
  const programId =
    programResult._id ||
    (programResult.message &&
      (await makeRequest("/Programs/" + adminId, "GET")).find(
        (p) => p.programName === "Computer Science",
      )?._id);

  if (!programId) {
    console.error("Could not get Program ID. Result:", programResult);
    return;
  }

  // 3. Create a Module
  console.log("\n3. Creating Module...");
  const moduleResult = await makeRequest("/ModuleCreate", "POST", {
    modules: [
      {
        moduleName: "Web Development",
        moduleCode: "WD101",
        sessions: 45,
        credits: 3,
        semester: 1,
      },
    ],
    programName: programId,
    adminID: adminId,
  });
  console.log("Module Result:", JSON.stringify(moduleResult, null, 2));

  let moduleId = Array.isArray(moduleResult)
    ? moduleResult[0]?._id
    : moduleResult._id;

  if (!moduleId && moduleResult.message) {
    // Try to find existing module
    const modules = await makeRequest("/Modules/" + adminId, "GET");
    moduleId = modules.find((m) => m.moduleCode === "WD101")?._id;
  }

  if (!moduleId) {
    console.error("Could not get Module ID. Result:", moduleResult);
    return;
  }

  // 4. Create a Learner
  console.log("\n4. Creating Learner...");
  const learnerResult = await makeRequest("/LearnerReg", "POST", {
    name: "John Learner",
    enrollmentId: "001",
    email: "john@test.com",
    password: "password123",
    programName: programId,
    adminID: adminId,
    role: "Learner",
  });
  console.log("Learner Result:", JSON.stringify(learnerResult, null, 2));

  // 5. Create Faculty
  console.log("\n5. Creating Faculty...");
  const facultyResult = await makeRequest("/FacultyReg", "POST", {
    name: "Professor Smith",
    email: "professor@test.com",
    password: "password123",
    role: "Faculty",
    institution: adminId,
    assignedModule: moduleId,
    assignedProgram: programId,
  });
  console.log("Faculty Result:", JSON.stringify(facultyResult, null, 2));

  console.log("\n=== Test Data Created Successfully ===");
  console.log("\nTest Credentials:");
  console.log("Admin: admin@test.com / password123");
  console.log(
    'Learner: Enrollment ID "001", Name "John Learner" / password123',
  );
  console.log("Faculty: professor@test.com / password123");
}

createTestData().catch(console.error);
