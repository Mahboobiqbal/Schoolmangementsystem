const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true,
    },
    programCode: {
        type: String,
        required: true,
    },
    programType: {
        type: String,
        enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate', 'Doctorate'],
        default: 'Undergraduate'
    },
    department: {
        type: String,
    },
    duration: {
        type: Number,
        default: 4, // years
    },
    totalSemesters: {
        type: Number,
        default: 8,
    },
    totalCredits: {
        type: Number,
        default: 120,
    },
    description: {
        type: String,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Archived'],
        default: 'Active'
    },
    curriculum: [{
        semester: Number,
        modules: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'module'
        }],
        minCredits: Number,
        maxCredits: Number
    }],
    eligibility: {
        minQualification: String,
        minPercentage: Number,
        otherRequirements: String
    },
    fees: {
        perSemester: Number,
        perYear: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("program", programSchema);
