import Form from "../models/Form.js";
import asyncHandler from 'express-async-handler'
import mongoose from "mongoose";

export const createForm = asyncHandler( async (req, res) => {
    const form = await Form.create({
        userId: req.jwt.id,
        title: 'Untitled Form',
        description: null,
        options: [],
        public: true
    })

    if(!form) {
        res.status(500)
        throw new Error("CREATE_FORM_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "CREATE_FORM_SUCCESS",
        form
    })
})

export const showForm = asyncHandler( async(req, res) => {
    // url : domain/form/?id=iuser_id

    const id = req.params.id
    const userId = req.jwt.id

    if(!id) {
        res.status(400)
        throw new Error("ID_IS_REQUIRED")
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400)
        throw new Error("INVALID_ID")
    }

    const form = await Form.findOne({ _id: id, userId })

    if(!form){
        res.status(404)
        throw new Error("FORM_NOT_FOUND")
    }

    res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form
    })
})