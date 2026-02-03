// Script to delete old/duplicate collections from MongoDB
// IMPORTANT: This will permanently delete the old collections!
// Make a backup first if needed!

const mongoose = require("mongoose");
require("dotenv").config();

const oldCollections = ["student", "teacher", "subject", "sclass"];

const deleteOldCollections = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    console.log("\n✅ Connected to MongoDB");
    console.log(`📊 Database: ${db.getName()}\n`);

    // Get list of all collections
    console.log("📋 Current Collections in Database:");
    const allCollections = await db.listCollections().toArray();
    const collectionNames = allCollections.map((c) => c.name);
    console.log(collectionNames.map((name) => `   • ${name}`).join("\n"));

    console.log("\n⚠️  About to DELETE these old collections:");
    oldCollections.forEach((col) => {
      if (collectionNames.includes(col)) {
        console.log(`   🗑️  ${col}`);
      }
    });

    console.log(
      "\n❌ WARNING: This action CANNOT be undone! Make sure you have a backup!\n",
    );

    // Ask for confirmation
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Type 'YES' to confirm deletion of old collections: ",
      async (answer) => {
        if (answer !== "YES") {
          console.log("\n❌ Deletion cancelled. No changes made.");
          rl.close();
          await mongoose.disconnect();
          return;
        }

        try {
          // Delete each old collection
          let deletedCount = 0;
          for (const collectionName of oldCollections) {
            try {
              if (collectionNames.includes(collectionName)) {
                await db.collection(collectionName).drop();
                console.log(`✅ Deleted: ${collectionName}`);
                deletedCount++;
              } else {
                console.log(`⏭️  Skipped: ${collectionName} (doesn't exist)`);
              }
            } catch (err) {
              console.error(
                `❌ Error deleting ${collectionName}:`,
                err.message,
              );
            }
          }

          console.log(`\n🎉 Deleted ${deletedCount} old collection(s)!\n`);

          // Show remaining collections
          console.log("📋 Remaining Collections in Database:");
          const remainingCollections = await db.listCollections().toArray();
          const remainingNames = remainingCollections.map((c) => c.name);
          console.log(remainingNames.map((name) => `   • ${name}`).join("\n"));

          console.log("\n✅ Cleanup completed successfully!");
          console.log("\n📌 Your data is now using ONLY the new collections:");
          console.log("   • learner (previously: student)");
          console.log("   • faculty (previously: teacher)");
          console.log("   • module (previously: subject)");
          console.log("   • program (previously: sclass)");

          rl.close();
          await mongoose.disconnect();
        } catch (err) {
          console.error("❌ Cleanup failed:", err);
          rl.close();
          await mongoose.disconnect();
          process.exit(1);
        }
      },
    );
  } catch (err) {
    console.error("❌ Connection Error:", err);
    process.exit(1);
  }
};

// Show warning before starting
console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   🗑️  DATABASE CLEANUP TOOL                      ║
║                                                                 ║
║  This script will DELETE the old/duplicate collections:        ║
║  • student   (keep: learner)                                   ║
║  • teacher   (keep: faculty)                                   ║
║  • subject   (keep: module)                                    ║
║  • sclass    (keep: program)                                   ║
║                                                                 ║
║  ⚠️  WARNING: This action CANNOT be undone!                     ║
║  📦 Make a backup of your database first!                      ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
`);

deleteOldCollections();
