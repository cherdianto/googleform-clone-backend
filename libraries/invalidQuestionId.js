const invalidQuestionId = async (form, answers) => {
    const found = answers.filter(answer => {
        let question = form.questions.some(question => {
            // return question.id === answer.questionId // it is not working, due to strict rule, value is 'new objectid xxxxx'
            return question.id.valueOf() === answer.questionId.valueOf() // it is working and more strict 
            // return question.id == answer.questionId // it is also working, less strict
        })
        if(question === false){
            return true
        }
    })

    // console.log(found.length)
    return found.length > 0 ? found[0].questionId : false
}

export default invalidQuestionId