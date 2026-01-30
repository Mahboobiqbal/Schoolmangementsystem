const mongoose = require('mongoose');

const learnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    enrollmentId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    programName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'program',
        required: true,
    },
    semester: {
        type: Number,
        default: 1,
        min: 1,
        max: 8
    },
    batch: {
        type: String,
        required: false
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Learner"
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
        default: 'Active'
    },
    assessmentResults: [
        {
            moduleName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'module',
            },
            assessmentType: {
                type: String,
                enum: ['Assignment', 'Quiz', 'MidTerm', 'Final', 'Project', 'Presentation'],
                default: 'Assignment'
            },
            marksObtained: {
                type: Number,
                default: 0
            },
            maxMarks: {
                type: Number,
                default: 100
            },
            grade: {
                type: String,
                enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I'],
            },
            assessmentDate: {
                type: Date,
                default: Date.now
            },
            remarks: {
                type: String
            }
        }
    ],
    participation: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused'],
            required: true
        },
        moduleName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'module',
            required: true
        },
        engagementScore: {
            type: Number,
            min: 0,
            max: 10,
            default: 5
        },
        notes: {
            type: String
        }
    }],
    academicHistory: [{
        semester: Number,
        year: String,
        gpa: Number,
        creditsEarned: Number,
        creditsAttempted: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model("learner", learnerSchema);
