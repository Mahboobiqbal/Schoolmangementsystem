// Re-export the institution model to avoid duplicate "admin" model registration
// The institutionSchema.js defines the canonical "admin" model with both
// institutionName (new) and schoolName (legacy backward compatibility) fields.
module.exports = require("./institutionSchema.js");
