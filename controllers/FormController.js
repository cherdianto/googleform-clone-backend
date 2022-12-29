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

export const showForm = asyncHandler( async (req, res) => {
    // url : domain/form/:formId

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

    const form = await Form.findOne({ _id: formId, userId })

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

export const showForms = asyncHandler( async (req, res) => {
    const userId = req.jwt.id

    const forms = await Form.find({ userId })

    if(!forms){
        res.status(404)
        throw new Error("FORMS_NOT_FOUND")
    }

    res.status(200).json({
        status: true,
        message: "LIST_FORMS",
        forms
    })
})

export const deleteForm = asyncHandler( async(req, res) => {
    // url : domain/form/:formId

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

    const form = await Form.findOneAndDelete({ _id: formId, userId })

    if(!form){
        res.status(404)
        throw new Error("FORM_DELETE_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "FORM_DELETE_SUCCESS",
        form
    })
})

export const updateForm = asyncHandler( async(req, res) => {
    // url : domain/form/:formId

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

    const form = await Form.findOneAndUpdate({ _id: formId, userId }, req.body, { new: true })

    if(!form){
        res.status(404)
        throw new Error("FORM_UPDATE_FAILED")
    }

    res.status(200).json({
        status: true,
        message: "FORM_UPDATE_SUCCESS",
        form
    })
})