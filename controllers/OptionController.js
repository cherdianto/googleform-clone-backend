import mongoose, { mongo } from "mongoose";
import Form from "../models/Form.js";
import asyncHandler from 'express-async-handler'

export const addOption = asyncHandler( async(req, res) => {
    if(!req.body.options) {
        res.status(400)
        throw new Error('OPTIONS_REQUIRED')
    }

    const userId = req.jwt.id
    const formId = req.params.formId
    const questionId = req.params.questionId

    if(!formId) {
        res.status(400)
        throw new Error("FORM_ID_IS_REQUIRED")
    }

    if(!questionId) {
        res.status(400)
        throw new Error("QUESTION_ID_IS_REQUIRED")
    }

    if(!mongoose.Types.ObjectId.isValid(formId)){
        res.status(400)
        throw new Error("INVALID_FORM_ID")
    }

    if(!mongoose.Types.ObjectId.isValid(questionId)){
        res.status(400)
        throw new Error("INVALID_QUESTION_ID")
    }

    let option = {
        id: mongoose.Types.ObjectId(),
        value: req.body.options
    }

    const question = await Form.findOneAndUpdate(
        { _id: formId, userId },
        { $push : {
            'questions.$[indexQuestion].options' : option
        }},
        {
            arrayFilters: [{ "indexQuestion.id" : mongoose.Types.ObjectId(questionId)}], new : true
        }
    )

    if(!question){
        res.status(500)
        throw new Error("UPDATE_OPTION_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "UPDATE_OPTION_SUCCESS",
        option
    })
})