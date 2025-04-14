import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    jobTitle: {
        type: String,
        trim: true
    },
    yearOfExp: {
        type: String,
        trim: true
    },
    specialization: {
        type: String,
        trim: true,
        default: "None"
    },
    status: {
        type: String,
        trim: true,
        default: "Unknown"
    },
    bio: {
        type: String,
        trim: true
    },
    earning: {
        type: Number,
        default: 0 // not coming from form, for later use
    },
    rating: {
        type: Number,
        default: 0 // not coming from form, for later use
    }
}, {
    timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;