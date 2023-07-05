const optionAnswer = async (form, answers) => {
    const found = form.questions.filter((question) => {
        if(question.type === "Radio" || question.type === "Dropdown"){
            const answer = answers.find((answer) => answer.questionId == question.id)
            // console.log(answer)
            if(answer){
                const option = question.options.find((option) => option.value == answer.value)
                if(option === undefined){
                    return true
                }
            }
        } else if (question.type === "Checkbox"){
            const answer = answers.find((answer) => answer.questionId == question.id)
            
            if(answer){

                // check whether the answer is in array format or not? it should be an array
                const isItArray = Array.isArray(answer.value)
                if(!isItArray) {
                    return true
                }

                return answer.value.some(value => {
                    const option = question.options.find(option => option.value === value)
                    // console.log(option)
                    if(option === undefined){
                        return true
                    }
                })
            }
        }
    })

    return found.length > 0 ? found[0].id : false
}

export default optionAnswer