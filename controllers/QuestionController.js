import Form from '../models/Form.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

export const addQuestion = asyncHandler( async(req, res) => {
    // url : domain/form/:formId/questions

    const formId = req.params.formId
    const userId = req.jwt.id

    if(!formId) {
        res.status(400)
        throw new Error("ID_IS_REQUIRED")
    }

    if(!mongoose.Types.ObjectId.isValid(formId)){
        res.status(400)
        throw new Error("INVALID_ID")
    }

    const newQuestion = {
        id: mongoose.Types.ObjectId(),
        type: 'Text',
        question: null,
        options: [],
        required: false
    }

    const form = await Form.findOneAndUpdate(
        { _id: formId, userId }, 
        { $push: { questions: newQuestion }}, 
        { new: true })

    if(!form){
        res.status(404)
        throw new Error("ADD_QUESTION_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "ADD_QUESTION_SUCCESS",
        form
    })
})