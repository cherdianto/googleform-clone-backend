// user 
// - fullname
// - email
// - password
// - salt
// - status
// - timestamp (createdAt, updatedAt)

import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    refreshToken: {
        type: String
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

export default mongoose.model('User', UserSchema)