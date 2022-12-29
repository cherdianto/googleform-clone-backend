import Form from "../models/Form.js";
import asyncHandler from 'express-async-handler'

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