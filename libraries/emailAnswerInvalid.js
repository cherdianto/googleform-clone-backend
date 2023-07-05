const emailAnswerInvalid = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == 'Email') {
      const answer = answers.find((answer) => answer.questionId == question.id);

      // if blank answer on not required question
      if (question.required === false) {
        if (
          answer === undefined ||
          answer.value === undefined ||
          answer.value === null
        ) {
          return false;
        }
      }

      if (answer) {
        console.log(answer);
        const regex = /[a-z0-9]+@[a-z]{2,3}/;
        if (regex.test(answer.value) === false) {
          console.log('here');
          return true;
        }
      }
    }
  });

  return found;
};

export default emailAnswerInvalid;
