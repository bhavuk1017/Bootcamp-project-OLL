import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: false,
        trim: true
    },
    teacher: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String, // or ObjectId if using MongoDB ObjectId
        // ref: 'Teacher',  // Assuming the teacher schema is named 'Teacher'
        required: false
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    scheduleDays: {
        type: [String], // e.g., ['Monday', 'Wednesday']
        required: false
    },
    sessionTime: {
        type: String, // or Date if using exact timestamps
        required: false,
        trim: true
    },
    sessionTopic: {
        type: String,
        required: false,
        trim: true
    },
    totalStudents: {
        type: Number,
        default: 10
    },
    revenue: {
        type: Number,
        default: 100 // optional in form, calculated later
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;