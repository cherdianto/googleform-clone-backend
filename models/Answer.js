import mongoose from "mongoose";

const AnswerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    formId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Form'
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }
},
{
    timestamps: {currentTime : () => Math.floor(Date.now() / 1000)},
    strict: false
})

export default mongoose.model('Answer', AnswerSchema)