import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    school: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,
        // ref: 'Batch',
        required: true
    },
    earning: {
        type: Number,
        default: 0 // not coming from form, for later use
    },
    attendance: {
        type: Number,
        default: 0 // not coming from form, for later use
    },
    taskCompletion: {
        type: Number,
        default: 0 // not coming from form, for later use
    },
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
export default Student;