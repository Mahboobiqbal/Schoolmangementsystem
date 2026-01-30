const mongoose = require("mongoose");
require("dotenv").config();

const migrate = async () => {
  try {
    // Extract base URL (remove database name if present)
    let mongoUrl = process.env.MONGO_URL;
    const baseUrl = mongoUrl.includes("/schoolManagement")
      ? mongoUrl.replace("/schoolManagement", "/test")
      : mongoUrl + (mongoUrl.includes("?") ? "" : "/test");

    console.log("Connecting to test database...");
    await mongoose.connect(baseUrl);

    const testDb = mongoose.connection.db;

    // Get all collections from test database
    const collections = await testDb.listCollections().toArray();
    const collectionNames = collections
      .map((c) => c.name)
      .filter((n) => !n.startsWith("system."));

    console.log(
      "Found collections in test database:",
      collectionNames.join(", "),
    );

    if (collectionNames.length === 0) {
      console.log("No collections found in test database. Skipping migration.");
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    // Copy data to an array
    const allData = {};
    for (const collectionName of collectionNames) {
      const collection = testDb.collection(collectionName);
      const documents = await collection.find({}).toArray();
      allData[collectionName] = documents;
      console.log(`Read ${documents.length} documents from ${collectionName}`);
    }

    // Close test connection
    await mongoose.connection.close();
    console.log("\nConnecting to schoolManagement database...");

    // Connect to new database
    await mongoose.connect(process.env.MONGO_URL);
    const newDb = mongoose.connection.db;

    // Insert data
    for (const collectionName of collectionNames) {
      const documents = allData[collectionName];
      if (documents.length > 0) {
        const collection = newDb.collection(collectionName);
        await collection.insertMany(documents);
        console.log(
          `✓ Migrated ${documents.length} documents to ${collectionName}`,
        );
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log(
      '\nNow you need to manually delete the "test" database from MongoDB Atlas:',
    );
    console.log("1. Go to https://cloud.mongodb.com");
    console.log("2. Select your cluster");
    console.log("3. Click Collections");
    console.log('4. Find the "test" database and delete it');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err.message);
    console.error(err);
    process.exit(1);
  }
};

migrate();
