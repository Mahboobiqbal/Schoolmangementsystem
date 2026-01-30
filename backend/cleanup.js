const mongoose = require("mongoose");
require("dotenv").config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Delete documents with null schoolName
    const deleteResult = await mongoose.connection.db
      .collection("admins")
      .deleteMany({
        schoolName: null,
      });
    console.log(
      "Deleted",
      deleteResult.deletedCount,
      "documents with null schoolName",
    );

    // Drop the old schoolName index
    try {
      await mongoose.connection.db
        .collection("admins")
        .dropIndex("schoolName_1");
      console.log("Dropped schoolName_1 index");
    } catch (err) {
      console.log("Index already dropped or does not exist");
    }

    console.log("Cleanup completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup error:", err);
    process.exit(1);
  }
};

cleanup();
