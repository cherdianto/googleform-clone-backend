import Form from "../models/Form.js"
import User from "../models/User.js"

const formAccess = async (form, userId) => {
    try {
        // const form = await Form.findOne({ _id: formId })
    
        // ARE YOU THE FORM OWNER? IS THE FORM PUBLIC?
        if(userId !== form.userId.valueOf() && form.public === false ){
            // get the user details
            const user = await User.findOne({ _id: userId })
    
            // are you invited?
            if(!form.invites.includes(user.email)) {
                return false
            }
        }
    
        return true
    } catch (error) {
        return false
    }
}

export default formAccess