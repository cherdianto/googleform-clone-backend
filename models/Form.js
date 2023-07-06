import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const FormSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    questions: {
        type: Array
    },
    invites: {
        //array of emails whose the forms can be accessed/shared
        type: Array
    },
    public: {
        type: Boolean
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }   
},
{
    timestamps: {currentTime : () => Math.floor(Date.now() / 1000)}
})

FormSchema.plugin(mongoosePaginate)

// CREATE RELATIONSHIP
FormSchema.virtual('answers', {
    ref: "Answer", // model name that want to be connected
    localField: "_id", // _id in model form
    foreignField: "formId", // formId in model answer
})

export default mongoose.model('Form', FormSchema)