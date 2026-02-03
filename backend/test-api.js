// Simple API test script
const http = require("http");

function testEndpoint(path, method = "GET", data = null) {
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
        console.log(`\n${method} ${path}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(body);
          console.log("Response:", JSON.stringify(json, null, 2));
        } catch (e) {
          console.log("Response:", body.substring(0, 200));
        }
        resolve();
      });
    });

    req.on("error", (e) => {
      console.log(`${method} ${path} - Error: ${e.message}`);
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== API Test Suite ===\n");

  // Test 1: Admin Login with test credentials
  console.log("--- Test 1: Admin Login ---");
  await testEndpoint("/AdminLogin", "POST", {
    email: "admin@test.com",
    password: "password123",
  });

  // Test 2: Student Login
  console.log("\n--- Test 2: Student Login ---");
  await testEndpoint("/StudentLogin", "POST", {
    rollNum: "1001",
    studentName: "John Learner",
    password: "password123",
  });

  // Test 3: Teacher Login
  console.log("\n--- Test 3: Teacher Login ---");
  await testEndpoint("/TeacherLogin", "POST", {
    email: "professor@test.com",
    password: "password123",
  });

  console.log("\n=== Tests Complete ===");
}

runTests().catch(console.error);
