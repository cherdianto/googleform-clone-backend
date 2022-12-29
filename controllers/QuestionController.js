import Form from '../models/Form.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

const allowedTypes = ["Text", "Radio", "Email", "Checkbox", "Dropdown"]

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

export const updateQuestion = asyncHandler( async(req, res) => {
    // url : domain/form/:formId/questions/:questionId

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

    let field = {}

    if(req.body.hasOwnProperty('question')){
        field['questions.$[indexQuestion].question'] = req.body.question
    } else if(req.body.hasOwnProperty('required')){
        field['questions.$[indexQuestion].required'] = req.body.required
    } else if(req.body.hasOwnProperty('type')){
        // check if the new type is allowed
        if(!allowedTypes.includes(req.body.type)){
            res.status(400)
            throw new Error("INVALID_TYPE")
        }
        field['questions.$[indexQuestion].type'] = req.body.type
    }

    const question = await Form.findOneAndUpdate(
        { _id: formId, userId }, 
        { $set: field }, 
        { arrayFilters: [{ 
            'indexQuestion.id': mongoose.Types.ObjectId(questionId) }], 
            new: true 
        })

    if(!question){
        res.status(404)
        throw new Error("QUESTION_UPDATE_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "QUESTION_UPDATE_SUCCESS",
        question
    })
})