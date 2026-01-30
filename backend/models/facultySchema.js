const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Faculty"
    },
    designation: {
        type: String,
        enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Instructor', 'Teaching Assistant'],
        default: 'Instructor'
    },
    department: {
        type: String,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    assignedModule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'module',
    },
    assignedProgram: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'program',
        required: true,
    },
    specialization: {
        type: String,
    },
    qualification: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Inactive'],
        default: 'Active'
    },
    courseAllocation: [{
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'module'
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'program'
        },
        semester: {
            type: Number
        },
        academicYear: {
            type: String
        }
    }],
    workload: {
        currentCredits: {
            type: Number,
            default: 0
        },
        maxCredits: {
            type: Number,
            default: 18
        }
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        startTime: String,
        endTime: String,
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'module'
        },
        room: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("faculty", facultySchema);
