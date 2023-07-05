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
        throw new Error("ADD_OPTION_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option
    })
})

export const updateOption = asyncHandler( async(req, res) => {
    if(!req.body.options) {
        res.status(400)
        throw new Error('OPTIONS_REQUIRED')
    }

    const userId = req.jwt.id
    const formId = req.params.formId
    const questionId = req.params.questionId
    const optionId = req.params.optionId

    if(!formId) {
        res.status(400)
        throw new Error("FORM_ID_IS_REQUIRED")
    }

    if(!questionId) {
        res.status(400)
        throw new Error("QUESTION_ID_IS_REQUIRED")
    }

    if(!optionId) {
        res.status(400)
        throw new Error("OPTION_ID_IS_REQUIRED")
    }

    if(!mongoose.Types.ObjectId.isValid(formId)){
        res.status(400)
        throw new Error("INVALID_FORM_ID")
    }

    if(!mongoose.Types.ObjectId.isValid(questionId)){
        res.status(400)
        throw new Error("INVALID_QUESTION_ID")
    }

    if(!mongoose.Types.ObjectId.isValid(optionId)){
        res.status(400)
        throw new Error("INVALID_OPTION_ID")
    }

    // let option = {
    //     id: mongoose.Types.ObjectId(),
    //     value: req.body.options
    // }

    const question = await Form.findOneAndUpdate(
        { _id: formId, userId },
        { $set : {
            'questions.$[indexQuestion].options.$[indexOption].value' : req.body.options
        }},
        {
            arrayFilters: [
                { "indexQuestion.id" : mongoose.Types.ObjectId(questionId)}, 
                { "indexOption.id" : mongoose.Types.ObjectId(optionId)}], 
            new : true
        }
    )

    if(!question){
        res.status(500)
        throw new Error("UPDATE_OPTION_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "UPDATE_OPTION_SUCCESS",
        value: req.body.options
    })
})

export const deleteOption = asyncHandler( async(req, res) => {
    const userId = req.jwt.id
    const formId = req.params.formId
    const questionId = req.params.questionId
    const optionId = req.params.optionId

    if(!formId) {
        res.status(400)
        throw new Error("FORM_ID_IS_REQUIRED")
    }

    if(!questionId) {
        res.status(400)
        throw new Error("QUESTION_ID_IS_REQUIRED")
    }

    if(!optionId) {
        res.status(400)
        throw new Error("OPTION_ID_IS_REQUIRED")
    }

    if(!mongoose.Types.ObjectId.isValid(formId)){
        res.status(400)
        throw new Error("INVALID_FORM_ID")
    }

    if(!mongoose.Types.ObjectId.isValid(questionId)){
        res.status(400)
        throw new Error("INVALID_QUESTION_ID")
    }

    if(!mongoose.Types.ObjectId.isValid(optionId)){
        res.status(400)
        throw new Error("INVALID_OPTION_ID")
    }

    const question = await Form.findOneAndUpdate(
        { _id: formId, userId },
        { $pull : {
            'questions.$[indexQuestion].options' : { id:  mongoose.Types.ObjectId(optionId)}
        }},
        {
            arrayFilters: [{ "indexQuestion.id" : mongoose.Types.ObjectId(questionId)}], 
            new : true
        }
    )

    if(!question){
        res.status(500)
        throw new Error("DELETE_OPTION_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "DELETE_OPTION_SUCCESS",
        question
    })
})